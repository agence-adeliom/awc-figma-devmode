//@ts-nocheck
import { on } from "@create-figma-plugin/utilities";
import type { ResizeWindowHandler } from "@typing/ResizeWindowHandler";
import { exportToJSON } from "@utils/figma";
import StyleDictionaryCore from "@StyleDictionary";
import webConfig from "@StyleDictionary/web";

function showSettingsUI(options, data) {
  if (typeof __html__ === 'undefined') {
      throw new Error('No UI defined');
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__="src/main.ts--default";const __SHOW_UI_DATA__=${JSON.stringify(typeof data === 'undefined' ? {} : data)};${__html__}</script>`;
  figma.showUI(html, {
      ...options,
      themeColors: typeof options.themeColors === 'undefined' ? true : options.themeColors
  });
}


export default function () {
  let settings = figma.root.getPluginData('settings') ? JSON.parse(figma.root.getPluginData('settings')) : null;
  if(!settings) {
    settings = figma.root.setPluginData('settings', JSON.stringify({
      collection: null,
      mode: null,
      useReference: true
    }))
  }

  const figmaModes = figma.variables.getLocalVariableCollections().reduce((accumulator, collection) => { return [...accumulator, ...collection.modes] }, [])

  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    function (windowSize: { width: number; height: number }) {
      const { width, height } = windowSize
      figma.ui.resize(width, height)
    }
  )

  on('SUBMIT', async function (data) {
    settings = data;
    figma.root.setPluginData('settings', JSON.stringify(settings))
    if (figma.editorType === "dev") {
      if(figma.mode !== 'codegen') {
        figma.closePlugin();
        return;
      }
      figma.codegen.refresh();
    }
  });

  if (figma.editorType === "dev" && figma.mode !== 'codegen') {
    showSettingsUI({ height: 240,  width: 240 }, {
      settings: settings,
      collections: figma.variables.getLocalVariableCollections()
        .map((collection) => {
          return {
            id: collection.id,
            name: collection.name,
            modes: collection.modes
          }
        }),
    })
  }


  figma.codegen.on("preferenceschange", ({propertyName}: CodegenPreferencesEvent): void => {   
    if(propertyName === "otherSettings"){        
      showSettingsUI({ height: 240,  width: 240 }, {
        settings: settings,
        collections: figma.variables.getLocalVariableCollections()
          .map((collection) => {
            return {
              id: collection.id,
              name: collection.name,
              modes: collection.modes
            }
          }),
      })
      return;
    }
    figma.codegen.refresh();
  });

  figma.codegen.on("generate", ({ _language, _node }: CodegenEvent): CodegenResult[] => {
    if(!settings?.mode || !settings?.collection) {
      return [
        {
          title: "ERROR",
          language: "PLAINTEXT",
          code: "Invalid settings. \nPlease select a compatible collection with the corresponding mode."
        }
      ] 
    }

    const outputReferences = settings.useReference;
    const tokensCollection = exportToJSON(settings.collection, settings.mode);
    const StyleDictionary = StyleDictionaryCore.extend({
      source: [tokensCollection],
      platforms: {
        scss: {
          transformGroup: "figma/css",
          buildPath: "build/scss/",
          files: [
            {
              destination: "_variables.scss",
              format: "scss/variables",
              filter: "validToken",
              options: {
                showFileHeader: false,
                outputReferences: outputReferences,
                unit: figma.codegen.preferences.unit,
                basePxFontSize: figma.codegen.preferences.scaleFactor
              },
            },
          ],
        },
        less: {
          transformGroup: "figma/css",
          buildPath: "build/less/",
          files: [
            {
              destination: "_variables.less",
              format: "less/variables",
              filter: "validToken",
              options: {
                showFileHeader: false,
                outputReferences: outputReferences,
                unit: figma.codegen.preferences.unit,
                basePxFontSize: figma.codegen.preferences.scaleFactor
              },
            },
          ],
        },
        css: {
          transformGroup: "figma/css",
          buildPath: "build/css/",
          files: [
            {
              destination: "_variables.css",
              format: "css/awc-format",
              filter: "validToken",
              options: {
                showFileHeader: false,
                outputReferences: outputReferences,
                unit: figma.codegen.preferences.unit,
                basePxFontSize: figma.codegen.preferences.scaleFactor,
                colorScheme: figmaModes.find((mode) => mode.modeId === settings?.mode)?.name
              },
            },
          ],
        },
        "json-flat": {
          transformGroup: "js",
          buildPath: "build/json/",
          files: [
            {
              destination: "styles.flat.json",
              format: "json/flat",
              filter: "validToken",
            },
          ],
        },
        "json-nested": {
          transformGroup: "js",
          buildPath: "build/json/",
          files: [
            {
              destination: "styles.nested.json",
              format: "json/nested",
              filter: "validToken",
            },
          ],
        }
      },
      ...webConfig
    });
    StyleDictionary.buildPlatform("css");
    StyleDictionary.buildPlatform("json-flat");
    StyleDictionary.buildPlatform("json-nested");
    const outputs = StyleDictionary.getOutput();

    return [
      {
        title: "CSS variables",
        language: "CSS",
        code: outputs['build/css/_variables.css'] || ''
      },
      {
        title: "JSON object",
        language: "JSON",
        code: outputs['build/json/styles.nested.json'] || ''
      },
      {
        title: "Flat JSON object",
        language: "JSON",
        code: outputs['build/json/styles.flat.json'] || ''
      }
    ]
  })

}
