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
  componentDidMount() {
    //(this.fetchInstancesData()).then((data) => {
    //  this.setState({
    //    initData: data,
    //  });
    //});
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
            //initData={this.state.initData}
            //onClearInitData={this.clearInitData}
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
  clearInitData = () => {
    this.setState({
      initData: null,
    });
  }
  fetchInstancesData = async () => {
    await (new Promise((resolve) => {
      setTimeout((() => {
        resolve();
      }).bind(this), 1000);
    }));
    //const data = '{"charts":{"1650010299780":{"id":1650010299780,"rect":{"x":0,"y":0,"width":300,"height":300},"option":{"title":{"text":"折线图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"line","smooth":true}]},"config":{"dataUrl":"","autoFlash":false,"interval":1}}},"width":1920,"height":1080,"scale":0.5}';
    const data = '{"eles":{},"charts":{"1650251650999":{"id":1650251650999,"type":"chart","rect":{"x":330,"y":18,"width":300,"height":300},"option":{"title":{"text":"折线图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"line","smooth":true}]},"config":{"dataUrl":"efef","autoFlash":true,"interval":10,"intervalID":-1}},"1650251723272":{"id":1650251723272,"type":"chart","rect":{"x":206,"y":412,"width":300,"height":300},"option":{"title":{"text":"柱状图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"bar"}]},"config":{"dataUrl":"","autoFlash":true,"interval":1,"intervalID":-1}},"1650251728473":{"id":1650251728473,"type":"chart","rect":{"x":16,"y":48,"width":300,"height":300},"option":{"title":{"text":"饼图"},"tooltip":{"trigger":"item"},"dataset":{"source":[]},"series":[{"type":"pie"}]},"config":{"dataUrl":"","autoFlash":false,"interval":1,"intervalID":-1}}},"width":1920,"height":1080,"scale":0.5}';
    return JSON.parse(data);
  }
}
