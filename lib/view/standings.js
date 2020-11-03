'use babel';

import React from 'react';

export default class Standings extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      contestId: props.contestId,
      probs: props.probs,
      friends: {},
      order: [],
      refreshbutton: props.refreshbutton
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      probs: nextProps.probs,
      refreshbutton: nextProps.refreshbutton
    });
  }

  sorting(){
    var friends = this.state.friends
    var order = Object.keys(friends)
    order.sort((a,b)=> (friends[a].rank>friends[b].rank?1:-1))
    this.setState({order: order})
  }

  async initiateorder(){
    console.log("Its happening");
    var friends = this.state.friends
    var friendsarray = Object.keys(friends)
    var url = "https://codeforces.com/api/contest.standings?contestId="
    var allfriends = atom.config.get("codeblue.friends");
    for (var friend of allfriends) {
      friend = friend.trim()
      await fetch(url+this.state.contestId+"&showUnofficial=false&from=1&handles="+friend)
        .then(res=> res.json())
        .then(res=> {
          if(res.status=="OK" && res.result.rows.length!=0){
            var data = res.result.rows[0]
            friends[friend] = {rank: data.rank, problemResults: data.problemResults}
          }
        })
    }
    this.setState({friends: friends},()=>{
      this.sorting()
    })
  }

  componentWillMount(){
    this.initiateorder()
  }

  render(){
    return (
      <div>
        <button className="refreshsubmissions" onClick={()=>{
          this.initiateorder()
          this.state.refreshbutton()
        }}>Refresh</button>
        <div className="standings" id="standingview" style={{display:"none"}}>
          <div className="friendslist">
            <div className="fredhead">
              <div className="rank">#</div>
              <div className="friendid">Who</div>
              {this.state.probs.map(prob=>{
                return <div key={Math.floor(Math.random()*10000000000)} className="probcell alpha">{prob.index}</div>
              })}
            </div>

            {this.state.order.map(friend=>{
              if(this.state.friends[friend]){
                return (
                  <div className="friend" key={Math.floor(Math.random()*10000000000)}>
                    <div className="rank">{this.state.friends[friend].rank}</div>
                    <div className="friendid">{friend}</div>
                    {this.state.friends[friend].problemResults.map(res=>{
                      var ver = ""
                      var count = ""
                      if(res.points>0){
                        ver = " correct"
                        count = "+"
                        if(res.rejectedAttemptCount>0){
                          count+=res.rejectedAttemptCount
                        }
                      }else{
                        if(res.rejectedAttemptCount>0){
                          ver = " incorrectattempt"
                          count="-"+res.rejectedAttemptCount
                        }
                      }
                      return <div key={Math.floor(Math.random()*10000000000)} className={"probcell points"+ver}>{count}</div>
                    })}
                  </div>
                )
              }else{
                return null
              }
            })}
          </div>
        </div>
      </div>
    )
  }
}
