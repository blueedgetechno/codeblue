'use babel';

import React from 'react';

export default class TikTac extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      a: [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
      ],
      done: false,
      turn: 1,
      player: 0,
      temp: 0,
      playerscore: 0,
      computerscore: 0
    }
  }

  max(a){
    var mx = a[0];
    a.map(x=> mx=Math.max(x,mx))
    return mx
  }

  min(a){
    var mn = a[0];
    a.map(x=> mn=Math.min(x,mn))
    return mn
  }

  reset(){
    var a = [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1]
    ]

    this.setState({
      a: a,
      done: false,
      turn: this.state.turn^1,
      player: Math.floor(Math.random()*2)
      },()=>{
          if(this.state.turn){
            this.movecomputer()
          }
      })
  }

  check(){
    var neg = 0
    var a = this.state.a
    // console.log(a);
    var row = [0,0,0]
    var col = [0,0,0]
    var d = [0,0]
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if(a[i][j]+1==0){
          neg++
        }else{
          row[i]+=2*a[i][j]-1
          col[j]+=2*a[i][j]-1
          if(i==j) d[0]+=2*a[i][j]-1
          if(i+j==2) d[1]+=2*a[i][j]-1
        }
      }
    }

    // console.log(row);
    // console.log(col);
    // console.log(d);

    var winner = -1
    if(this.max(row)==3 || this.max(col)==3 || this.max(d)==3){
      winner = 1
    }

    if(this.min(row)==-3 || this.min(col)==-3 || this.max(d)==-3){
      winner = 0
    }

    if(winner!=-1){
      return winner
    }
    if(neg==0){
      return 2
    }
    else return -1
  }

  indexofchildren(ele){
    var parent = ele.target.parentElement
    var child = ele.target
    var i = 0;
    while(parent.children[i]!=child){
      i++;
    }
    return [Math.floor(i/3),i%3]
  }

  movecomputer(){
    if(this.state.done){
      this.reset()
      return
    }

    var winner = this.check();
    if(winner+1){
      var curr = this.state.player;
      if(winner==curr){
        // console.log("Com play");
        this.setState({playerscore: this.state.playerscore+1})
      }
      else if(winner==(this.state.player^1)){
        // console.log("Com com");
        this.setState({computerscore: this.state.computerscore+1})
      }

      this.setState({done: true})
      return
    }

    var res = [0,0]
    var a = this.state.a
    var i = 0, j=0, neg=0,x=0,y=0,sym = -1;
    var moved = false;
    var empty = [];
    console.log("Computer move");

    // self/////////

    var own=0
    sym = this.state.player^1

    i = 0
    while(i<3){
      j = 0
      own = 0
      neg = 0
      while(j<3){
        if(a[i][j]+1==0){
          neg++
          x=i
          y=j
          empty.push([x,y])
        }
        if(a[i][j]==sym) own++
        j++
      }
      if(own==2 && neg){
        a[x][y] = this.state.player^1
        moved = true
        this.setState({a:a})
        break
      }

      i++
    }

    if(moved) return

    j=0
    while(j<3){
      i = 0
      own = 0
      neg = 0
      while(i<3){
        if(a[i][j]+1==0){
          neg++
          x=i
          y=j
        }
        if(a[i][j]==sym) own++
        i++
      }

      if(own==2 && neg){
        a[x][y] = this.state.player^1
        moved = true
        this.setState({a:a})
        break
      }

      j++
    }

    if(moved) return

    i = 0
    own = 0
    neg = 0
    while(i<3){
      if(a[i][i]+1==0){
        neg++
        x=i
        y=i
      }
      if(a[i][i]==sym) own++
      i++
    }

    if(own==2 && neg){
      a[x][y] = this.state.player^1
      moved = true
      this.setState({a:a})
    }

    if(moved) return

    i = 0
    own = 0
    neg = 0
    while(i<3){
      if(a[i][2-i]+1==0){
        neg++
        x=i
        y=2-i
      }
      if(a[i][2-i]==sym) own++
      i++
    }

    if(own==2 && neg){
      a[x][y] = this.state.player^1
      moved = true
      this.setState({a:a})
    }

    if(moved) return


    /////opposition////////
    var opp=0
    sym = this.state.player

    while(i<3){
      j = 0
      opp = 0
      neg = 0
      while(j<3){
        if(a[i][j]+1==0){
          neg++
          x=i
          y=j
        }
        if(a[i][j]==sym) opp++
        j++
      }
      if(opp==2 && neg){
        a[x][y] = this.state.player^1
        moved = true
        this.setState({a:a})
        break
      }

      i++
    }

    if(moved) return

    j=0
    while(j<3){
      i = 0
      opp = 0
      neg = 0
      while(i<3){
        if(a[i][j]+1==0){
          neg++
          x=i
          y=j
        }
        if(a[i][j]==sym) opp++
        i++
      }

      if(opp==2 && neg){
        a[x][y] = this.state.player^1
        moved = true
        this.setState({a:a})
        break
      }

      j++
    }

    if(moved) return

    i = 0
    opp = 0
    neg = 0
    while(i<3){
      if(a[i][i]+1==0){
        neg++
        x=i
        y=i
      }
      if(a[i][i]==sym) opp++
      i++
    }

    if(opp==2 && neg){
      a[x][y] = this.state.player^1
      moved = true
      this.setState({a:a})
    }

    if(moved) return

    i = 0
    opp = 0
    neg = 0
    while(i<3){
      if(a[i][2-i]+1==0){
        neg++
        x=i
        y=2-i
      }
      if(a[i][2-i]==sym) opp++
      i++
    }

    if(opp==2 && neg){
      a[x][y] = this.state.player^1
      moved = true
      this.setState({a:a})
    }

    if(moved) return


    /////////random////////

    var selec = empty[Math.floor(Math.random()*empty.length)]
    var x = selec[0], y = selec[1]
    a[x][y] = this.state.player^1

    this.setState({a:a})
  }

  move(ele){
    if(this.state.done){
      this.reset()
      return
    }

    var winner = this.check();
    if(winner+1){
      if(winner==this.state.player){
        // console.log("play play");
        this.setState({playerscore: this.state.playerscore+1})
      }

      if(winner==(this.state.player^1)){
        // console.log("play com");
        this.setState({computerscore: this.state.computerscore+1})
      }

      this.setState({done: true})
      return
    }

    if(ele==null) return
    if(ele.target.classList.length>1) return
    // console.log(ele.target.classList);
    var a = this.state.a
    var pos = this.indexofchildren(ele)
    var x=pos[0], y=pos[1]
    a[x][y] = this.state.player;
    this.setState({a:a})
    this.setState({temp: this.state.temp^1})
    this.movecomputer()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({});
  }

  componentWillMount(){
    if(this.state.turn==0){
      this.movecomputer()
    }
  }

  render() {
    return (
      <div className="container">
        <div className="page">
          <div className="score">{this.state.playerscore}:{this.state.computerscore}</div>
          <div className="puzzle">
            {this.state.a && this.state.a.map(row=>{
              return row.map(val=>{
                var itstate = "square"
                if(val==1){
                  itstate+=" cross"
                }else if (val==0) {
                  itstate+=" circle"
                }
                return <div className={itstate}
                onClick={this.move.bind(this)}
                key={Math.floor(Math.random()*12551245)}>
                </div>
              })
            })}
          </div>
        </div>
      </div>
    )
  }
}
