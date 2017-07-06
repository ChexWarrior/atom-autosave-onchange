'use babel';

class Package {

  constructor() {}

  onDidChangeCursorPosition(editor, workspace, isActive) {
    if (this._shouldSave(editor) && !this._autocompleteTriggered(workspace) && isActive)
      this.trigger(editor);
  }

  onDidStopChanging(editor, workspace) {
    if (this._shouldSave(editor) && !this._autocompleteTriggered(workspace))
      this.trigger(editor);
  }

  onAutoCompleteClose(editor, isActive) {
    if (this._shouldSave(editor) && isActive)
      this.trigger(editor);
  }

  trigger(editor) {
    Promise.resolve(editor.save())
      .then(() => console.log('Saved'))
      .catch((error) => console.log(error));
  }

  _shouldSave(editor) {
    return (editor.isModified() && editor.getPath()) ? true : false;
  }

  _autocompleteTriggered(workspace) {
    return workspace.querySelector('.autocomplete-plus') ? true : false;
  }
}

export {
  Package
};
