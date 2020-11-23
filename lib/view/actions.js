'use babel';

import React from 'react';
import copy from "copy-to-clipboard";

export default class Actions extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      prob: props.prob,
      inputs: props.inputs,
      outputs: props.outputs,
      tests: props.tests,
      runexamples: props.runexamples,
      submitsolution: props.submitsolution,
      changeignorevalue: props.changeignorevalue
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prob: nextProps.prob,
      inputs: nextProps.inputs,
      outputs: nextProps.outputs,
      tests: nextProps.tests,
      runexamples: nextProps.runexamples,
      submitsolution: nextProps.submitsolution,
      changeignorevalue: nextProps.changeignorevalue
    });
  }

  change(){
    var ele = this.refs.chevronbutton
    ele.classList.toggle("icon-chevron-right")
    ele.classList.toggle("icon-chevron-down")
    var val = this.refs.down.style.display
    if(val=="flex"){
      this.refs.down.style.display = "none";
    }else{
      this.refs.down.style.display = "flex";
    }
  }

  togglesubmit(ele){
    if(ele.target.classList.length>1){
      if(ele.target.classList[1]=="realsubmit"){
        this.state.submitsolution()
      }
    }
    var parent = ele.target.parentElement
    if(parent==null) return
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

  toggleverdict(ele){
    var sb = ele.target.nextElementSibling
    if(sb==null) return
    if(sb.classList[0]!="comparision" && sb.classList[0]!="errordetails") return
    var val = sb.style.display
    if(val!="none"){
      sb.style.display = "none"
    }else{
      if(sb.classList[0]=="comparision"){
        sb.style.display = "flex"
      }else{
        sb.style.display = "block"
      }
    }
  }

  copyinput(ele){
    var i = ele.target.innerText.split(" ")[1];
    copy(this.state.inputs[i-1]+"\n")
    ele.target.classList.add("copied")
    const exm = ele.target
    setTimeout(()=>{
      exm.classList.remove("copied")
    },300)
  }

  render(){
    return (
      <div className="actions">
        <h2 className="title titlename">{this.state.prob.index} - {this.state.prob.name}</h2>
        <div className="addoption">
          <div className="igcasediv">
            <input ref="igcase" type="checkbox" name="igcase" checked={this.state.prob.ignorecase} onChange={this.state.changeignorevalue}/>
            <span>Ignore case</span>
          </div>
        </div>
        <div className="tasks">
          <div className="task">
            <div className="up">
              <span ref="chevronbutton" onClick={this.change.bind(this)} className="icon icon-chevron-right">Examples</span>
              <button className="actionbutton" onClick={()=>{
                this.state.runexamples()
                this.refs.down.style.display = "flex"
                var ele = this.refs.chevronbutton
                if(ele.classList.contains("icon-chevron-right")){
                  ele.classList.toggle("icon-chevron-right")
                  ele.classList.toggle("icon-chevron-down")
                }
              }}>Run all</button>
            </div>
            <div ref="down" className="down" style={{display: "none"}}>
              {this.state.tests && this.state.tests.map(test=>{
                if(test.error){
                  if(test.stdout.length>0 && test.stderr.length>0) moredetails = <div className="errordetails"> <pre>{test.stdout}<br/>{test.stderr}</pre> </div>
                  else if(test.stdout.length>0 || test.stderr.length>0) moredetails = <div className="errordetails"> <pre>{test.stdout}{test.stderr}</pre> </div>
                  else moredetails = null
                }else{
                  if(test.icon=="x") moredetails = (
                    <div className="comparision" style={{display: "flex"}}>
                      <div className="outbox">
                        <pre>expected<br/>{this.state.outputs[test.n]}</pre>
                      </div>
                      <div className="outbox">
                        <pre>output<br/>{test.stdout}</pre>
                      </div>
                    </div>
                  )
                  else moredetails = null
                }
                return(<div className="verdict" key={Math.floor(Math.random()*1000000)}>
                  <div className="show-verdict" onClick={this.toggleverdict}><span onClick={this.copyinput.bind(this)}>example {test.n+1}</span> <i className={"icon-"+test.icon}></i></div>
                  {moredetails}
                </div>)
              })}
            </div>
          </div>
          <div className="task">
            <div className="up">
              <span className="icon icon-light-bulb">Submissions</span>
              {this.props.isLoggedIn==0?<button onClick={this.props.LoginCodeforces} className="actionbutton">Login</button>:null}
              <button onClick={this.togglesubmit.bind(this)} disabled={this.props.isLoggedIn==0} className="actionbutton" style={{display: "block"}}>Submit</button>
              <button onClick={this.togglesubmit.bind(this)} className="actionbutton realsubmit" style={{display: "none"}}>Submit</button>
              <button onClick={this.togglesubmit.bind(this)} className="actionbutton cancel" style={{display: "none"}}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
