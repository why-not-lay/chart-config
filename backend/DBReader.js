//const Sqlite = require("sqlite3");
const sqlite = require("better-sqlite3");
module.exports = class DBReader {
  #dbName = "";
  constructor(dbName){
    this.#dbName = dbName;
  }
  exec(sql, params) {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite(this.#dbName, {fileMustExist: true});
        const info = db.prepare(sql).run(...params);
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });

  }
  get(sql, params) {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite(this.#dbName, {readonly: true, fileMustExist: true});
        const data = db.prepare(sql).all(...params);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
