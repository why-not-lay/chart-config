const Koa = require("koa");
const Router = require("koa-router");
const Json = require("koa-json");
const Logger = require("koa-logger");
const Body = require("koa-body");
const Session = require("koa-session");
const Controller = require("./Controller");

const app = new Koa();
const router = new Router();
const controller = new Controller("./static");
const CONFIG = {
 key: 'koa.sess', 
  maxAge: 400000,
  autoCommit: true,
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: false, 
  renew: true, 
  secure: false,
  sameSite: null,
};
let isLogin = false;
app.use(Session(CONFIG, app))
    .use(Json())
    .use(Logger())
    .use(async (ctx, next) => {
      const {uid} = ctx.session;
      isLogin = uid ? true : false;
      await next();
    });
app.keys = ["newest secret key"];

function createREST(success, data = null, err = null){
  return {
    success: success,
    data: data,
    err: err ? err.toString() : null,
  };
}

// js
router.get("/chart/js/:filename", async(ctx, next) => {
  const {filename} = ctx.params;
  const res = controller.getStaticFile(filename);
  if(res.success){
    ctx.body = res.data;
  } else {
    ctx.body = "no such page";
  }
})
// select page
router.get("/chart/select", async(ctx, next) => {
  if(!isLogin){
    ctx.status = 302;
    ctx.redirect("/chart/login");
    return;
  }
  const res = controller.getStaticFile("chartSelect.html");
  if(res.success){
    ctx.body = res.data;
  } else {
    ctx.body = "no such page";
  }
});
// get login page
router.get("/chart/login", async(ctx, next) => {
  if(isLogin){
    ctx.status = 302;
    ctx.redirect("/chart/select");
    return;
  }
  const res = controller.getStaticFile("chartLogin.html");
  if(res.success){
    ctx.body = res.data;
  } else {
    ctx.body = "no such page";
  }
});
//operation page
router.get("/chart/operation", async(ctx, next) => {
  if(!isLogin){
    ctx.status = 302;
    ctx.redirect("/chart/login");
    return;
  }
  const res = controller.getStaticFile("chartConfig.html");
  if(res.success){
    ctx.body = res.data;
  } else {
    ctx.body = "no such page";
  }
});
// show page
router.get("/chart/show", async(ctx, next) => {
  const res = controller.getStaticFile("chartShower.html");
  if(res.success){
    ctx.body = res.data;
  } else {
    ctx.status = 302;
    ctx.redirect("/chart/select");
  }
});
router.get("/chart/api/data", async(ctx, next) => {
  ctx.body = controller.getRandomDataListByDate();
})

//logout
router.get("/chart/logout", async(ctx, next) => {
  ctx.session = null;
  ctx.status = 302;
  ctx.redirect("/chart/login");
});
// delete chart
router.get("/chart/delete", async(ctx, next) => {
  if(!isLogin){
    ctx.body = createREST(false, null, "please login");
    return;
  }
  const {cid: hash} = ctx.query;
  const username = ctx.session.uid;
  const res = await controller.deleteChart(hash, username);
  ctx.body = createREST(res.success, null, res.err);
});
// add chart
router.post("/chart/add", Body({multipart: true}), async(ctx, next) => {
  if(!isLogin){
    ctx.body = createREST(false, null, "please login");
    return;
  }
  const {name} = ctx.request.body;
  const username = ctx.session.uid;
  const res = await controller.addChart(name, username);
  ctx.body = createREST(res.success, null, res.err);
});
// get chart info
router.get("/chart/info", async(ctx, next) => {
  if(!isLogin){
    ctx.body = createREST(false, null, "please login");
    return;
  }
  const {page, pageNum} = ctx.query;
  const username = ctx.session.uid;
  const res = await controller.getChartInfo(page, pageNum, username);
  const resC = await controller.getChartCount(username);
  const count = resC.data[0]["count(*)"]
  ctx.body = createREST(res.success, {list: res.data, total: count}, res.err);
});
// get chart
router.get("/chart/get", async(ctx, next) => {
  const {cid: hash} = ctx.query;
  const res = await controller.getChart(hash);
  ctx.body = createREST(res.success, res.data, res.err);
});
// set chart name
router.post("/chart/set/name", Body({multipart: true}), async(ctx, next) => {
  if(!isLogin){
    ctx.body = createREST(false, null, "please login");
    return;
  }
  const {cid: hash, name} = ctx.request.body;
  const username = ctx.session.uid;
  const res = await controller.setChartName(hash, name, username);
  ctx.body = createREST(res.success, null, res.err);
});
// set chart info
router.post("/chart/set/info", Body({multipart: true}), async(ctx, next) => {
  if(!isLogin){
    ctx.body = createREST(false, null, "please login");
    return;
  }
  const {cid: hash, info} = ctx.request.body;
  const username = ctx.session.uid;
  const res = await controller.setChartInfo(hash, JSON.parse(info), username);
  ctx.body = createREST(res.success, null, res.err);
});
// login
router.post("/chart/login", Body({multipart: true}), async(ctx, next) => {
  if(isLogin){
    ctx.body = createREST(false, null, "existed");
    return;
  }
  const {username, password} = ctx.request.body;
  if(!username || !password){
    ctx.body = createREST(success, null, "wrong operation")
    return;
  }
  const {data} = await controller.getUser(username);
  const success = data[0].password === password;
  if(success){
    ctx.session.uid = username;
    ctx.body = createREST(success);
  } else {
    ctx.body = createREST(success, null, "wrong password")
  }
});

app.use(router.routes())
    .use(router.allowedMethods())
app.listen(8088, () => {
  console.log("----- Server started -----")
});

