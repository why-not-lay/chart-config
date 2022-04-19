import React from "react";
import { message, Spin } from "antd";
import * as echarts from "echarts";
export default class ChartShower extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      width: 1920,
      height: 1080,
      charts: {},
      eles: {},
      loading: true,
    };
  }
  componentDidMount(){
    const raw = '{"eles":{},"charts":{"1650251650999":{"id":1650251650999,"type":"chart","rect":{"x":330,"y":18,"width":300,"height":300},"option":{"title":{"text":"折线图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"line","smooth":true}]},"config":{"dataUrl":"efef","autoFlash":true,"interval":10,"intervalID":-1}},"1650251723272":{"id":1650251723272,"type":"chart","rect":{"x":206,"y":412,"width":300,"height":300},"option":{"title":{"text":"柱状图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"bar"}]},"config":{"dataUrl":"","autoFlash":true,"interval":1,"intervalID":-1}},"1650251728473":{"id":1650251728473,"type":"chart","rect":{"x":16,"y":48,"width":300,"height":300},"option":{"title":{"text":"饼图"},"tooltip":{"trigger":"item"},"dataset":{"source":[]},"series":[{"type":"pie"}]},"config":{"dataUrl":"","autoFlash":false,"interval":1,"intervalID":-1}}},"width":1920,"height":1080,"scale":0.5}';
    const data = JSON.parse(raw);
    this.initData(data);
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
  fetchData = async (url) => {
    await new Promise((resolve) => {
      setTimeout(()=>{
        resolve();
      }, 1000);
    });
    return "getting";
  }
  mergeChartData = async (instance, url, option) => {
    if(!url){
      return true;
    }
    let maxRetry = 3;
    while(maxRetry){
      try {
        const data = await this.fetchData(url);
        console.log(data);
        //option.dataset.source = data;
        //instance.setOption(option);
        break;
      } catch (e) {
        maxRetry--;
        if(!maxRetry){
          message.error("数据请求出错，请检查网络");
        }
      }
    }
    return maxRetry > 0;
  }
}
