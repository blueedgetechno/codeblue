'use babel';

import React from 'react';
import Problems from './problems';
import config from '../config'
import cheerio from 'cheerio'
import Play from './play'
import TikTac from './tiktac'

import { exec } from 'child_process'

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
      isLoggedIn: 2,
      profimg: "//imgbin.com/png/LGzVdNb1/computer-icons-avatar-user-login-png"
    };

    // this.state = {
    //   desc: "codeforces div 2",
    //   id: 1451,
    //   finished: 0,
    //   changed: 2,
    //   createnv: false,
    //   openinbrowser: false,
    //   currentgame: 0,
    //   timeremaining: 0,
    //   isLoggedIn: 2,
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

  LoginCodeforces(){
    console.log("Login Initiated");
    var handle = atom.config.get("codeblue.codeforcesHandle"),
        password = atom.config.get("codeblue.codeforcesPassword")

    if(handle==null || password==null) return

    var cmd = "oj login https://codeforces.com -u "+handle+" -p "+password;
    exec(cmd,(error, stdout, stderr)=>{
      this.setState({isLoggedIn: (error == null)})
      if(error!=null){
        atom.notifications.addWarning("Login Failed, check you password in settings > packages > codeblue")
      }
    })
  }

  checkLogin(){
    var cmd = "oj login --check https://codeforces.com";
    exec(cmd,{
      timeout: 2500,
      maxBuffer: 1024*32
    },(error, stdout, stderr)=>{
      this.setState({isLoggedIn: (error == null), loginSuccess: (error==null)})
      if(error!=null){
        // console.log(error.code);
        // atom.notifications.addWarning("Login Check failed, check installation of online-judge-tools or your internet connection")
      }
    })
  }

  componentWillMount(){
    this.fetchprofileimage()
    this.checkLogin()
  }

  render() {
    var handle = atom.config.get("codeblue.codeforcesHandle")

		return (
			<div>
        <div className="profile">
          <div className="profiledesc">
            <div className="profile-image">
              <img src={"https:"+this.state.profimg}/>
            </div>
            <span>{handle}</span>
          </div>
          <div className="loginerror">
            {this.state.isLoggedIn==1 && this.state.changed!=2?
              <span className="doLog">Logged In</span>:null}
            {this.state.isLoggedIn==0 && this.state.changed!=2?
              <button onClick={this.LoginCodeforces.bind(this)} className="btn notLog">Log In</button>:null}

          </div>
        </div>

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
            <button disabled={this.state.id==""} id="submit" onClick={()=> this.display()}>Submit</button>
            <div className="tips">
              <h3>Tips</h3>
              <ul>
                <li>Set your <b>working directory</b> in the <b>package settings</b> to avoid
                any rushing.</li>
                <li>Make sure to <b>download online-judge-tools</b> if you wish to submit
                from plugin.</li>
                <li>Set your <b>password</b> in the package settings if you wish to login
                from the plugin itself.</li>
                <li>You can click on the <b>yellow user icon <i className="icon-person"></i></b> to expand the <b>standing
                view</b> of you and your friends, again <b>set their userIds</b> in the
                package settings.</li>
                <li>You can also <b>setup your working directory</b> the middle of the
                contest by <b>clicking on your profile picture</b>.</li>
              </ul>
            </div>
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
          <Problems contest={this.state} LoginCodeforces={this.LoginCodeforces.bind(this)}/>
        ):null}

			</div>
		);
	}
}
