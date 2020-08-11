const fs = require('fs');

const setup = (path, prob, ext) => {

  var dir = path + prob.alpha
  var fl = dir + "/" + prob.alpha + ext
  var exp = dir + "/examples/"
  var tests = []
  for (var i = 1; i <= prob.tot; i++) {
    tests.push(exp + "input" + i + ".in")
    tests.push(exp + "output" + i + ".out")
  }

  fs.mkdir(dir, (err) => {
    if (err && err.code!='EEXIST') console.log("Error while creating problem folder",err.code);
    else {
      fs.writeFile(fl, "", (err) => {
        if (err && err.code!='EEXIST') console.log("Error while creating source file", err);
      })

      fs.mkdir(exp, (err) => {
        if (err && err.code!='EEXIST') console.log("Error while creating example folder", err);
        else {
          for (var test of tests) {
            fs.writeFile(test, "", (err) => {
              if (err && err.code!='EEXIST') console.log("Error while creating input/output file");
            })
          }
        }
      })
    }
  })
}

module.exports = setup
