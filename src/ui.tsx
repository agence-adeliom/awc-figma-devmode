import { render, useWindowResize, Container, Text, VerticalSpace, DropdownOption, Dropdown, Button, useForm, Toggle, IconWarning32, Banner } from '@create-figma-plugin/ui'
import { emit } from "@create-figma-plugin/utilities";
import { Fragment, h } from 'preact'
import "!./assets/output.css";
import type { ResizeWindowHandler } from "@typing/ResizeWindowHandler";
import { useState, useEffect } from 'preact/hooks';

type Settings = {
  collection?: string;
  mode?: string;
  useReference?: boolean;
};

type CollectionDropdownOption = DropdownOption & {value?: string}
function Plugin({collections, settings}: {collections: VariableCollection[], settings: Settings}) {

  function onWindowResize(windowSize: {width: number, height: number}) {
    emit<ResizeWindowHandler>("RESIZE_WINDOW", windowSize);
  }

  useWindowResize(onWindowResize, {
    maxHeight: 320,
    maxWidth: 320,
    minHeight: 120,
    minWidth: 120,
    resizeBehaviorOnDoubleClick: "minimize",
  });

  const [collectionsList] = useState<Array<CollectionDropdownOption>>(
      collections
        .filter((collection) => collection.name.includes('[AWC]'))
        .map((collection): CollectionDropdownOption => {
          return {text: collection.name, value: collection.id}
      })
  );

  const [modesList, setModesList] = useState<Array<DropdownOption>>([]);

  
  const getModeList = (collection) => {
    setModesList(collections
      .find((item) => item.id === collection)
      ?.modes
      .map((modes): DropdownOption => {
        return {text: modes.name, value: modes.modeId}
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
      window.close()
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
    if(!formState.collection){
      setFormState(collectionsList[0]?.value, 'collection')
      getModeList(collectionsList[0]?.value)
    }else{
      getModeList(formState.collection)
    }
  }, [formState, collectionsList])

  if(!collectionsList){
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
      <VerticalSpace space='small'  />
      <Dropdown  onValueChange={setFormState} name="collection" options={collectionsList} value={collectionsList.find((item) => item?.value === formState.collection) ? formState.collection : collectionsList[0]?.value} variant="border" />
      
      { formState.collection && !!modesList.length  && (
        <Fragment>
          <VerticalSpace space='medium' />
          <Text>Variant</Text>
          <VerticalSpace space='small' />
          <Dropdown onValueChange={setFormState} name="mode" options={modesList} value={formState.mode} variant="border" />
        </Fragment>
      ) }

      <VerticalSpace space="medium" />
      
      <Toggle onValueChange={setFormState} name="useReference" value={formState.useReference}>
        <Text>Use reference</Text>
      </Toggle>

      <VerticalSpace space="medium" />

      <Button disabled={disabled === true} fullWidth onClick={handleSubmit}>
        Save
      </Button>
    </Container>
  )
}

export default render(Plugin);
