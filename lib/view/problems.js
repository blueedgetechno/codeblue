'use babel';

import React from 'react'
import Problem from './problem'
import Actions from './actions'
import request from 'request'
import cheerio from 'cheerio'
import RecentSubmissions from './recentsubmissions'
import Judge from './judge'

export default class Problems extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      temp: 0,
      curr: 0,
      createnv: props.contest.createnv,
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

  changeignorevalue(){
    var probs = this.state.probs
    probs[this.state.curr].ignorecase^=1
    this.setState({probs: probs})
    this.setState({temp: this.state.temp^1})
  }

  runtestpy (i){
    console.log("Running python");
    const path = require('path');
    var prob = this.state.probs[this.state.curr]
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ".py"
    var wd = atom.config.get("codeblue.workingDirectory")
    var towhere = path.join(wd,prob.index)
    var torun = path.join(towhere,prob.index+ext)
    var inputfile = path.join(towhere,"examples/input"+i+".in")

    var allverdicts = this.state.allverdicts
    const { exec } = require('child_process');

    cmd = "python "+ torun +" < " + inputfile

    exec(cmd,{
      timeout: 2500,
      maxBuffer: 1024*32,
      },(error, stdout, stderr)=>{
        var res = {n: i-1, error: false, verdict: "none", icon: "none"}
        res.stdout = stdout.trim("\n")
        if(error !== null){
          res.error = true
          stderr = Judge.beautify(stderr)
          if(error.killed){
            res.verdict = "TIME_LIMIT_EXCEEDED"
            res.icon = "clock"
          }else if(error.code=="ERR_CHILD_PROCESS_STDIO_MAXBUFFER"){
            res.verdict = "MEMORY_LIMIT_EXCEEDED"
            res.icon = "database"
          }else{
            res.verdict = "RUNTIME_ERROR"
            res.icon = "alert"
          }
        }else{
          if(Judge.verify(res.stdout,this.state.alloutputs[prob.index][i-1],prob.ignorecase)){
            res.verdict="OK"
            res.icon="check"
          }else{
            res.verdict="WRONG_ANSWER"
            res.icon="x"
          }
        }
        res.stderr = stderr
        allverdicts[prob.index][i-1] = res
        this.setState({allverdicts: allverdicts})
        this.setState({temp: this.state.temp^1})
    })
  }

  runtestcpp (i){
    console.log("Running cpp or c");
    const path = require('path');
    var prob = this.state.probs[this.state.curr]
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ""
    if(langcode==43) ext=".c"
    else if(langcode==54) ext=".cpp"

    if(ext=="") return

    var wd = atom.config.get("codeblue.workingDirectory")
    var towhere = path.join(wd,prob.index)
    const fname = prob.index+ext
    var torun = path.join(towhere,fname)
    var tout = path.join(towhere,prob.index)
    var inputfile = path.join(towhere,"examples/input"+i+".in")

    var allverdicts = this.state.allverdicts

    const { exec } = require('child_process');

    var soft=""
    if(langcode==54){
      soft="g++ "
    }else if (langcode==43) {
      soft="gcc "
    }

    if(soft=="") return
    var cmd = soft+torun+" -o "+tout+" -fno-show-column -fno-diagnostics-show-caret"
    var cmd2 = tout+" < "+inputfile

    exec(cmd,{
      timeout: 2500,
      maxBuffer: 1024*32
      },(error, stdout, stderr)=>{
        // console.log("What");
        if(error !== null){
          var res = {n: i-1, error: true, verdict: "COMPILATION_ERROR", icon: "alert"}
          stderr = Judge.beautifycpp(stderr,torun)
          res.stderr = stderr
          res.stdout = stdout.trim()
          allverdicts[prob.index][i-1] = res
          this.setState({allverdicts: allverdicts})
          this.setState({temp: this.state.temp^1})
        }else{
          exec(cmd2,{
            timeout: 5000,
            maxBuffer: 1024*32
            },(error, stdout, stderr)=>{
              // console.log("The hell");
              var res = {n: i-1, error: false, verdict: "none", icon: "none"}
              res.stdout = stdout.trim()
              if(error !== null){
                res.error = true;
                if(error.killed){
                  // console.log("tle");
                  res.verdict = "TIME_LIMIT_EXCEEDED"
                  res.icon = "clock"
                }else if(error.code=="ERR_CHILD_PROCESS_STDIO_MAXBUFFER"){
                  // console.log("mle");
                  res.verdict = "MEMORY_LIMIT_EXCEEDED"
                  res.icon = "database"
                }else{
                  // console.log("runtime");
                  res.verdict = "RUNTIME_ERROR"
                  res.icon = "alert"
                  stderr = "Runtime error\nexit code : "+error.code
                }
              }else{
                if(Judge.verify(res.stdout,this.state.alloutputs[prob.index][i-1],prob.ignorecase)){
                  res.verdict="OK"
                  res.icon="check"
                }else{
                  res.verdict="WRONG_ANSWER"
                  res.icon="x"
                }
              }
              res.stderr = stderr
              allverdicts[prob.index][i-1] = res
              this.setState({allverdicts: allverdicts})
              this.setState({temp: this.state.temp^1})
          })
        }
    })

  }

  runexamples(){
    console.log("Running tests");
    var langcode = atom.config.get("codeblue.programmingLanguage")
    if(langcode==31 || langcode==41){
      for (var i = 0; i < this.state.noftests[this.state.curr]; i++) {
        this.runtestpy(i+1)
      }
    }

    if(langcode==43 || langcode==54){
      for (var i = 0; i < this.state.noftests[this.state.curr]; i++) {
        this.runtestcpp(i+1)
      }
    }

  }

  submitsolution(){
    console.log("Submitting solution");
    const path = require('path');
    var prob = this.state.probs[this.state.curr]
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ""
    if(langcode==43) ext=".c"
    else if(langcode==54) ext=".cpp"
    else ext=".py"
    var wd = atom.config.get("codeblue.workingDirectory")
    var towhere = path.join(wd,prob.index)
    var tosub = path.join(towhere,prob.index+ext)
    var proburl = "https://codeforces.com/contest/"+ this.props.contest.id +"/problem/" + prob.index

    cmd = "oj s " + proburl + " " + tosub + " --wait=0 --yes --no-open -l "+langcode

    const { exec } = require('child_process');
    exec(cmd,(error, stdout, stderr)=>{
        if(error !== null){
          console.log(error);
          atom.notifications.addError("Error occured while submitting")
        }else{
          this.loadsubmissions()
        }

    })
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

    this.setState({createnv: 0})

    const setup = require('./setup');
    var wd = atom.config.get("codeblue.workingDirectory")

    var i = 0
    console.log("Setup initiated");
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ""
    if(langcode==43) ext=".c"
    else if(langcode==54) ext=".cpp"
    else ext=".py"

    for (var prob of this.state.probs) {
      setup(wd, {
        alpha: prob.index,
        tot: this.state.noftests[i]} ,
        ext,
        this.state.allinputs[prob.index],
        this.state.alloutputs[prob.index])
      i++
    }
  }

  scrapetests(html, index){
    if(html==null) return
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
          verdicts.push({n: Math.floor(i/2), error:false, verdict: "none", icon: "none", stdout: "", stderr: "" })
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
    // console.log(this.state.allverdicts);
    if(this.state.createnv){
      this.createnv()
    }
  }

  loadsamplecases(i){
    var url = "https://codeforces.com/contest/"+this.props.contest.id+"/problem/"+this.state.probs[i].index
    this.fetch(url).then((html) => {
      return this.scrapetests(html,i);
    }).catch((error) => {
      console.log(error);
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
    if(html==null) return
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
    // console.log("Loading my standing");
    var url = "https://codeforces.com/api/contest.standings?contestId="+ this.props.contest.id +"&from=1&handles=" + atom.config.get("codeblue.codeforcesHandle")
    fetch(url)
      .then(res=> res.json())
      .then(res=> this.setState({mystanding: res.result.rows[0].rank}))
      .catch(err => console.log(err))
  }

  loadsubmissions(){
    console.log("Refreshing");
    // console.log("Loading new submissions");
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
    // console.log("Fetching problems", problems);
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
        ignorecase: 0,
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
      probs[i].verdict = "NONE"
      for (var action of this.state.actions) {
        if(action.index==prob.index){
          if(action.verdict!="OK" && probs[i].verdict!="NONE" ){
            continue
          }
          probs[i].verdict = action.verdict
          probs[i].testset = action.testset
          probs[i].errtest = action.errtest
        }
      }
      i++;
    }
    this.setState({probs: probs})
  }

  reloadactions(res){
    if(res==null) return
    var actions = []
    for (var action of res) {
      var icon = ""
      if(action.verdict=="OK") icon="check"
      else if(action.verdict=="WRONG_ANSWER") icon="x"
      else if(action.verdict=="TIME_LIMIT_EXCEEDED") icon="clock"
      else if(action.verdict=="RUNTIME_ERROR") icon="stop"
      else if(action.verdict=="COMPILATION_ERROR") icon="alert"
      else if(action.verdict=="MEMORY_LIMIT_EXCEEDED") icon="database"
      else if(action.verdict=="CHALLENGED") icon="flame"
      else icon = "hourglass"

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
    this.updateactions()
  }

  fetchactions(){
    // console.log("Loading my actions");
    var url = "https://codeforces.com/api/contest.status?contestId="+ this.props.contest.id +"&handle="+ atom.config.get("codeblue.codeforcesHandle")
    fetch(url)
      .then(res=> res.json())
      .then(res=> this.reloadactions(res.result))
      .catch(err => console.log(err))
  }

  restart(){
    // console.log("Hurray");
    // return
    var url = "https://codeforces.com/api/contest.standings?contestId="+this.props.contest.id+"&from=1&count=1"
    fetch(url)
    .then(res=>res.json())
    .then(res=> this.fetchproblems(res.result.problems))
    .catch(err=>{
      console.log(err)
      atom.notifications.addWarning("Error while fetching problems")
    })
  }

  componentWillMount(){
    var url = "https://codeforces.com/api/contest.standings?contestId="+this.props.contest.id+"&from=1&count=1"
    fetch(url)
    .then(res=>res.json())
    .then(res=> this.fetchproblems(res.result.problems))
    .catch(err=>{
      console.log(err)
      atom.notifications.addWarning("Error while fetching problems")
    })

    var intervaltime = atom.config.get("codeblue.refreshinterval")

    if(this.props.contest.finished==0 && false){
      setInterval(()=>{this.loadsubmissions()},intervaltime*1000)
    }
  }

  changeproblem(activepath){
    if(activepath==null) return

    const path = require('path')

    var wd = atom.config.get("codeblue.workingDirectory")
    var langcode = atom.config.get("codeblue.programmingLanguage")
    var ext = ""
    if(langcode==43) ext=".c"
    else if(langcode==54) ext=".cpp"
    else ext=".py"

    var i=0
    activepath = path.resolve(activepath)

    for (var prob of this.state.probs) {
      var towhere = path.join(wd,prob.index)
      var tofile = path.join(towhere,prob.index+ext)
      tofile = path.resolve(tofile)
      if(tofile==activepath){
        this.setState({curr: i})
        break
      }
      i++;
    }
  }

  componentDidMount() {
    atom.workspace.observeActiveTextEditor(editor=>{
      if (editor){
        this.changeproblem(editor.getPath())
      }
    })
  }

  hide(ele){
    if(ele==null) return
    var parent = ele.target.parentElement
    if(parent==null) return
    var tohide = parent.nextElementSibling
    if(tohide==null) return
    if(tohide.classList.length<1) return
    if(tohide.classList[0]!="problems") return
    var val = tohide.style.display
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
            <button className="refreshproblems" onClick={this.restart.bind(this)}>Restart</button>
          </div>
        : null }
        <div className="problems" style={{display: "flex"}}>
          {this.state.probs.length ? this.state.probs.map(prob=>{
            return <Problem prob={prob} changer={this.changecurr.bind(this)} key={prob.index} />
          }) : (
            <div className="loader"></div>
          )
        }
        </div>
        {this.state.probs.length ? <Actions
          prob={this.state.probs[this.state.curr]}
          inputs={this.state.allinputs[this.state.probs[this.state.curr].index]}
          outputs={this.state.alloutputs[this.state.probs[this.state.curr].index]}
          tests={this.state.allverdicts[this.state.probs[this.state.curr].index]}
          runexamples={this.runexamples.bind(this)}
          changeignorevalue={this.changeignorevalue.bind(this)}
          submitsolution={this.submitsolution.bind(this)}
         /> : null }
        {this.state.probs.length ? <RecentSubmissions actions={this.state.actions}/> : null }
      </div>
    )}
}
