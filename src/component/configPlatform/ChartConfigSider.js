import React from "react";
import { Menu, Drawer } from "antd";
const { SubMenu } = Menu;
export default class ChartConfigSider extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      configSiderVisible: false
    };
    this.onClose = this.onClose.bind(this);
  }
  onClose = () => {
    this.setConfigSider(false);
  }
  setConfigSider = (isOpen) => {
    this.setState({
      configSiderVisible: isOpen,
    });
  }
  render(){
    return(
      <Drawer 
        title="图表配置" 
        placement="right" 
        visible={this.state.configSiderVisible}
        getContainer={false}
        mask={false}
        style={{position: "absolute"}}
        onClose={this.onClose}
        >
        <Menu
          mode="inline"
          style={{height: "100%"}}
          >
          <SubMenu key="sub1" title="配置类1">
            <Menu.Item key="1">p1</Menu.Item>
            <Menu.Item key="2">p2</Menu.Item>
            <Menu.Item key="3">p3</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="配置类2">
            <Menu.Item key="4">p1</Menu.Item>
            <Menu.Item key="5">p2</Menu.Item>
            <Menu.Item key="6">p3</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title="配置类2">
            <Menu.Item key="7">p1</Menu.Item>
            <Menu.Item key="8">p2</Menu.Item>
            <Menu.Item key="9">p3</Menu.Item>
          </SubMenu>
        </Menu>
      </Drawer>
    );
  }
}
