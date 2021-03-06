import React from "react";
import { Row, Col, Layout, Button } from "antd";
const {Header, Content} = Layout;

import ChartBasePlatform from "./ChartBasePlatform";
//import "../../style/basePlatform.css"

export default class BasePlatform extends React.Component {
  constructor(props){
    super(props);
    this.chartBasePlatformRef = null;
  }
  render(){
    return (
      <Layout className="base-platform-container">
        <Header>
          <Row
            gutter={8}
            >
            <Col
              offset={20}
              >
              <Button
                type="primary"
                onClick={(e) => {this.saveInstances()}}
                >
                保存
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={(e) => {this.exportImage()}}
                >
                导出图片
              </Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <ChartBasePlatform
            ref={(ref) => {this.chartBasePlatformRef = ref;}}
            />
        </Content>
      </Layout>
    );
  }
  exportImage = () => {
    this.chartBasePlatformRef.exportImage();
  }
  saveInstances = () => {
    this.chartBasePlatformRef.saveInstances();
  }
}
