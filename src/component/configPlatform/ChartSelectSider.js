import React from "react";
//import { Menu, Drawer } from "antd";
import { Menu, Layout} from "antd";
import defaultOptinos from "../chart/ChartDefaultOptions";
const {Sider} = Layout;
export default class ChartSelectSider extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Sider
          theme="light"
          collapsible={true}
          collapsedWidth={80}
          style={{height: "100%"}}
          >
          <Menu
            mode="inline"
            style={{height: "100%"}}
            >
            <Menu.Item 
              key="line"
              //icon={<LineChartOutlined />}
              onClick={(e) => {this.onChartItemClick(e, "line")}}
              >
              折线图
            </Menu.Item>
            <Menu.Item 
              key="bar"
              //icon={<BarChartOutlined />}
              onClick={(e) => {this.onChartItemClick(e, "bar")}}
              >
              柱状图
            </Menu.Item>
            <Menu.Item 
              key="pie"
              //icon={<PieChartOutlined />}
              onClick={(e) => {this.onChartItemClick(e, "pie")}}
              >
              饼图
            </Menu.Item>
            <Menu.Item 
              key="custom-chart"
              onClick={(e) => {this.onChartItemClick(e, "custom")}}
              >
              自定义图表
            </Menu.Item>
            <Menu.Item 
              key="custom-ele"
              onClick={(e) => {this.onChartItemClick(e, "custom")}}
              >
              自定义元素
            </Menu.Item>
          </Menu>
        </Sider>
    );
  }
  onEleItemClick = (e) => {
    const ele = this.createEle();
    this.props.onAddEle(ele);
  }
  onChartItemClick = (e, type) => {
    const chart = this.createChart(type);
    this.props.onAddChart(chart);
  }
  createChart = (type) => {
    const chart = this.createInstance("chart", {type: type});
    return chart;
  }
  createEle = () => {
    const ele = this.createInstance("ele");
    return ele;
  }
  createInstance = (instanceType, option = {}) => {
    const instance = {
      id: (new Date).getTime(),
      type: instanceType,
      rect: {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      },
    }
    if(instanceType === "chart"){
      const {type} = option;
      instance.option = this.deepClone(defaultOptinos[type]);
      instance.config = {
        dataUrl: "",
        autoFlash: false,
        interval: 1,
        intervalID: -1,
      };
    } else if(instanceType === "ele"){
      instance.style = {};
      instance.innerHtml = {};
    }
    return instance;
  }
  deepClone = (obj) => {
    let newObj = null;
    if(typeof(obj) === "object") {
      newObj = {};
    }
    if(obj instanceof Array) {
      newObj = [];
    }
    Object.keys(obj).forEach((key) => {
      if(typeof(obj[key]) === "object") {
        newObj[key] = this.deepClone(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }
}

