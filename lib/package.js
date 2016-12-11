'use babel';

class Package {

    constructor() {
    }

    onDidChangeCursorPosition(editor, workspace) {

        if ( this._shouldSave(editor) && !this._autocompleteTriggered(workspace))
            this.trigger(editor);
    }

    onDidStopChanging( editor, workspace ) {

        if ( this._shouldSave(editor) && !this._autocompleteTriggered(workspace))
            this.trigger(editor);
    }

    onAutoCompleteClose( editor ) {

        if ( this._shouldSave(editor) )
            this.trigger(editor);
    }

    trigger(editor) {
        editor.save();
        console.log('Saved');
    }

    _shouldSave(editor) {
        return ( editor.isModified() && editor.getPath() ) ? true : false;
    }

    _autocompleteTriggered( workspace ) {
        return workspace.querySelector('.autocomplete-plus') ? true : false;
    }
}


export { Package };
