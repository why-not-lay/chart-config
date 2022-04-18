import React from "react";
import {Layout} from "antd";
import ChartSelectSider from "./ChartSelectSider"
import ChartOperationArea from "./ChartOperationArea";

const {Content} = Layout;
export default class ChartBasePlatform extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      configSiderVisible: false,
      initData: null,
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
          onAddEle={this.addEle}
          />
        <Content
          style={{
            width: "100%",
          }}
          >
          <ChartOperationArea
            ref={this.setChartOperationAreaRef}
            />
        </Content>
      </Layout>
    )
  }
  /*
   * setter
   * */
  setChartOperationAreaRef = (ref) => {
    this.chartOperationAreaRef = ref;
  }
  saveInstances = () => {
    this.chartOperationAreaRef.saveInstances();
  }
  addEle = (ele) => {
    this.chartOperationAreaRef.addEle(ele);
  }
  addChart = (chart) => {
    this.chartOperationAreaRef.addChart(chart);
  }
}
