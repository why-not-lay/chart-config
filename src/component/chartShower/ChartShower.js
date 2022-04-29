import React from "react";
import { message, Spin } from "antd";
import * as echarts from "echarts";
import { requestGet } from "../../util/request";
export default class ChartShower extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      width: 1920,
      height: 1080,
      charts: {},
      eles: {},
      loading: false,
    };
    this.fetchUrl = "";
  }
  componentDidMount(){
    const queries = this.resolveQuery(window.location.search.slice(1));
    this.fetchUrl = `/chart/get?cid=${queries.cid}`
    this.setState({
      loading: true,
    });
    requestGet(this.fetchUrl)
      .then((res) => {
        if(res.success){
          const data = JSON.parse(res.data[0].data);
          this.initData(data);
        } else {
          message.error(res.err);
        }
      })
      .catch((err) => {
        message.error("网络错误");
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  componentDidUpdate(){
  }
  componentWillUnmount(){
    const charts = this.state.charts;
    Object.keys(charts).forEach((key) => {
      const chart = charts[key];
      const {instance, config} = chart;
      const {intervalID, autoFlash} = config;
      if(autoFlash){
        clearInterval(intervalID);
      }
      instance.dispose();
    });
  }
  render(){
    const chartItems = Object.keys(this.state.charts).map((key) => {
      const chart = this.state.charts[key];
      const {rect} = chart;
      const {x, y, width, height} = rect;
      return (
        <div
          className="chart-instance"
          key={key}
          style={{
            position: "absolute",
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${x}px, ${y}px)`,
          }}
          >
          <div
            style={{
              position: "relative",
              height: "100%",
              width: "100%",
            }}
            ref={(ref) => {
              this.state.charts[key].ref = ref;
            }}
            >

          </div>
        </div>
      );
    });
    const eleItems = Object.keys(this.state.eles).map((key) => {
      const ele = this.state.eles[key];
      const {rect} = ele;
      const {x, y, width, height} = rect;
      return (
        <div
          className="ele-instance"
          key={key}
          style={{
            position: "absolute",
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${x}px, ${y}px)`,
          }}
          ref={(ref) => {
            this.state.eles[key].ref = ref;
          }}
          />
      );
    });
    return (
      <Spin
        size="large"
        spinning={this.state.loading}
        >
        <div
          style={{
            height: `${this.state.height}px`,
            width: `${this.state.width}px`
          }}
          >
          {chartItems}
          {eleItems}
        </div>
      </Spin>
    );
  }
  initData = (data) => {
    const {width, height, eles, charts} = data;
    this.setState({
      width: width,
      height: height,
      eles: eles,
      charts: charts,
    }, 
    () => {
      const charts = this.state.charts;
      Object.keys(charts).forEach((key) => {
        const chart = charts[key];
        const {option, config} = chart;
        const {dataUrl, autoFlash} = config;
        chart.instance = echarts.init(chart.ref);
        chart.instance.setOption(option);
        this.mergeChartData(chart.instance, dataUrl, option);
        if(autoFlash){
          config.intervalID = this.mergeChartDataInterval(chart.instance, config, option);
        }
      });
      const eles = this.state.eles;
      Object.keys(eles).forEach((key) => {
        const ele = eles[key];
        ele.ref.innerHTML = ele.innerHtml;
      });
    });
  }
  mergeChartDataInterval = (instance, config, option) => {
    const {interval, dataUrl} = config;
    const id = setInterval(() => {
      this.mergeChartData(instance, dataUrl, option);
    }, interval * 1000);
    return id;
  }
  mergeChartData = async (instance, url, option) => {
    if(!url){
      return true;
    }
    requestGet(url)
      .then((res) => {
        option.dataset.source = res.data;
        instance.setOption(option);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  resolveQuery = (queryStr) => {
    const obj = {};
    queryStr.split("&").forEach((query) => {
      const idx = query.indexOf("=");
      if(idx === -1){
        return;
      }
      const key = query.slice(0, idx);
      const value = query.slice(idx + 1);
      obj[key] = value;
    });
    return obj;
  }
}
