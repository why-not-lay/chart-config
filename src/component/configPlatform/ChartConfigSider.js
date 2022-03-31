import React from "react";
import { Collapse, Drawer, Row, Col, Form, InputNumber } from "antd";
const {Panel} = Collapse;
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
        title="配置栏" 
        placement="right" 
        visible={this.state.configSiderVisible}
        getContainer={false}
        mask={false}
        style={{position: "absolute"}}
        onClose={this.onClose}
        >
        <Collapse>
          <Panel header="容器配置">
            <Form
              layout="horizontal"
              >
              <Form.Item
                label="X"
                >
                <InputNumber 
                  value={this.getValue("x")}
                  onChange={(value) => {this.onValueChange(value, "x")}}
                  />
              </Form.Item>
              <Form.Item
                label="Y"
                >
                <InputNumber 
                  value={this.getValue("y")}
                  onChange={(value) => {this.onValueChange(value, "y")}}
                  />
              </Form.Item>
              <Form.Item
                label="width"
                >
                <InputNumber 
                  value={this.getValue("width")}
                  onChange={(value) => {this.onValueChange(value, "width")}}
                  />
              </Form.Item>
              <Form.Item
                label="height"
                >
                <InputNumber 
                  value={this.getValue("height")}
                  onChange={(value) => {this.onValueChange(value, "height")}}
                  />
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="图表配置">
          </Panel>
          <Panel header="数据配置">
          </Panel>
        </Collapse>
      </Drawer>
    );
  }
  getValue = (key) => {
    return this.props.curRect ? this.props.curRect[key] : 0
  }
  onValueChange = (value, key) => {
    const newObj = {...this.props.curRect}
    newObj[key] = value;
    const {x, y, width, height} = newObj;
    this.props.onSetChartContainerRect(this.props.id, x, y, width, height);
  }
}
