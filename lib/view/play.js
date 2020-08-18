'use babel';

import React from 'react';

export default class Play extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      a: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      done: false,
      image: ""
    }

  }

  mix(){
    var a = [
        [1,2,3],
        [4,5,6],
        [7,8,9]
    ]

    var d = [[0,1],[0,-1],[1,0],[-1,0]]

    var n = 100
    var x = 2, y = 2
    var b = 0

    while(n){
      b = Math.floor(Math.random()*4)
      if(this.isvalid(x+d[b][0],y+d[b][1])){
        a[x][y] = a[x+d[b][0]][y+d[b][1]]
        a[x+d[b][0]][y+d[b][1]] = 9
        x+=d[b][0]
        y+=d[b][1]
        n--
      }
    }

    this.setState({a:a})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({});
  }

  reset(ele){
    this.setState({done:false, image: ""})
    var puzzle = ele.target.parentElement.children[1];
    puzzle.style.display = "flex";
    var finalimage = puzzle.parentElement.children[0];
    finalimage.hidden = true;
    this.fetchimage()
    this.mix()
  }

  fetchimage(){
    fetch("https://source.unsplash.com/random/280x280").then(res=>{
      this.setState({image: res.url})
    }).catch(err=> {
      this.setState({image: "https://images.unsplash.com/photo-1595496710086-d69bff2ccb19?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=280&ixlib=rb-1.2.1&q=80&w=280"})
    })
  }

  componentWillMount(){
    this.fetchimage()
    this.mix()
  }

  isvalid(x,y){
    return x >= 0 && x < 3 && y >= 0 && y < 3;
  }

  giveninth(ele){
    var parent = ele.target.parentElement
    for (var piece of parent.children) {
      if(piece.classList[1]=="p9"){
        return piece
      }
    }
  }

  check(ele) {
    var a = this.state.a;
    var res = true;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (a[i][j] != i * 3 + j + 1) {
          res = false;
          break
        }
      }
    }

    if (res) {
      this.setState({done:true})
      var puzzle = ele.target.parentElement;
      puzzle.style.display = "none";
      var finalimage = puzzle.parentElement.children[0];
      finalimage.hidden = false;
    }
  }

  move(ele) {
    var a = this.state.a;
    var done = this.state.done;
    var pie = ele.target;
    var cl = pie.classList[1];
    var p = cl[1];

    if (p == 9 || done) {
      return
    }

    var x = 0;
    var y = 0;
    var d = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (a[i][j] == p) {
          x = i;
          y = j;
          break;
        }
      }
    }

    for (var i = 0; i < d.length; i++) {
      var x1 = d[i][0];
      var y1 = d[i][1];
      if (this.isvalid(x1 + x, y1 + y)) {
        if (a[x1 + x][y1 + y] == 9) {
          a[x1 + x][y1 + y] = parseInt(p);
          a[x][y] = 9;
          var ninth = this.giveninth(ele)
          pie.classList.toggle("p9");
          pie.classList.toggle(cl);
          ninth.classList.toggle("p9");
          ninth.classList.toggle(cl);
          break;
        }
      }
    }

    this.setState({a:a})

    this.check(ele)
  }

  render() {
    return (
      <div className="container">
        <br/>
        <div className="page">
          <div className="finalimage" hidden>
            <img src={this.state.image}/>
          </div>
          <div className="puzzle">
            {this.state.a && this.state.a.map(row=>{
              return row.map(piece=>{
                return <div className={"piece p"+piece}
                onClick={this.move.bind(this)}
                style={{background: "url("+ this.state.image +")"}}
                ></div>
              })
            })}
          </div>
          <button className="nextbutton" onClick={this.reset.bind(this)}>Next</button>
        </div>
      </div>
    )
  }
}

// <div className="piece p4" onClick={this.move.bind(this)}></div>
// <div className="piece p3" onClick={this.move.bind(this)}></div>
// <div className="piece p8" onClick={this.move.bind(this)}></div>
// <div className="piece p2" onClick={this.move.bind(this)}></div>
// <div className="piece p5" onClick={this.move.bind(this)}></div>
// <div className="piece p7" onClick={this.move.bind(this)}></div>
// <div className="piece p1" onClick={this.move.bind(this)}></div>
// <div className="piece p6" onClick={this.move.bind(this)}></div>
// <div className="piece p9" onClick={this.move.bind(this)}></div>
// background: url("https://images.unsplash.com/photo-1559633657-c3008b46bac6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=80");
