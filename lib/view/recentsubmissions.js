'use babel';

import React from 'react';

const RecentSubmissions = ({actions})=>{

  const change = (ele)=>{
    ele.target.classList.toggle("icon-chevron-right")
    ele.target.classList.toggle("icon-chevron-down")
    var val = ele.target.nextElementSibling.style.display
    if(val=="flex"){
      ele.target.nextElementSibling.style.display = "none";
    }else{
      ele.target.nextElementSibling.style.display = "flex";
    }
  }

  return (
    <div className="actions">
      <h2 className="title icon icon-chevron-down" onClick={change}>Recent Submissions</h2>
      <div className="tasks" style={{display: "flex"}}>
        <div className="task">
          <div className="action">
            {actions && actions.map(action=>{
              return(
                <div className="action-view" key={action.time*Math.floor(Math.random()*100000)}>
                  <span>{action.index}</span>
                  <i className={"icon-"+action.icon}> {action.errtest} </i>
                  <span>{action.time}ms</span>
                  {action.memory<1000?<span>{action.memory}kb</span>:<span>{Math.floor(action.memory/1000)}mb</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentSubmissions;

// check
// x
// clock
// alert
