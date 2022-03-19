import React from "react";
import { Layout} from "antd";
import ChartConfigSider from "./ChartConfigSider";
import ChartSelectSider from "./ChartSelectSider"
import ChartOperationArea from "./ChartOperationArea";

const {Content} = Layout;
export default class ChartBasePlatform extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      configSiderVisible: false
    }
  }
  render(){
    return (
      <Layout 
        className="chart-base-platform-container" 
        style={{
          height:"calc(100vh - 64px)", 
          position:"relative",
        }}
        >
        <ChartSelectSider></ChartSelectSider>
        <Content
          style={{
            width: "100%",
            overflow: "auto"
          }}
          >
          <ChartOperationArea></ChartOperationArea>
        </Content>
        <ChartConfigSider></ChartConfigSider>
      </Layout>
    )
  }
}
