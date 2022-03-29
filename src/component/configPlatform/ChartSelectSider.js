import React from "react";
//import { Menu, Drawer } from "antd";
import { Menu, Layout} from "antd";
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
                onClick={this.onItemClick}
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
  onItemClick = (e) => {
    const chart = this.createChart();
    this.props.onAddChart(chart);
  }
  createChart = () => {
    const chart = {
      id: Date.now(),
      ref: null,
      rect: {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      },
      option: {

      },
    };
    return chart;
  }
}

