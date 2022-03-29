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
                <InputNumber/>
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="图表配置">
          </Panel>
        </Collapse>
      </Drawer>
    );
  }
}
