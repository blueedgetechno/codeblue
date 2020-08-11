'use babel';

import React from 'react';

const Problem = ({prob,changer})=>{
  if(prob.con==0){
    currentstate = <div className="accepted">Accepted</div>
  }else if (prob.con==1) {
    currentstate = <div className="wrong">Wrong on {prob.test}</div>
  }else if(prob.con==2){
    currentstate = <div className="tle">TLE on {prob.test}</div>
  }else if(prob.con==3){
    currentstate = <div className="queue"></div>
  }else if(prob.con==4){
    currentstate = <div className="runtime">RE on {prob.test}</div>
  }else{
    currentstate = <div></div>
  }
  return (
    <div onClick={changer} className="prob">
      <span>{prob.alpha} - {prob.name}</span>
      <span className="totsub"><i className="icon-person"></i>{prob.sub}</span>
      {currentstate}
    </div>
  )
}

export default Problem;
