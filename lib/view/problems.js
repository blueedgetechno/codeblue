'use babel';

import React from 'react'
import Problem from './problem'
import Actions from './actions'
import request from 'request'
import cheerio from 'cheerio'

export default class Problems extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      curr: 1,
      probs: []
    };
  }

  changecurr(ele){
    var hd = ele.target.innerText
    hd = hd.split(" ")
    var id = hd[0];
    var i=0

    while(this.state.probs[i]!=null){
      if(this.state.probs[i].alpha == id){
        this.setState({curr: i})
        break;
      }
      i++;
    }
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

  createnv(){
    const setup = require('./setup');
    var wd = atom.config.get("codeblue.workingDirectory")
    wd = wd.split("\\")
    wd = wd.join("/")
    if(wd.substring(-1)!="/"){
      wd+="/"
    }

    for (var prob of this.state.probs) {
      setup(wd, { alpha: prob.alpha, tot: 2} , ".py")
    }
  }

  loadsamplecases(){
    // console.log("Heelo");
  }

  scrape(html){
    $ = cheerio.load(html)
    var i = 2
    var probs = []
    while(true){
      var al = $(`#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(${i}) > td.id > a`).text().trim()
      if(al.length==0){
        break;
      }else{
        var nm = $(`#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > div:nth-child(1) > a`).text().trim()
        var sub = $(`#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(${i}) > td > a`).text().trim().substring(2)
        probs.push({alpha: al, name: nm, con: -1, test: 1, sub: sub, notc: 0, tests: [] });
      }
      i++;
    }
    this.setState({probs: probs})
    this.loadsamplecases()
  }

  componentWillMount(){
    var url = "https://codeforces.com/contest/"+this.props.contest.id
    this.fetch(url).then((html) => {
      this.scrape(html);
    }).catch((error) => {
      atom.notifications.addWarning(error.reason)
    })
  }

  render(){
    return (
      <div className="display">
        <div className="problems">
          {this.state.probs.length ? this.state.probs.map(prob=>{
            return <Problem prob={prob} changer={this.changecurr.bind(this)}/>
          }) : (
            <div className="loader"></div>
          )
        }
        </div>
        {this.state.probs.length ? <Actions prob={this.state.probs[this.state.curr]}/> : null }
      </div>
    )}
}
