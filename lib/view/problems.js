'use babel';

import React from 'react'
import Problem from './problem'
import request from 'request'
import cheerio from 'cheerio'

export default class Problems extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      count: 0,
      probs: []
    };
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
        probs.push({alpha: al, name: nm, con: -1, test: 1, sub: sub});
      }
      i++;
    }
    this.setState({probs: probs})
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
      <div className="problems">
        {this.state.probs && this.state.probs.map(prob=>{
          return (<Problem prob={prob}/>)
        })
      }
      </div>
    )}
}

// [
//   {alpha: "A", name: "Suborrays"},
//   {alpha: "B", name: "Fix you"},
//   {alpha: "C", name: "Cyclic Permutations"},
//   {alpha: "D", name: "505"},
//   {alpha: "E", name: "Pairs of Pairs"}
// ]
