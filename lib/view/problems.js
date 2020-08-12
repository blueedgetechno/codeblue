'use babel';

import React from 'react'
import Problem from './problem'
import Actions from './actions'
import request from 'request'
import cheerio from 'cheerio'
import RecentSubmissions from './recentsubmissions'

export default class Problems extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      curr: 1,
      mystanding: -1,
      probs: [],
      noftests: [],
      allverdicts: {},
      allinputs: {},
      alloutputs: {},
      actions: []
    };
  }

  changecurr(ele){
    var hd = ele.target.innerText
    hd = hd.split(" ")
    var id = hd[0];
    var i=0

    while(this.state.probs[i]!=null){
      if(this.state.probs[i].index == id){
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
    var pr = 1
    for (var x of this.state.noftests) {
      pr*=x;
      if(pr==0){
        return
      }
    }
    const setup = require('./setup');
    var wd = atom.config.get("codeblue.workingDirectory")
    wd = wd.split("\\")
    wd = wd.join("/")
    if(wd.substring(-1)!="/"){
      wd+="/"
    }

    var i = 0
    console.log("Setup initiated");
    for (var prob of this.state.probs) {
      setup(wd, {
        alpha: prob.index,
        tot: this.state.noftests[i]} ,
        ".py",
        this.state.allinputs[prob.index],
        this.state.alloutputs[prob.index])
      i++
    }

  }

  scrapetests(html, index){
    $ = cheerio.load(html)
    var i = 0
    var noftests = this.state.noftests
    var allinputs = this.state.allinputs
    var alloutputs = this.state.alloutputs
    var allverdicts = this.state.allverdicts
    var verdicts = []
    var inputs = []
    var outputs = []
    while(true){
      var io = $(`#pageContent > div.problemindexholder > div > div > div.sample-tests > div.sample-test > div:nth-child(${i+1}) > pre`).html()
      if(io){
        io = io.trim().split("<br>").join("\n").trim()
        if(i&1){
          outputs.push(io)
        }else{
          inputs.push(io)
          verdicts.push({n: Math.floor(i/2), verdict: "NONE"})
        }
      }else{
        noftests[index] = Math.floor(i/2)
        allinputs[this.state.probs[index].index] = inputs
        alloutputs[this.state.probs[index].index] = outputs
        allverdicts[this.state.probs[index].index] = verdicts
        break
      }
      i++
    }
    this.setState({noftests: noftests})
    this.setState({allinputs: allinputs})
    this.setState({alloutputs: alloutputs})
    this.setState({allverdicts: allverdicts})
    // this.createnv()
  }

  loadsamplecases(i){
    var url = "https://codeforces.com/contest/"+this.props.contest.id+"/problem/"+this.state.probs[i].index
    this.fetch(url).then((html) => {
      return this.scrapetests(html,i);
    }).catch((error) => {
      atom.notifications.addWarning(error.reason)
    })
  }

  loadallsamplecases(){
    var i = 0
    var noftests = []
    for (var i = 0; i < this.state.noftests.length; i++) {
      this.loadsamplecases(i)
    }
  }

  scrape(html){
    $ = cheerio.load(html)
    var i = 2
    var probs = []
    while(true){
      var sub = $(`#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(${i}) > td > a`).text().trim().substring(2)
      if(sub.length==0){
        break;
      }else{
        sub = sub.trim()
        probs.push(this.state.probs[i-2])
        probs[i-2].sub = sub
      }
      i++;
    }
    this.setState({probs: probs})
  }

  loadmystanding(){
    console.log("Loading my staning");
    var url = "https://codeforces.com/api/contest.standings?contestId="+ this.props.contest.id +"&from=1&handles=" + atom.config.get("codeblue.codeforcesHandle")
    fetch(url)
      .then(res=> res.json())
      .then(res=> this.setState({mystanding: res.result.rows[0].rank}))
      .catch(err => console.log(err))
  }

  loadsubmissions(){
    console.log("Loading new submissions");
    var url = "https://codeforces.com/contest/"+this.props.contest.id
    this.fetch(url).then((html) => {
      this.scrape(html);
    }).catch((error) => {
      atom.notifications.addWarning(error.reason)
    })
    this.loadmystanding()
    this.fetchactions()
  }

  fetchproblems(problems){
    var probs = []
    var noftests = []
    var allinputs = {}
    var alloutputs = {}
    var allverdicts = {}
    for (var problem of problems) {
      probs.push({
        index: problem.index,
        name: problem.name,
        verdict: "NONE",
        testset: "NONE",
        errtest: 0,
        sub: 0})
      allinputs[problem.index] = []
      alloutputs[problem.index] = []
      allverdicts[problem.index] = []
      noftests.push(0)
    }
    this.setState({probs: probs})
    this.setState({noftests: noftests})
    this.setState({allinputs: allinputs})
    this.setState({alloutputs: alloutputs})
    this.setState({allverdicts: allverdicts})
    this.loadsubmissions()
    this.loadallsamplecases()
    this.fetchactions()
  }

  updateactions(){
    var probs = []
    var i = 0
    for (var prob of this.state.probs) {
      probs.push(prob)
      for (var action of this.state.actions) {
        if(action.index==prob.index){
          probs[i].verdict = action.verdict
          probs[i].testset = action.testset
          probs[i].errtest = action.errtest
          break
        }
      }
      i++;
    }
    this.setState({probs: probs})
  }

  reloadactions(res){
    var actions = []
    for (var action of res) {
      var icon = ""
      if(action.verdict=="OK") icon="check"
      else if(action.verdict=="WRONG_ANSWER") icon="x"
      else if(action.verdict=="TIME_LIMIT_EXCEEDED") icon="clock"
      else if(action.verdict=="RUNTIME_ERROR") icon="stop"
      else if(action.verdict=="COMPILATION_ERROR") icon="alert"
      else if(action.verdict=="TESTING") icon = "kebab-horizontal"
      else if(action.verdict=="MEMORY_LIMIT_EXCEEDED") icon="database"

      actions.push({
        index: action.problem.index,
        verdict: action.verdict,
        testset: action.testset,
        errtest: action.passedTestCount+1,
        icon: icon,
        time: action.timeConsumedMillis,
        memory: action.memoryConsumedBytes/1000
      })
    }
    this.setState({actions: actions})
    // console.log(this.state.actions);
    this.updateactions()
  }

  fetchactions(){
    console.log("Loading my standing");
    var url = "https://codeforces.com/api/contest.status?contestId="+ this.props.contest.id +"&handle="+ atom.config.get("codeblue.codeforcesHandle")
    fetch(url)
      .then(res=> res.json())
      .then(res=> this.reloadactions(res.result))
      .catch(err => console.log(err))
  }

  componentWillMount(){
    var url = "https://codeforces.com/api/contest.standings?contestId="+this.props.contest.id+"&from=1&count=1"
    fetch(url)
    .then(res=>res.json())
    .then(res=> this.fetchproblems(res.result.problems))
    .catch(err=>console.log(err))
  }

  hide(ele){
    var val = ele.target.parentElement.nextElementSibling.style.display
    if(val=="flex"){
      ele.target.parentElement.nextElementSibling.style.display = "none";
    }else{
      ele.target.parentElement.nextElementSibling.style.display = "flex";
    }
  }

  render(){
    return (
      <div className="display">
        {this.state.probs.length ?
          <div className="headinfo">
            <span onClick={this.hide}><i className="icon-person"></i> {this.state.mystanding} </span>
            <button className="refreshsubmissions" onClick={this.loadsubmissions.bind(this)}>Refresh</button>
          </div>
        : null }
        <div className="problems" style={{display: "flex"}}>
          {this.state.probs.length ? this.state.probs.map(prob=>{
            return <Problem prob={prob} changer={this.changecurr.bind(this)} />
          }) : (
            <div className="loader"></div>
          )
        }
        </div>
        {this.state.probs.length ? <Actions prob={this.state.probs[this.state.curr]} tests={this.state.allverdicts[this.state.probs[this.state.curr].index]}/> : null }
        {this.state.probs.length ? <RecentSubmissions actions={this.state.actions}/> : null }
      </div>
    )}
}
