'use babel';

import React from 'react';
import Problems from './problems';

export default class Root extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = { num: 663, div: 2, id: 0 };
  }

  display(){
    var editor = atom.workspace.getActiveTextEditor();
    if(editor){
      console.log(editor);
    }
  }

  fetch(){

  }

  render() {
		return (
			<div>
        <h2>Codeforces Round #{this.state.num} (Div. {this.state.div})</h2>
        {this.state.id ? <input type="text"/> : <Problems contest={this.state}/> }
        <button onClick={()=> this.fetch()}>Submit</button>
			</div>
		);
	}
}

// <button onClick={()=> this.toggler()}>Click me</button>
