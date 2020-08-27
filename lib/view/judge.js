'use babel';

class Judge {
  constructor() {
    this.ignorewhitespace = true;
  }

  clearstring(s) {
    s = s.trim()
    s = s.split("\n")
    for (var i = 0; i < s.length; i++) {
      s[i] = s[i].trim()
    }
    return s.join("\n")
  }

  verify(exp, out, ig) {
    exp = this.clearstring(exp)
    out = this.clearstring(out)
    if (ig) {
      exp = exp.toUpperCase()
      out = out.toUpperCase()
    }
    return exp == out
  }

  beautify(err) {
    try {
      var dupli = err;
      err = err.trim()
      err = err.split("\n")
      var tmp = []
      for (var i = 1; i < err.length; i++) {
        if (err[i].length) {
          if (err[i].includes("File")) {
            err[i] = err[i].split(",")[1]
          }
          tmp.push(err[i].trim())
        }
      }

      var sol = []
      for (var i = 0; i < tmp.length; i++) {
        if (i & 1 ^ 1) {
          sol.push(tmp[i])
        } else {
          sol[sol.length - 1] += " : " + tmp[i]
        }
      }

      var toreturn = []

      for (var i = sol.length - 1; i >= 0; i--) {
        toreturn.push(sol[i])
      }

      return toreturn.join("\n");
    } catch (e) {
      return dupli;
    }
  }

  beautifycpp(err, fname) {
    try {
      var dupli = err;
      const path = require('path');
      err = err.trim()
      err = err.split("\n")
      var tmp = []
      for (var i = 1; i < err.length; i++) {
        if (err[i].length && err[i].includes("In function") == false) {
          err[i] = err[i].trim()
          var idx = err[i].indexOf(fname)
          if (idx == 0) {
            err[i] = err[i].replace(fname, path.basename(fname))
            var errarray = err[i].split(":")
            if (errarray[2].trim() != "note") {
              errarray[1] = "Line " + errarray[1]
              tmp.push(errarray.slice(1, ).join(":").trim())
            }
          }
        }
      }
      return tmp.join("\n")
    }catch (e) {
      return dupli;
    }
  }
}

export default new Judge();
