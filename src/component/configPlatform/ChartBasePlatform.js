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
      //curChart: null,
    }
    this.chartConfigSiderRef = null;
    this.chartOperationAreaRef = null;
  }
  componentDidMount() {
    (this.fetchChartsData()).then((data) => {
      this.setState({
        initData: data,
      });
    });
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
            ref={this.setChartOperationAreaRef}
            initData={this.state.initData}
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
  saveCharts = () => {
    this.chartOperationAreaRef.saveCharts();
  }
  addChart = (chart) => {
    this.chartOperationAreaRef.addChart(chart);
  }
  fetchChartsData = async () => {
    await (new Promise((resolve) => {
      setTimeout((() => {
        resolve();
      }).bind(this), 1000);
    }));
    const data = '{"charts":{"1650010299780":{"id":1650010299780,"rect":{"x":0,"y":0,"width":300,"height":300},"option":{"title":{"text":"折线图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"line","smooth":true}]},"config":{"dataUrl":"","autoFlash":false,"interval":1}}},"width":1920,"height":1080,"scale":0.5}';
    return JSON.parse(data);
  }
}
