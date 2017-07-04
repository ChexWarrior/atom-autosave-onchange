'use babel';

/**
 * TRIGGER FORMATTING ON ENTER KEY
 * On action newline below
 * CHECK LINE CONTEXT TextEditor ::scopeDescriptorForBufferPosition(bufferPosition)
 * FORMAT ON ENTER Mutating Text ::insert new line (TextEditor) // Trigger any shortcuts on
 * ADD EW FILE BUTTON
 *
 *
 * For this 15 mins session, I want to
 * - emit a fake event
 * - check that it launched
 * - check that =y plugin's function was called
 * || check my pugin subscribttions
 */

import {
  CompositeDisposable
} from 'atom'; // Atom event handle
import {
  Package
} from './package'; // Our package class
import debounce from 'lodash.debounce';

const pack = new Package();
let isActive = true;
let disableOnCommit = true;
let saveDelay;

export default {
  config: {
    delay: {
      title: 'Delay',
      description: 'The amount of milliseconds after a change before editor auto saves',
      type: 'integer',
      default: 500,
      minimum: 500
    },
    disableOnCommit: {
      title: 'Git Plus: Disable on commit?',
      description: 'If true automatically disables autosave when creating a commit message (Git Plus automatically commits on save)',
      type: 'boolean',
      default: true
    }
  },

  toggle() {
    let message = null;
    isActive = !isActive;

    console.log('Toggle!');

    if (isActive) {
      atom.notifications.addInfo('Autosave Onchange Enabled!', {
        text: '',
        dismissable: true
      });
    } else {
      atom.notifications.addInfo('Autosave Onchange Disabled!', {
        text: '',
        dismissable: true
      });
    }
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'autosave-onchange:toggle': this.toggle
      }),
      atom.config.onDidChange('autosave-onchange.delay', (values) => {
        console.log(`autosave delay changed from ${values.oldValue} to ${values.newValue}`);
        saveDelay = values.newValue;
      }),
      atom.config.onDidChange('autosave-onchange.disableOnCommit', (values) => {
        console.log(`Disable on commit has changed: ${values.newValue}`);
        disableOnCommit = values.newValue;
      })
    );

    saveDelay = atom.config.get('autosave-onchange.delay');
    disableOnCommit = atom.config.get('autosave-onchange.disableOnCommit');
    let observeEditors = atom.workspace.observeTextEditors((editor) => {
      let activeWorkspace = atom.views.getView(editor);

      //TODO: Ensure that this would only occur if git-plus package is enabled...
      if (disableOnCommit && isActive && editor.getTitle() === 'COMMIT_EDITMSG') {
        console.log('Disabling autosave until commit screen is open...');
        this.toggle();
        editor.onDidDestroy(() => {
          console.log('Commit screen closed, enabling autosave...');
          if(!isActive) this.toggle();
        });
      }

      activeWorkspace.addEventListener('autocomplete-plus:cancel', (e) =>
        pack.onAutoCompleteClose(editor, isActive));

      editor.onDidChangeCursorPosition(
        debounce((ev) =>
          pack.onDidChangeCursorPosition(editor, activeWorkspace, isActive), saveDelay));
    });

    this.subscriptions.add(observeEditors);
  },

  deactivate() {
    // Remove all package event subscriptions
    this.subscriptions.dispose();
  },

  // Is called every time package executes a command
  serialize() {
    return;
  }
};
