const fs = require('fs');

const setup = (path, prob, ext, inputs, outputs) => {

  var dir = path + prob.alpha
  var fl = dir + "/" + prob.alpha + ext
  var exp = dir + "/examples/"

  var inputpaths = []
  for (var i = 1; i <= prob.tot; i++) {
    inputpaths.push({dir : exp + "input" + i + ".in", value: inputs[i-1]})
  }

  var outputpaths = []
  for (var i = 1; i <= prob.tot; i++) {
    outputpaths.push({dir : exp + "output" + i + ".out", value: outputs[i-1]})
  }

  fs.mkdir(dir, (err) => {
    if (err && err.code!='EEXIST') console.log("Error while creating problem folder",err.code);
    else {
      fs.writeFile(fl, "", (err) => {
        if (err) console.log("Error while creating source file", err);
      })

      fs.mkdir(exp, (err) => {
        if (err && err.code!='EEXIST') console.log("Error while creating example folder", err);
        else {
          for (var input of inputpaths) {
            fs.writeFile(input.dir, input.value, (err) => {
              if (err) console.log("Error while writing input file");
            })
          }

          for (var output of outputpaths) {
            fs.writeFile(output.dir, output.value, (err) => {
              if (err) console.log("Error while writing output file");
            })
          }
        }
      })
    }
  })
}

module.exports = setup
