const {Node} = require("graph-fs");

const emptyit = (path) => {
  const directory = new Node(path);
  directory.clear();
}

const setup = (path, probs) => {
  emptyit(path)
  console.log(path);
}

module.exports = setup
