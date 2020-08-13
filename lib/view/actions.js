'use babel';

import React from 'react';

const Actions = ({prob,tests})=>{

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

  const runexamples = ()=>{
    const path = require('path');
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ""
    if(langcode==43) ext=".c"
    else if(langcode==54) ext=".cpp"
    else ext=".py"
    var wd = atom.config.get("codeblue.workingDirectory")
    var towhere = path.join(wd,prob.index)
    var torun = path.join(towhere,prob.index+ext)
    var inputfile = path.join(towhere,"examples/input1.in")

    cmd = "python "+ torun +" < " + inputfile

    const { exec } = require('child_process');
    exec(cmd,{
      timeout: 2500,
      maxBuffer: 1024*32,
      } ,function (error, stdout, stderr) {
        var res = {error: false, verdict: "none"}
        res.stdout = stdout
        if(error !== null){
          res.error = true
          if(error.killed){
            res.verdict = "TIME_LIMIT_EXCEEDED"
          }else if(error.code=="ERR_CHILD_PROCESS_STDIO_MAXBUFFER"){
            res.verdict = "MEMORY_LIMIT_EXCEEDED"
          }else{
            res.verdict = "RUNTIME_ERROR"
          }
          res.stderr = stderr
        }
        console.log(res);
    })


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
      <h2 className="title titlename">{prob.index} - {prob.name}</h2>
      <div className="tasks">
        <div className="task">
          <div className="up">
            <span onClick={change} className="icon icon-chevron-right">Examples</span>
            <button className="actionbutton" onClick={runexamples}>Run all</button>
          </div>
          <div className="down">
            {tests && tests.map(test=>{
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
