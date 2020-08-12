'use babel';

import React from 'react';
import Problems from './problems';
import config from '../config'
import cheerio from 'cheerio'

function exec(cmd, handler = function(error, stdout, stderr){
  console.log(stdout);
  if(error !== null){
    console.log(stderr)}
  }){
  const childfork = require('child_process');
  return childfork.exec(cmd, handler);
}

function couple(x) {
  if(x<10){
    return "0"+x
  }else{
    return x;
  }
}

export default class Root extends React.PureComponent {
  constructor(props){
    super(props);
    // this.state = {
    //   desc: "",
    //   id: "",
    //   changed: 0,
    //   timeremaining: 0,
    //   profimg: "//templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
    // };

    this.state = {
      desc: "Codeforces Round #664 (Div. 2)",
      id: 1395,
      changed: 2,
      timeremaining: 0,
      profimg: "//templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
    };
  }

  timesolver(s){
    var t = 0
    s = s.split(":")
    t+=3600*parseInt(s[0])
    t+=60*parseInt(s[1])
    t+=parseInt(s[2])
    return t
  }

  setcontest(contests){
    for (var contest of contests) {
      if(contest.id==this.state.id){
        this.setState({desc: contest.name})
        if(contest.phase=="BEFORE"){
          this.setState({timeremaining: -1*contest.relativeTimeSeconds})
        }else{
          this.setState({timeremaining: 1})
        }
        break;
      }
    }
  }

  fetchtimeremaining(){
    var url = "https://codeforces.com/api/contest.list"
    fetch(url)
    .then(res=>res.json())
    .then(res=> this.setcontest(res.result))
    .catch(err=>console.log(err))
  }

  display(){
    this.setState({changed: 1})
    this.fetchtimeremaining()
    var repeat = setInterval(()=>{
      this.setState({timeremaining: this.state.timeremaining-1})
      if(this.state.timeremaining==0){
        this.setState({changed: 2})
        clearInterval(repeat)
      }

      this.setState({timeremaining: Math.max(this.state.timeremaining, 0)})
    },1000)
  }

  pathfinder(){

    // var editor = atom.workspace.getActiveTextEditor();
    // if(editor){
    //   var file = editor.buffer.file
    //   if(file){
    //     var filepath = file.path
    //     exec("python "+filepath);
    //   }
    // }
  }

  Timer({sec}){
    return(
      <div className="timer">
        <span>Before contest</span>
        <span>{couple(Math.floor(sec/3600))} : {couple(Math.floor((sec%3600)/60))} : {couple(Math.floor((sec%3600)%60))}</span>
      </div>
    )
  }

  fetchinput(event){
    if(event.target){
      this.setState({id: event.target.value});
    }
  }

  fetchprofileimage(){
    var url = "https://codeforces.com/api/user.info?handles="+atom.config.get("codeblue.codeforcesHandle")
    fetch(url)
      .then(res=> res.json())
      .then(res=> this.setState({profimg: res.result[0].titlePhoto}))
      .catch(err => console.log(err))
  }

  Loadprofile({profimg}){
    var handle = atom.config.get("codeblue.codeforcesHandle")
    return (
      <div className="profile">
        <div className="profile-image">
          <img src={"https:"+profimg}/>
        </div>
        <span>{handle}</span>
      </div>
    )
  }

  componentWillMount(){
    this.fetchprofileimage()
  }

  render() {
		return (
			<div>
        <this.Loadprofile profimg={this.state.profimg}/>
        {this.state.changed ? <h2>{this.state.desc}</h2> : null}

        {this.state.changed==0 ? (
          <div className="fillup">
            <span>ContestId</span>
            <input type="text" value={this.state.id} onChange={this.fetchinput.bind(this)}/>
            <br/><button onClick={()=> this.display()}>Submit</button>
          </div>
        ) : null}

        {this.state.changed==1 ? (
          <div className="waiting">
          <this.Timer sec={this.state.timeremaining} />
            <button onClick={()=>this.fetchtimeremaining()} >Refresh</button>
          </div>
        ):null}

        {this.state.changed==2 ? (
          <Problems contest={this.state}/>
        ):null}

			</div>
		);
	}
}
// <button onClick={()=> this.pathfinder()}>Check</button>

// <button onClick={()=> this.toggler()}>Click me</button>

// <Problems contest={this.state} />
