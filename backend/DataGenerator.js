const Mock = require("mockjs");
module.exports = class DataGenerator {
  static GenerateIntegerArray(num = 100, min = 0, max = 1000){
    return Mock.mock({
      [`data|${num}`]: [`@integer(${min}, ${max})`]
    });
  }
  static GenerateInteger(min = 0, max = 1000){
    return Mock.mock({
      "data": `@integer(${min}, ${max})`,
    });
  }
}
