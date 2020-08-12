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

  return (
    <div className="actions">
      <h2 className="title titlename">{prob.index} - {prob.name}</h2>
      <div className="tasks">
        <div className="task">
          <div className="up">
            <span onClick={change} className="icon icon-chevron-right">Examples</span>
            <button className="actionbutton">Run all</button>
          </div>
          <div className="down">
            {tests && tests.map(test=>{
              return <div className="verdict"> <span>example {test.n+1}</span> <i className="icon-check"></i> </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Actions;

// check
// x
// clock
// alert
