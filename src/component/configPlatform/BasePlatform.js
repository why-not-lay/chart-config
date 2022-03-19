import React from "react";
import { Layout, Menu } from "antd";
const {Header, Content} = Layout;

import ChartBasePlatform from "./ChartBasePlatform";
import "../../style/basePlatform.css"

export default class BasePlatform extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Layout className="base-platform-container">
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            >
            <Menu.Item key="1">已配置图表</Menu.Item>
            <Menu.Item key="2">配置平台</Menu.Item>
          </Menu>
        </Header>
        <Content>
          <ChartBasePlatform></ChartBasePlatform>
        </Content>
      </Layout>
    );
  }
}
