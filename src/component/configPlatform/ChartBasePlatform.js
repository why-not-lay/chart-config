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
    this.chartConfigSiderRef = null;
    this.chartOperationAreaRef = null;
  }
  render(){
    return (
      <Layout 
        className="chart-base-platform-container" 
        style={{
          height: "calc(100vh - 64px)", 
          overflow: "hidden",
          position: "relative",
        }}
        >
        <ChartSelectSider
          onAddChart={this.addChart}
          />
        <Content
          style={{
            width: "100%",
          }}
          >
          <ChartOperationArea
            onSetConfigSider={this.setConfigSider}
            ref={this.setChartOperationAreaRef}
            />
        </Content>
        <ChartConfigSider 
          ref={this.setChartConfigSiderRef}
          />
      </Layout>
    )
  }
  addChart = (chart) => {
    this.chartOperationAreaRef.addChart(chart);
  }
  setConfigSider = (isOpen) => {
    if(this.chartConfigSiderRef){
      this.chartConfigSiderRef.setConfigSider(isOpen);
    }
  }
  setChartConfigSiderRef = (ref) => {
    this.chartConfigSiderRef = ref;
  }
  setChartOperationAreaRef = (ref) => {
    this.chartOperationAreaRef = ref;
  }
}
