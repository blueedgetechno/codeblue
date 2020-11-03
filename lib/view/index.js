'use babel';

import React from 'react';
import Problems from './problems';
import config from '../config'
import cheerio from 'cheerio'
import Play from './play'
import TikTac from './tiktac'

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
    this.state = {
      desc: "",
      id: "",
      finished: 0,
      changed: 0,
      createnv: false,
      openinbrowser: false,
      timeremaining: 0,
      currentgame: 0,
      profimg: "//imgbin.com/png/LGzVdNb1/computer-icons-avatar-user-login-png"
    };

    // this.state = {
    //   desc: "codeforces div 2",
    //   id: 1443,
    //   finished: 0,
    //   changed: 2,
    //   createnv: false,
    //   openinbrowser: false,
    //   currentgame: 0,
    //   timeremaining: 0,
    //   profimg: "//templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
    // };
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
          if(contest.phase!="CODING"){
            this.setState({timeremaining: 1, finished: 1})
          }else{
            this.setState({timeremaining: 1})
          }
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

    // this.setState({currentgame: this.state.currentgame^1})
  }

  togglegame(i){
    this.setState({currentgame: i})
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

  Timer({sec}){
    return(
      <div className="timer">
        <span>Before contest</span>
        <span>
        {couple(Math.floor(sec/3600))} :{' '}
        {couple(Math.floor((sec%3600)/60))} :{' '}
        {couple(Math.floor((sec%3600)%60))}</span>
      </div>
    )
  }

  fetchinput(event){
    if(event.target){
      this.setState({id: event.target.value});
    }
  }

  backspace(){
    var s = this.state.id
    if(s.length){
      this.setState({id: s.slice(0,-1)})
    }
  }

  fetchenvalue(ele){
    if(ele.target){
      if(ele.target.id=="check"){
        this.setState({createnv: ele.target.checked});
      }
      if(ele.target.id=="open"){
        this.setState({openinbrowser: ele.target.checked});
      }
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
            <div className="firstrow">
              <span>ContestId</span>
              <input type="text" value={this.state.id} onChange={this.fetchinput.bind(this)}/>
              <button className="back" onClick={this.backspace.bind(this)}> <i className="icon-chevron-left"></i> </button>
            </div>
            <div className="customisation">
              <div className="initoption">
                <input type="checkbox" id="check" onChange={this.fetchenvalue.bind(this)}/>
                <span className="checkthis">Create environment</span>
              </div>
              <div className="initoption">
                <input type="checkbox" id="open" onChange={this.fetchenvalue.bind(this)}/>
                <span className="checkthis">Open problemset</span>
              </div>
            </div>
            <br/><button id="submit" onClick={()=> this.display()}>Submit</button>
          </div>
        ) : null}

        {this.state.changed==1 ? (
          <div className="waiting">
            <this.Timer sec={this.state.timeremaining} />
            <button onClick={()=>this.fetchtimeremaining()}>Refresh</button>
            {this.state.timeremaining>4?(
              <div className="gamelist">
                <span onClick={()=>{this.togglegame(0)}}>Slide</span>
                <span onClick={()=>{this.togglegame(1)}}>TikTac</span>
              </div>
            ):null}

            {this.state.timeremaining>4 && this.state.currentgame==0 ?<Play/>:null}
            {this.state.timeremaining>4 && this.state.currentgame==1 ?<TikTac/>:null}
          </div>
        ):null}

        {this.state.changed==2 ? (
          <Problems contest={this.state}/>
        ):null}

			</div>
		);
	}
}
