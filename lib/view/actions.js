'use babel';

import React from 'react';

const Actions = ({prob})=>{

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
      <h2 className="title">{prob.alpha} - {prob.name}</h2>
      <div className="tasks">
        <div className="task">
          <div className="up">
            <span onClick={change} className="icon icon-chevron-right">Examples</span>
            <button className="actionbutton">Run all</button>
          </div>
          <div className="down">
            <div className="verdict"> <span>example 1</span> <i className="icon icon-check"></i> </div>
            <div className="verdict"> <span>example 2</span> <i className="icon icon-x"></i> </div>
            <div className="verdict"> <span>example 3</span> <i className="icon icon-clock"></i> </div>
            <div className="verdict"> <span>example 3</span> <i className="icon icon-alert"></i> </div>
          </div>
        </div>
        <div className="task">
          <div className="up">
            <span onClick={change} className="icon icon-chevron-right">Submissions</span>
            <button className="actionbutton">Submit</button>
          </div>
          <div className="down">
            <div className="verdict"> <span>example 1</span> <i className="icon icon-check"></i> </div>
            <div className="verdict"> <span>example 2</span> <i className="icon icon-x"></i> </div>
            <div className="verdict"> <span>example 3</span> <i className="icon icon-clock"></i> </div>
            <div className="verdict"> <span>example 3</span> <i className="icon icon-alert"></i> </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Actions;
