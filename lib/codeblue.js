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
  treeView: null,

  activate(state) {
    this.subscriptions = null
    this.addSubscriptions()
  },

  addSubscriptions(){
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://codeblue')
          return new CodeblueView();
      }),

      atom.commands.add('atom-workspace', {
        'codeblue:toggle': () => this.toggle(),
        'codeblue:set-working-directory': () => this.setWorkingDirectory()
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

  consumeTreeView(treeView) {
      this.treeView = treeView;
  },

  toggle() {
    atom.workspace.toggle('atom://codeblue');
  },

  setWorkingDirectory(){
    if (!this.treeView) return;
    const paths = this.treeView.selectedPaths();
    if (!paths || paths.length !== 1) return;
    var path = paths[0];
    if (!path) return;

    console.log("setting ",path," as working directory");
    atom.config.set("codeblue.workingDirectory", path);
  }
};
