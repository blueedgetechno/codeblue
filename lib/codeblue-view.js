'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './view/index'

export default class CodeblueView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');

    this.element.classList.add('codeblue');

    ReactDOM.render(<div> <Root/></div>, this.element);
  }

  serialize() {}

  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'CodeForces';
  }

  getURI() {
      return 'atom://codeblue';
  }

  getDefaultLocation() {
      return 'right';
  }

  getAllowedLocations() {
      return ['left', 'right'];
  }

}
