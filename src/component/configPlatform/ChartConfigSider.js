import React from "react";
import ReactJson from "react-json-view";
import { 
  Collapse, 
  Drawer, 
  Row, 
  Col, 
  Form, 
  Radio,
  Input,
  InputNumber, 
} from "antd";
const {Panel} = Collapse;
const {TextArea, Search} = Input;
export default class ChartConfigSider extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      configSiderVisible: false,
      searching: false,
      dataInput: "input",
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
                  step={1}
                  value={this.getValue("x")}
                  onChange={(value) => {this.onValueChange(value, "x")}}
                  />
              </Form.Item>
              <Form.Item
                label="Y"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("y")}
                  onChange={(value) => {this.onValueChange(value, "y")}}
                  />
              </Form.Item>
              <Form.Item
                label="width"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("width")}
                  onChange={(value) => {this.onValueChange(value, "width")}}
                  />
              </Form.Item>
              <Form.Item
                label="height"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("height")}
                  onChange={(value) => {this.onValueChange(value, "height")}}
                  />
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="数据配置">
            <Search
              enterButton="获取"
              onSearch={this.setData}
              loading={this.state.searching}
              />
          </Panel>
          <Panel header="图表配置">
            <ReactJson 
              name="option"
              collapsed={true}
              displayDataTypes={false}
              displayObjectSize={false}
              src={{...this.props.curOption}}
              onEdit={this.onOptionEdit}
              onAdd={this.onOptionAdd}
              onDelete={this.onOptionDelete}
              />
          </Panel>
        </Collapse>
      </Drawer>
    );
  }

  onOptionDelete = (e) => {
    const {name, namespace, existing_src} = e;
    const newObj = this.locateValue(existing_src, namespace);
    delete newObj[name];
    this.props.onSetChartOption(this.props.id, existing_src);
  }
  onOptionAdd = (e) => {
    const {name, namespace, existing_src, new_value} = e;
    const newObj = this.locateValue(existing_src, namespace);
    newObj[name] = new_value;
    this.props.onSetChartOption(this.props.id, existing_src);
  }
  onOptionEdit = (e) => {
    const {name, namespace, existing_src, new_value} = e;
    const newObj = this.locateValue(existing_src, namespace);
    newObj[name] = new_value;
    this.props.onSetChartOption(this.props.id, existing_src);
  }
  onValueChange = (value, key) => {
    value = Math.floor(value);
    const newObj = {...this.props.curRect}
    newObj[key] = value;
    const {x, y, width, height} = newObj;
    this.props.onSetChartContainerRect(this.props.id, x, y, width, height);
  }
  getValue = (key) => {
    return this.props.curRect ? this.props.curRect[key] : 0
  }
  getData = async(url) => {
    console.log(url);
    this.setState({
      searching: true,
    });
    const data = []
    await new Promise((resolve) => {
      setTimeout(()=>{console.log("getting data"), resolve(1)}, 3000);
    });
    /*
     * 获取数据
     * */
    return data;
  }
  locateValue = (rawObj, path) => {
    let obj = rawObj;
    path.forEach((key) => {
      obj = obj[key];
    });
    return obj;
  }
  mergeData = (newData) => {
    const {xAxis, yAxis} = newData;
    const newOption = {...this.props.curOption};
    //newOption.xAxis.data = xAxis;
    //newOption.series[0].data = yAxis;
    newOption.dataset.source = newData;
    return newOption;
  }
  setData = async (value) => {
    const data = await this.getData(value);
    /*
     * 格式化数据
     * */
    const newData = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1],
    ]
    this.setState({
      searching: false,
    });
    const newOption = this.mergeData(newData)
    this.props.onSetChartOption(this.props.id, newOption);
  }
}
