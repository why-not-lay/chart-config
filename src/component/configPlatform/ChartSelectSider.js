import React from "react";
//import { Menu, Drawer } from "antd";
import { Menu, Layout} from "antd";
import defaultOptinos from "../chart/ChartDefaultOptions";
const {Sider} = Layout;
const { SubMenu } = Menu;
export default class ChartSelectSider extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Sider
          collapsible={true}
          collapsedWidth={80}
          style={{height: "100%"}}
          >
          <Menu
            mode="inline"
            style={{height: "100%"}}
            >
            <SubMenu
              key="charts"
              title="图表"
              >
              <Menu.Item 
                key="1"
                onClick={(e) => {this.onItemClick(e, "line")}}
                >
                折线图
              </Menu.Item>
              <Menu.Item key="2">柱状图</Menu.Item>
              <Menu.Item key="3">饼图</Menu.Item>
            </SubMenu>
            <SubMenu
              key="common"
              title="普通组件"
              >
              <Menu.Item key="4">柱状图</Menu.Item>
              <Menu.Item key="6">饼图</Menu.Item>
            </SubMenu>
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

