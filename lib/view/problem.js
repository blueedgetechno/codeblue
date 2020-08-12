'use babel';

import React from 'react';

const Problem = ({prob,changer})=>{
  if(prob.verdict=="OK"){
    if(prob.testset == "TESTS"){
      currentstate = <div className="accepted">Accepted</div>
    }else{
      currentstate = <div className="accepted">Pre pass</div>
    }
  }else if (prob.verdict=="WRONG_ANSWER") {
    currentstate = <div className="wrong">Wrong on {prob.errtest}</div>
  }else if(prob.verdict=="TIME_LIMIT_EXCEEDED"){
    currentstate = <div className="tle">TLE on {prob.errtest}</div>
  }else if(prob.verdict=="TESTING"){
    currentstate = <div className="queue"></div>
  }else if (prob.verdict=="MEMORY_LIMIT_EXCEEDED") {
    currentstate = <div className="mle">MLE on {prob.errtest}</div>
  }else if(prob.verdict=="RUNTIME_ERROR" || prob.verdict=="COMPILATION_ERROR"){
    currentstate = <div className="runtime">RE on {prob.errtest}</div>
  }else{
    currentstate = <div></div>
  }
  return (
    <div onClick={changer} className="prob">
      <span>{prob.index} - {prob.name}</span>
      <span className="totsub"><i className="icon-person"></i>{prob.sub}</span>
      {currentstate}
    </div>
  )
}

export default Problem;
