'use babel';

import React from 'react';
import Problems from './problems';
import config from '../config'
import request from 'request'
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
    // this.state = { desc: "", id: "", changed: 0, timeremaining: 0};
    this.state = { desc: "Codeforces Round #663 (Div. 2)", id: 1176, changed: 2, timeremaining: 0}
  }

  fetch(url){
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'Unable to download page'
          })
        }
      })
    })
  }

  timesolver(s){
    var t = 0
    s = s.split(":")
    t+=3600*parseInt(s[0])
    t+=60*parseInt(s[1])
    t+=parseInt(s[2])
    return t
  }

  scrape(html){
    $ = cheerio.load(html)
    var tmp = $('#pageContent > div:nth-child(2) > span').text().trim()

    if(this.state.desc.length==0){
      var desc = $("#pageContent > div:nth-child(1) > div").text().trim()
      this.setState({desc: desc})
    }

    if(tmp.length){
      this.setState({timeremaining: this.timesolver(tmp)})
    }else{
      this.setState({changed: 2})
      this.setState({timeremaining: 0})
    }
  }

  fetchtimeremaining(){
    var url = "https://codeforces.com/contest/"+this.state.id+"/countdown"
    this.fetch(url).then((html) => {
      this.scrape(html)
    }).catch((error) => {
      atom.notifications.addWarning(error.reason)
    })
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
    // console.log(this.state);
  }

  render() {
		return (
			<div>
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
