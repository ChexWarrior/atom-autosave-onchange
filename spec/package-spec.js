'use babel';

import { Package } from '../lib/package';


describe('In the file package.js', () => {

    let editor,
        workspace,
        pack;

    beforeEach(() => {

        pack = new Package();
        workspace = jasmine.createSpyObj('workspace', ['querySelector']);
        editor = jasmine.createSpyObj('editor', ['save', 'isModified', 'getPath']);
    });

    describe("The jamsine spies", () => {

        it('The "save()" Spy should be defined', () => expect( editor.save ).toBeDefined() );

        it('The "isModified()" Spy should be defined', () => expect( editor.isModified ).toBeDefined() );

        it('The "getPath()" Spy should be defined', () => expect( editor.getPath ).toBeDefined() );
    });

    describe('The trigger() method', () => {

        it('Should call the save method', () => {

            pack.trigger(editor); // Triggering spy

            expect( editor.save ).toHaveBeenCalled();
        });
    });

    describe("The 'shouldSave()' method", () => {

        it("Should return false if 'isModified()' is false", () => {

            editor.isModified.andReturn(false); // Setting value returned by isModified()

            expect( pack._shouldSave(editor) ).toBe( false );
        });

        it("Should return false if 'getPath()' is undefined", () => {

            editor.getPath.andReturn(undefined); // Setting value returned by isModified()

            expect( pack._shouldSave(editor) ).toBe( false );
        });

        it("Should return true if both are true/defined", () => {

            editor.isModified.andReturn(true); // Setting value returned by isModified()
            editor.getPath.andReturn('path/whatevz.js'); // Setting value returned by isModified()

            expect( pack._shouldSave(editor) ).toBe( true );
        });
    });

    describe("The '_autocompleteTriggered()' method", () => {

        it("Should call the workspace's querySelector method", () => {

            pack._autocompleteTriggered( workspace ); // Triggering spy

            expect( workspace.querySelector ).toHaveBeenCalled();
        });

        it("Should return false if '.autocomplete-plus' class isn't found", () => {

            workspace.querySelector.andReturn(undefined);

            expect( pack._autocompleteTriggered( workspace ) ).toBe( false );
        });

        it("Should return true if '.autocomplete-plus' class is found", () => {

            workspace.querySelector.andReturn(true);

            expect( pack._autocompleteTriggered( workspace ) ).toBe( true );
        });
    });
});


xdescribe('AutosaveDelay', () => {
    let workspaceElement, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage('autosave-onchange');
    });

    describe('when the autosave-onchange:toggle event is triggered', () => {
        it('hides and shows the modal panel', () => {
            // Before the activation event the view is not on the DOM, and no panel
            // has been created
            expect(workspaceElement.querySelector('.autosave-onchange')).not.toExist();

            // This is an activation event, triggering it will cause the package to be
            // activated.
            atom.commands.dispatch(workspaceElement, 'autosave-onchange:toggle');

            waitsForPromise(() => {
                return activationPromise;
            });

            runs(() => {
                expect(workspaceElement.querySelector('.autosave-onchange')).toExist();

                let autosaveDelayElement = workspaceElement.querySelector('.autosave-onchange');
                expect(autosaveDelayElement).toExist();

                let autosaveDelayPanel = atom.workspace.panelForItem(autosaveDelayElement);
                expect(autosaveDelayPanel.isVisible()).toBe(true);
                atom.commands.dispatch(workspaceElement, 'autosave-onchange:toggle');
                expect(autosaveDelayPanel.isVisible()).toBe(false);
            });
        });

        it('hides and shows the view', () => {
            // This test shows you an integration test testing at the view level.

            // Attaching the workspaceElement to the DOM is required to allow the
            // `toBeVisible()` matchers to work. Anything testing visibility or focus
            // requires that the workspaceElement is on the DOM. Tests that attach the
            // workspaceElement to the DOM are generally slower than those off DOM.
            jasmine.attachToDOM(workspaceElement);

            expect(workspaceElement.querySelector('.autosave-onchange')).not.toExist();

            // This is an activation event, triggering it causes the package to be
            // activated.
            atom.commands.dispatch(workspaceElement, 'autosave-onchange:toggle');

            waitsForPromise(() => {
                return activationPromise;
            });

            runs(() => {
                // Now we can test for view visibility
                let autosaveDelayElement = workspaceElement.querySelector('.autosave-onchange');
                expect(autosaveDelayElement).toBeVisible();
                atom.commands.dispatch(workspaceElement, 'autosave-onchange:toggle');
                expect(autosaveDelayElement).not.toBeVisible();
            });
        });
    });
});
