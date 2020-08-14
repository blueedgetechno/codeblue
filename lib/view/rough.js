var PrettyError = require('pretty-error');
var pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPath('C:/Users/Rohan/OneDrive/Atom/codeforces/A/A.py');
var renderedError = pe.render(new Error('Traceback (most recent call last):\nFile "C:/Users/Rohan/OneDrive/Atom/codeforces/A/A.py", line 8, in <module>\nprint(1/0)\nZeroDivisionError: division by zero'));
console.log(renderedError);
