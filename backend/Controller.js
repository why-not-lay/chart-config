const StaticReader = require("./StaticReader");
const DataGenerator = require("./DataGenerator");
const DBReader = require("./DBReader");
module.exports = class Controller {
  #maxStaticFile;
  #maxChart;
  #maxUser;
  #staticFileData = {};
  #chartData = {};
  #userData = {};
  #staticReader = null;
  #userReader = null;
  #chartReader = null;
  constructor(staticPath = ".", maxStaticFile = 5, maxChart = 5, maxUser = 5) {
    this.#maxStaticFile = maxStaticFile;
    this.#maxChart = maxChart;
    this.#maxUser = maxUser;
    this.#staticReader = new StaticReader(staticPath);
    this.#userReader = new DBReader("user.db");
    this.#chartReader = new DBReader("chart.db");
  }
  getStaticFile(path){
    const res = {
      success: false,
      data: [],
      err: null,
    }
    try {
      if(!(path in this.#staticFileData)) {
        const data = this.#staticReader.read(path);
        const keys = Object.keys(this.#staticFileData);
        if(keys.length > this.#maxStaticFile){
          const minKey = this.#findMinTimesKey(this.#staticFileData, "times");
          delete this.#staticFileData[minKey];
        }
        this.#staticFileData[path] = {
          data: data,
          times: 0,
        }
      }
      this.#staticFileData[path].times++;
      res.data = this.#staticFileData[path].data;
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async setChartInfo(hash, info, username){
    const res = {
      success: false,
      err: null,
    }
    try {
      const {data, thumb} = info;
      const sql = `update chartTable set data = ?, thumb= ? where hash = ? and user = ?`;
      await this.#chartReader.exec(sql, [JSON.stringify(data), thumb, hash, username]);
      this.#clearChartCache(hash);
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async setChartName(hash, name, username){
    const res = {
      success: false,
      err: null,
    }
    try {
      const sql = `update chartTable set name = ? where hash = ? and user = ?`;
      await this.#chartReader.exec(sql, [name, hash, username]);
      this.#clearChartCache(hash);
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }

  }
  async addChart(chartName, username){
    const res = {
      success: false,
      err: null,
    }
    try {
      const hash = (new Date()).getTime().toString();
      const thumb = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAEAsMDgwKEA4NDhIREBMYKBoYFhYYMSMlHSg6Mz08OTM4N0BIXE5ARFdFNzhQbVFXX2JnaGc+TXF5cGR4XGVnY//bAEMBERISGBUYLxoaL2NCOEJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//AABEIAhwDwAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z";
      const data = `{"eles":{}, "charts":{},"width":1920, "height":1080, "scale":0.5}`;
      const deleted = 0;
      const sql = `insert into chartTable(name, hash, thumb, data, deleted, user) values(?, ?, ?, ?, ?, ?)`;
      await this.#chartReader.exec(sql, [chartName, hash, thumb, data, deleted, username]);
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async deleteChart(hash, username){
    const res = {
      success: false,
      err: null,
    }
    try {
      const sql = `update chartTable set deleted = ? where hash = ? and user = ?`;
      await this.#chartReader.exec(sql, [1, hash, username]);
      this.#clearChartCache(hash);
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async getChartCount(username){
    const res = {
      success: false,
      data: [],
      err: null,
    }
    try {
      const sql = `select count(*) from chartTable where deleted = 0 and user = ?`;
      const data = await this.#chartReader.get(sql, [username]);
      res.data = data;
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async getChartInfo(page, pageNum, username){
    const res = {
      success: false,
      data: [],
      err: null,
    }
    try {
      const offset = (page - 1) * pageNum;
      const sql = `select name, hash, thumb from chartTable where deleted = 0 and user = ? order by name limit ? offset ?`;
      const data = await this.#chartReader.get(sql, [username, pageNum, offset]);
      res.data = data;
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async getChart(hash){
    const res = {
      success: false,
      data: [],
      err: null,
    }
    try {
      if(!(hash in this.#chartData)) {
        const sql = `select * from chartTable where deleted = 0 and hash = ?`;
        const data = await this.#chartReader.get(sql, [hash])
        const keys = Object.keys(this.#chartData);
        if(keys.length > this.#maxChart){
          const minKey = this.#findMinTimesKey(this.#chartData, "times");
          delete this.#chartData[minKey];
        }
        this.#chartData[hash] = {
          data: data,
          times: 0,
        }
      }
      this.#chartData[hash].times++;
      res.data = this.#chartData[hash].data;
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  async getUser(username){
    const res = {
      success: false,
      data: [],
      err: null,
    }
    try {
      if(!(username in this.#userData)) {
        const sql = `select * from userTable where deleted = 0 and username = ?`;
        const data = await this.#userReader.get(sql, [username])
        const keys = Object.keys(this.#userData);
        if(keys.length > this.#maxUser){
          const minKey = this.#findMinTimesKey(this.#userData, "times");
          delete this.#userData[minKey];
        }
        this.#userData[username] = {
          data: data,
          times: 0,
        }
      }
      this.#userData[username].times++;
      res.data = this.#userData[username].data;
      res.success = true;
    } catch (e) {
      res.err = e;
    } finally {
      return res;
    }
  }
  getRandomDataListByDate(row = 100, col = 1){
    const d = new Date();
    const data = [];
    const head = ["data"];
    for(let i = 0; i < col; i++) {
      head.push(`c${i+1}`);
    }
    data.push(head);
    for(let i = 0; i < row; i++) {
      let l1 = DataGenerator.GenerateIntegerArray(col).data;
      if(!(l1 instanceof Array)){
        l1 = [l1];
      }
      l1.splice(0,0, `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)
      data.push(l1);
      d.setSeconds(d.getSeconds() + 1);
    }
    return {
      data: data,
    };
  }
  #clearChartCache(hash){
    if(!(hash in this.#chartData)){
      return;
    }
    delete this.#chartData[hash];
  }
  #findMinTimesKey(obj, comparedKey) {
    const minKey = Object.keys(obj).reduce((prev, cur) => {
      return obj[prev][comparedKey] > obj[cur][comparedKey] ? cur : prev;
    });
    return minKey;
  }
}
