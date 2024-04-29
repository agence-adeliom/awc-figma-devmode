//@ts-nocheck
import { on, showUI } from "@create-figma-plugin/utilities";
import type { ResizeWindowHandler } from "@typing/ResizeWindowHandler";
import { exportToJSON } from "@utils/figma";
import StyleDictionaryCore from "@StyleDictionary";
import webConfig from "@StyleDictionary/web";
import { format } from "style-dictionary";

const figmaModes = figma.variables
  .getLocalVariableCollections()
  .reduce((accumulator, collection) => {
    return [...accumulator, ...collection.modes]
  }, [])

const generate = (settings) => {
  if (!settings?.mode || !settings?.collection) {
    throw new Error("Mode and collection are required");
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
              unit: 'SCALED',
              basePxFontSize: '16',
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
              unit: 'SCALED',
              basePxFontSize: '16',
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
              unit: 'SCALED',
              basePxFontSize: '16',
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

  try {
    StyleDictionary.buildPlatform("css");
    StyleDictionary.buildPlatform("json-flat");
    StyleDictionary.buildPlatform("json-nested");
    const outputs = StyleDictionary.getOutput();

    return {
      'css': {
        title: "CSS variables",
        language: "html",
        code: outputs['build/css/_variables.css'] || ''
      },
      'json': {
        title: "JSON object",
        language: "javascript",
        code: outputs['build/json/styles.nested.json'] || ''
      },
      'json-flat': {
        title: "Flat JSON object",
        language: "javascript",
        code: outputs['build/json/styles.flat.json'] || ''
      }
    }
  } catch (error) {
    return {
      error: error
    };
  }

};

export default function () {
  let settings = figma.root.getPluginData('settings') ? JSON.parse(figma.root.getPluginData('settings')) : null;

  if (!settings) {
    settings = figma.root.setPluginData('settings', JSON.stringify({
      collection: null,
      mode: null,
      useReference: true,
      format: 'css'
    }))
  }

  /**/

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
    figma.ui.postMessage({ type: 'OUTPUT', data: generate(settings) })
  });

  on('COPY_TO_CLIPBOARD', async function (data) {
    figma.notify(`${data.title} was copied to clipboard`)
  })

  showUI({ height: 600, width: 800 }, {
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

  /*
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
  
      
    })
  */
}
