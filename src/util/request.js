import axios from "axios";
const requestGet = async (url) => {
  let maxRetry = 3;
  const res = {
    success: true,
    data: null,
    err: null,
  }
  while(maxRetry){
    try {
      const response = await axios.get(url, {timeout: 2000});
      res.data = response.data;
      res.err = null;
      break;
    } catch (error) {
      console.log(error);
      res.err = error;
      maxRetry--;
    }
  }
  res.success = maxRetry > 0;
  return res;
};
const requestPost = async (url, data) => {
  let maxRetry = 3;
  const res = {
    success: true,
    data: null,
  }
  while(maxRetry){
    try {
      const response = await axios.post(url, data, {timeout: 2000});
      res.data = response.data;
      res.err = null;
      break;
    } catch (error) {
      console.log(error);
      res.err = error;
      maxRetry--;
    }
  }
  res.success = maxRetry > 0;
  return res;
}
export {requestPost, requestGet};
