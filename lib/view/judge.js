'use babel';

class Judge {
  constructor(){
    this.ignorewhitespace = true;
  }

  clearstring(s){
    s = s.trim()
    s = s.split("\n")
    for (var i = 0; i < s.length; i++) {
      s[i] = s[i].trim()
    }
    return s.join("\n")
  }

  verify(exp, out){
    exp = this.clearstring(exp)
    out = this.clearstring(out)
    return exp == out
  }

  beautify(err){
    err = err.trim()
    err = err.split("\n")
    var tmp = []
    for (var i = 1; i < err.length; i++) {
      if(err[i].length){
        if(err[i].includes("File")){
          err[i] = err[i].split(",")[1]
        }
        tmp.push(err[i].trim())
      }
    }

    var sol = []
    for (var i = 0; i < tmp.length; i++) {
      if(i&1^1){
        sol.push(tmp[i])
      }else{
        sol[sol.length-1]+=" : " + tmp[i]
      }
    }

    var toreturn = []

    for (var i = sol.length-1; i >=0 ; i--) {
      toreturn.push(sol[i])
    }

    return toreturn.join("\n");
  }

}

export default new Judge();
