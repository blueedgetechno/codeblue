'use babel';

import CodeblueView from './codeblue-view';
import {
  CompositeDisposable,
  Disposable
} from 'atom';
import config from './config'

export default {

  subscriptions: null,
  config,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://codeblue')
          return new CodeblueView();
      }),

      atom.commands.add('atom-workspace', {
        'codeblue:toggle': () => this.toggle()
      }),

      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof CodeblueView) {
            item.destroy();
          }
        })
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://codeblue');
  }
};
