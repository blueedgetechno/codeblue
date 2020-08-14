'use babel';

import React from 'react';

export default class Actions extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      prob: props.prob,
      tests: props.tests,
      runexamples: props.runexamples
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prob: nextProps.prob,
      tests: nextProps.tests,
      runexamples: nextProps.runexamples
    });
  }

  change(ele){
    ele.target.classList.toggle("icon-chevron-right")
    ele.target.classList.toggle("icon-chevron-down")
    var val = ele.target.parentElement.nextElementSibling.style.display
    if(val=="flex"){
      ele.target.parentElement.nextElementSibling.style.display = "none";
    }else{
      ele.target.parentElement.nextElementSibling.style.display = "flex";
    }
  }

  togglesubmit(ele){
    var parent = ele.target.parentElement
    for (var i = 1; i < parent.children.length; i++) {
      var child = parent.children[i]
      var val = child.style.display
      if(val=="block"){
        child.style.display = "none";
      }else{
        child.style.display = "block";
      }
    }
  }

  render(){
    return (
      <div className="actions">
        <h2 className="title titlename">{this.state.prob.index} - {this.state.prob.name}</h2>
        <div className="tasks">
          <div className="task">
            <div className="up">
              <span onClick={this.change.bind(this)} className="icon icon-chevron-right">Examples</span>
              <button className="actionbutton" onClick={this.state.runexamples}>Run all</button>
            </div>
            <div className="down" style={{display: "none"}}>
              {this.state.tests && this.state.tests.map(test=>{
                return(<div className="verdict">
                  <div className="show-verdict"><span>example {test.n+1}</span> <i className={"icon-"+test.icon}></i></div>
                  <div className="errordetails"> <pre>{test.stderr}</pre> </div>
                </div>)
              })}
            </div>
          </div>
          <div className="task">
            <div className="up">
              <span className="icon icon-light-bulb">Submissions</span>
              <button onClick={this.togglesubmit} className="actionbutton" style={{display: "block"}}>Submit</button>
              <button onClick={this.togglesubmit} className="actionbutton realsubmit" style={{display: "none"}}>Submit</button>
              <button onClick={this.togglesubmit} className="actionbutton cancel" style={{display: "none"}}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
