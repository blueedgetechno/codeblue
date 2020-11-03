const fs = require('fs');
const path = require('path');
const data = require('./quotes.json');

const setup = (wd, prob, ext, inputs, outputs) => {

  var quote = data.data[Math.floor(Math.random() * data.data.length)].trim()
  var com = ""
  if(ext==".py") com = "# "
  if(ext==".c" || ext==".cpp") com = "// "
  quote = com + quote + "\n"
  if(atom.config.get("codeblue.codeforcesHandle")=="blue_edge"){
    quote += com + "by : Blue Edge - Create some chaos\n\n"
  }else{
    quote += "\n"
  }

  var dir = path.join(wd, prob.alpha)
  var fl = path.join(dir, prob.alpha + ext)
  var exp = path.join(dir, "examples")

  var inputpaths = []
  for (var i = 1; i <= prob.tot; i++) {
    inputpaths.push({
      dir: path.join(exp, "input" + i + ".in"),
      value: inputs[i - 1]
    })
  }

  var outputpaths = []
  for (var i = 1; i <= prob.tot; i++) {
    outputpaths.push({
      dir: path.join(exp, "output" + i + ".out"),
      value: outputs[i - 1]
    })
  }

  fs.mkdir(dir, (err) => {
    if (err && err.code != 'EEXIST') console.log("Error while creating problem folder", err.code);
    else {
      fs.writeFile(fl, quote, {
        flag: 'wx'
      }, (err) => {
        if (err) {
          if (err.code != 'EEXIST') console.log("Error while creating source file");
          else console.log("Skipping because source file already exist");
        }
      })

      fs.mkdir(exp, (err) => {
        if (err && err.code != 'EEXIST') console.log("Error while creating example folder", err);
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
