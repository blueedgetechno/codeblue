'use babel';

import React from 'react';

const Actions = ({prob,tests, runexamples})=>{

  state = {
    prob: prob,
    tests: tests,
    runexamples: runexamples
  }

  const change = (ele)=>{
    ele.target.classList.toggle("icon-chevron-right")
    ele.target.classList.toggle("icon-chevron-down")
    var val = ele.target.parentElement.nextElementSibling.style.display
    if(val=="flex"){
      ele.target.parentElement.nextElementSibling.style.display = "none";
    }else{
      ele.target.parentElement.nextElementSibling.style.display = "flex";
    }
    // console.log(ele.target.nextElementSibling);
  }

  const togglesubmit = (ele)=>{
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

  return (
    <div className="actions">
      <h2 className="title titlename">{state.prob.index} - {state.prob.name}</h2>
      <div className="tasks">
        <div className="task">
          <div className="up">
            <span onClick={change} className="icon icon-chevron-right">Examples</span>
            <button className="actionbutton" onClick={state.runexamples}>Run all</button>
          </div>
          <div className="down">
            {state.tests && state.tests.map(test=>{
              return <div className="verdict"> <span>example {test.n+1}</span> <i className={"icon-"+test.icon}></i> </div>
            })}
          </div>
        </div>
        <div className="task">
          <div className="up">
            <span className="icon icon-light-bulb">Submissions</span>
            <button onClick={togglesubmit} className="actionbutton" style={{display: "block"}}>Submit</button>
            <button onClick={togglesubmit} className="actionbutton realsubmit" style={{display: "none"}}>Submit</button>
            <button onClick={togglesubmit} className="actionbutton cancel" style={{display: "none"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Actions;

// var langcode = atom.config.get("codeblue.programmingLanguage")
// var ext = ""
// if(langcode==43) ext=".c"
// else if(langcode==54) ext=".cpp"
// else ext=".py"
