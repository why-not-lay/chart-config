const fs = require("fs");
const path = require("path");
module.exports = class StaticReader {
  #root;
  constructor(root){
    this.#root = root;
  }
  read(p){
    const ap = path.join(this.#root, p);
    let data = "";
    try {
      data = fs.readFileSync(ap, {encoding: "utf-8"});
    } catch (e) {
      console.err(`path: ${ap}`)
      data = "";
    } finally {
      return data;
    }
  }
}
