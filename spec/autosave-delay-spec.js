'use babel';

import AutosaveDelay from '../lib/autosave-delay';

describe('In the file autosave-delay.js', () => {

    let editor,
        workspace,
        activationPromise;

    describe("The package's", function () {

        beforeEach(function () {

            // Get editor
            waitsForPromise(() => atom.workspace.open('sample.js').then((e) => {
                editor = e
            }));

            // Get workspace
            workspace = atom.views.getView(atom.workspace);

            // Activate package
            waitsForPromise(() => atom.packages.activatePackage('autosave-delay') );

            // console.log(editor);
            // // waitsForPromise(() => {
            // // });
            // atom.workspace.observeTextEditors((_editor) => editor = _editor);
            //
            //
            // // Create workspace the workspace
            // workspace = atom.views.getView(editor);
            //
            // // Activate package
            //
            // waitsForPromise(() => editor.getBuffer().emitter.emit('did-change-cursor-position') );
            //

            // waitsForPromise(() => atom.packages.activatePackage('autosave-delay') );

            // Trigger onDidStopChanging, which is the first event triggerring plugin

            // console.log(atom.packages.activatePackage('autosave-delay'));
        });
        describe("Testing requirements", () => {

            it("Editor should be defined", () => expect( editor ).toBeDefined() );

            it('The package should be activated', () => expect( atom.packages.getActivePackage('autosave-delay') ).toBeDefined() );
        });

        /**
         * Testing behavior
         * - should lauch on onDidStopChanging
         * - should launch on autocomplete-plus close
         */
        //  calling onDidChangeCursorPosition
        //     spy on package.onDidChangeCursorPosition
    });
});
