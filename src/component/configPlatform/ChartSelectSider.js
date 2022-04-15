import React from "react";
//import { Menu, Drawer } from "antd";
import { Menu, Layout} from "antd";
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
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
              icon={<LineChartOutlined />}
              onClick={(e) => {this.onItemClick(e, "line")}}
              >
              折线图
            </Menu.Item>
            <Menu.Item 
              key="bar"
              icon={<BarChartOutlined />}
              onClick={(e) => {this.onItemClick(e, "bar")}}
              >
              柱状图
            </Menu.Item>
            <Menu.Item 
              key="pie"
              icon={<PieChartOutlined />}
              onClick={(e) => {this.onItemClick(e, "pie")}}
              >
              饼图
            </Menu.Item>
            <Menu.Item 
              key="custom"
              onClick={(e) => {this.onItemClick(e, "custom")}}
              >
              自定义
            </Menu.Item>
          </Menu>
        </Sider>
    );
  }
  onItemClick = (e, type) => {
    const chart = this.createChart(type);
    this.props.onAddChart(chart);
  }
  createChart = (type) => {
    const chart = {
      id: (new Date).getTime(),
      rect: {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      },
      option: this.deepClone(defaultOptinos[type]),
      config: {
        dataUrl: "",
        autoFlash: false,
        interval: 1,
      }
    }
    return chart;
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

