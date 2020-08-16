'use babel';

import React from 'react';

export default class Play extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      a: [
        [4, 3, 8],
        [2, 5, 7],
        [1, 6, 9]
      ],
      done: false
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({});
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
        <div className="page" title="Profile presentation">
          <div className="finalimage" hidden>
            <img src="https://images.unsplash.com/photo-1559633657-c3008b46bac6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=80"/>
          </div>
          <div className="puzzle">
            <div className="piece p4" onClick={this.move.bind(this)}></div>
            <div className="piece p3" onClick={this.move.bind(this)}></div>
            <div className="piece p8" onClick={this.move.bind(this)}></div>
            <div className="piece p2" onClick={this.move.bind(this)}></div>
            <div className="piece p5" onClick={this.move.bind(this)}></div>
            <div className="piece p7" onClick={this.move.bind(this)}></div>
            <div className="piece p1" onClick={this.move.bind(this)}></div>
            <div className="piece p6" onClick={this.move.bind(this)}></div>
            <div className="piece p9" onClick={this.move.bind(this)}></div>
          </div>
        </div>
      </div>
    )
  }
}
