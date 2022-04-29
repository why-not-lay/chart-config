import axios from "axios";
const requestGet = async (url) => {
  let maxRetry = 3;
  let res = {
    success: true,
    data: [],
    err: null,
  }
  while(maxRetry){
    try {
      const response = await axios.get(url, {timeout: 2000});
      res = response.data;
      if(typeof(res) === "string"){
        res = JSON.parse(res);
      }
      //res.err = null;
      break;
    } catch (error) {
      console.log(error);
      res.err = error;
      maxRetry--;
    }
  }
  res.success = maxRetry > 0;
  res.err = maxRetry > 0 ? res.err : "connection error";
  return res;
};
const requestPost = async (url, data) => {
  let maxRetry = 3;
  let res = {
    success: true,
    data: [],
    err: null,
  }
  while(maxRetry){
    try {
      const response = await axios.post(url, data, {timeout: 2000});
      res = response.data;
      if(typeof(res) === "string"){
        res = JSON.parse(res);
      }
      break;
    } catch (error) {
      console.log(error);
      res.err = error.toString();
      maxRetry--;
    }
  }
  res.success = maxRetry > 0;
  res.err = maxRetry > 0 ? res.err : "connection error";
  return res;
}
export {requestPost, requestGet};
