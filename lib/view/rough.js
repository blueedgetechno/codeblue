var timer = 1
var d1 = new Date()

function exec(cmd, handler = function(error, stdout, stderr){
  console.log(stdout);
  var d2 = new Date()
  console.log(d2.getTime() - d1.getTime());
  if(error !== null){
    console.log(stderr)}
  }){
  const childfork = require('child_process');
  return childfork.exec(cmd, handler);
}

const path = require('path');

var dir = "C:/Users/Rohan/OneDrive/Atom/codeforces/A"//A.py"
var pyfile = path.join(dir,"A.py")
var outfile = path.join(dir,"examples/run1.out")
var inputfile = path.join(dir,"examples/input1.in")

exec("python "+pyfile+ " < " + inputfile +" > "+outfile)
