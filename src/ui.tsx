import { render, useWindowResize, Container, Text, VerticalSpace, DropdownOption, Dropdown, Button, useForm, Toggle, IconWarning32, Banner, Modal, IconCross32 } from '@create-figma-plugin/ui'
import { emit } from "@create-figma-plugin/utilities";
import { Fragment, h } from 'preact'
import "!./assets/output.css";
import type { ResizeWindowHandler } from "@typing/ResizeWindowHandler";
import { useState, useEffect } from 'preact/hooks';
import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';
import { copyToClipboard } from 'figx';
import { monokai } from 'react-code-blocks';

type Settings = {
  collection?: string;
  mode?: string;
  useReference?: boolean;
  format?: string;
};

type CollectionDropdownOption = DropdownOption & { value?: string }

function Plugin({ collections, settings }: { collections: VariableCollection[], settings: Settings }) {

  function onWindowResize(windowSize: { width: number, height: number }) {
    emit<ResizeWindowHandler>("RESIZE_WINDOW", windowSize);
  }

  const [outputs, setOutputs] = useState<object>({});

  window.addEventListener(
    "message",
    ({ data }) => {
      const pluginMessage = data.pluginMessage;
      if (pluginMessage) {
        switch (pluginMessage.type) {
          case "OUTPUT":
            setOutputs(pluginMessage.data);
            break;
        }
      }
    },
    false,
  );

  useWindowResize(onWindowResize, {
    minHeight: 300,
    minWidth: 120,
    resizeBehaviorOnDoubleClick: "minimize",
  });

  const [collectionsList] = useState<Array<CollectionDropdownOption>>(
    collections
      .filter((collection) => collection.name.includes('[AWC]'))
      .map((collection): CollectionDropdownOption => {
        return { text: collection.name, value: collection.id }
      })
  );

  const [modesList, setModesList] = useState<Array<DropdownOption>>([]);
  const [showCode, setShowCode] = useState<boolean>(false);

  const [formatList] = useState<Array<CollectionDropdownOption>>([
    { text: 'CSS', value: 'css' },
    { text: 'JSON', value: 'json' },
    { text: 'JSON Flat', value: 'json-flat' }
  ])


  const getModeList = (collection) => {
    setModesList(collections
      .find((item) => item.id === collection)
      ?.modes
      .map((modes): DropdownOption => {
        return { text: modes.name, value: modes.modeId }
      }))
  }

  const {
    disabled,
    formState,
    handleSubmit,
    initialFocus,
    setFormState
  } = useForm<Settings>(settings, {
    close: function (_formState: Settings) {
    },
    submit: async function (formState: Settings) {
      emit('SUBMIT', formState)
      setShowCode(true)
    },
    transform: function (formState: Settings) {
      getModeList(formState.collection)
      return formState;
    },
    validate: function (_formState: Settings) {
      return true;
    }
  });

  useEffect(() => {
    if (!formState.collection) {
      setFormState(collectionsList[0]?.value, 'collection')
      getModeList(collectionsList[0]?.value)
    } else {
      getModeList(formState.collection)
    }
  }, [formState, collectionsList])

  if (!collectionsList) {
    return (
      <Container space='medium'>
        <VerticalSpace space='medium' />

        <Banner icon={<IconWarning32 />} variant="warning">
          There is no collection compatible with this plugin.
        </Banner>

        <VerticalSpace space='medium' />
      </Container>
    )
  }

  return (
    <Container space='medium' {...initialFocus}>
      <VerticalSpace space='medium' />

      <Text>Collection</Text>
      <VerticalSpace space='small' />
      <Dropdown onValueChange={setFormState} name="collection" options={collectionsList} value={collectionsList.find((item) => item?.value === formState.collection) ? formState.collection : collectionsList[0]?.value} variant="border" />

      {formState.collection && !!modesList.length && (
        <Fragment>
          <VerticalSpace space='medium' />
          <Text>Variant</Text>
          <VerticalSpace space='small' />
          <Dropdown onValueChange={setFormState} name="mode" options={modesList} value={formState.mode} variant="border" />
        </Fragment>
      )}

      <VerticalSpace space="medium" />

      <Fragment>
        <Text>Format</Text>
        <VerticalSpace space='small' />
        <Dropdown onValueChange={setFormState} name="format"
          options={formatList}
          value={formatList.find((item) => item?.value === formState.format) ? formState.format : formatList[0]?.value}
          variant="border" />
      </Fragment>

      <VerticalSpace space='medium' />


      <Toggle onValueChange={setFormState} name="useReference" value={formState.useReference}>
        <Text>Use reference</Text>
      </Toggle>

      <VerticalSpace space="medium" />

      <Button disabled={disabled === true} fullWidth onClick={handleSubmit}>
        Generate output
      </Button>

      {outputs[formState.format] && outputs[formState.format].code && (
        <Modal
          title={outputs[formState.format].title}
          open={showCode}
          closeButtonIcon={<IconCross32 />}
          onCloseButtonClick={() => setShowCode(false)}
        >
          <div style={{ padding: 0, overflow: 'auto', height: '80vh', width: '80vw', position: 'relative' }}>
            <div style={{ position: 'absolute', right: ".5rem", top: ".5rem", zIndex: 1 }}>
              <Button
                onClick={() => {
                  copyToClipboard(outputs[formState.format].code)
                  setShowCode(false)
                  emit('COPY_TO_CLIPBOARD', outputs[formState.format])
                }}
              >
                Copy to clipboard
              </Button>
            </div>

            <SyntaxHighlighter
              language={outputs[formState.format].language}
              style={themes.monokai}
            >
              {outputs[formState.format].code}
            </SyntaxHighlighter>
          </div>
        </Modal>
      )
      }
    </Container >
  )
}

export default render(Plugin);
