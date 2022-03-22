import React from "react";
//import { Menu, Drawer } from "antd";
//const { SubMenu } = Menu;
import { Menu, Layout} from "antd";
const {Sider} = Layout;
export default class ChartSelectSider extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Sider
          collapsible={true}
          collapsedWidth={0}
          style={{height: "100%"}}
          >
          <Menu
            mode="inline"
            style={{height: "100%"}}
            >
            <Menu.Item 
              key="1"
              onClick={this.onItemClick}
              >
              折线图
            </Menu.Item>
            <Menu.Item key="2">柱状图</Menu.Item>
            <Menu.Item key="3">饼图</Menu.Item>
          </Menu>
        </Sider>
    );
  }
  onItemClick = (e) => {
    const chart = this.createChart();
    this.props.onAddChart(chart);
  }
  createChart = () => {
    const chart = {
      id: Date.now(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    return chart;
  }
}

