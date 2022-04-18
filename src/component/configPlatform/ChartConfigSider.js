import React from "react";
import ReactJson from "react-json-view";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { 
  Form, 
  Input,
  Button,
  Drawer, 
  Switch,
  message,
  Collapse, 
  InputNumber, 
} from "antd";
const {Panel} = Collapse;
const {Search, TextArea} = Input;
export default class ChartConfigSider extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      configSiderVisible: false,
      searching: false,
      clipboardText: "",
    };
    this.configInputRef = null;
    this.configInnerHtmlRef = null;
  }
  componentDidMount = () => {
    if(!this.props.curConfig || !this.props.curConfig.autoFlash || !this.props.curConfig.dataUrl) {
      return;
    }
  }
  render(){
    const styleConfig = (
          <Panel header="样式配置">
            <ReactJson 
              name="style"
              collapsed={true}
              displayDataTypes={false}
              displayObjectSize={false}
              src={{...this.props.curStyle}}
              onEdit={this.onStyleEdit}
              onAdd={this.onStyleAdd}
              onDelete={this.onStyleDelete}
              />
          </Panel>
    );
    const innerHtmlConfig = (
          <Panel header="元素配置">
            <TextArea
              allowClear
              autoSize={{
                minRows: 5,
                maxRows: 10,
              }}
              key={`${this.props.id}-innerHtml`}
              defaultValue={this.props.curInnerHtml}
              ref={this.setConfigInnerHtmlRef}
              />
            <Button 
              type="primary" 
              block
              onClick={this.onConfigInnerHtmlClick.bind(this)}
              >
              确定
            </Button>
          </Panel>
    );
    const dataConfig = (
          <Panel header="数据配置">
            <Form
              layout="horizontal"
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              >
              <Form.Item
                label="是否动态刷新"
                >
                <Switch
                  checked={this.props.curConfig ? this.props.curConfig.autoFlash : false}
                  onChange={this.onSwitchChange}
                  />
              </Form.Item>
              <Form.Item
                label="刷新间隔"
                >
                <InputNumber
                  disabled={!this.props.curConfig || !this.props.curConfig.autoFlash}
                  min={1}
                  step={1}
                  value={this.props.curConfig ? this.props.curConfig.interval : 0}
                  onChange={this.onIntervalChange}
                  />
              </Form.Item>
              <Form.Item
                label="数据链接"
                >
                <Search
                  enterButton="获取"
                  key={`${this.props.id}-dataUrl`}
                  defaultValue={this.props.curConfig ? this.props.curConfig.dataUrl: ""}
                  onSearch={this.setData}
                  loading={this.state.searching}
                  />
              </Form.Item>
            </Form>
          </Panel>
    );
    const optionConfig = (
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
    );
    const optionInputConfig = (
          <Panel header="导入配置">
            <TextArea
              allowClear
              autoSize={{
                minRows: 5,
                maxRows: 10,
              }}
              placeholder="请以 JSON 格式输入图表配置"
              ref={this.setConfigInputRef}
              />
            <Button 
              type="primary" 
              block
              onClick={this.onConfigInputClick.bind(this)}
              >
              确定
            </Button>
          </Panel>
    );
    const innerHtmlExportConfig = (
          <Form.Item>
            <CopyToClipboard
              text={this.state.clipboardText}
              >
              <Button 
                block
                type="primary" 
                onClick={this.onInnerHtmlExportClick}
                >
                导出元素配置
              </Button>
            </CopyToClipboard>
          </Form.Item>
    );
    const styleExportConfig = (
          <Form.Item>
            <CopyToClipboard
              text={this.state.clipboardText}
              >
              <Button 
                block
                type="primary" 
                onClick={this.onStyleExportClick}
                >
                导出样式配置
              </Button>
            </CopyToClipboard>
          </Form.Item>
    );
    const dataExportConfig = (
          <Form.Item>
            <CopyToClipboard
              text={this.state.clipboardText}
              >
              <Button 
                block
                type="primary" 
                onClick={this.onConfigExportClick}
                >
                导出数据配置
              </Button>
            </CopyToClipboard>
          </Form.Item>
    );
    const optionExportConfig = (
          <Form.Item>
            <CopyToClipboard
              text={this.state.clipboardText}
              >
              <Button 
                block
                type="primary" 
                onClick={this.onOptionExportClick}
                >
                导出图表配置
              </Button>
            </CopyToClipboard>
          </Form.Item>

    );
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              >
              <Form.Item
                label="X坐标"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("x")}
                  onChange={(value) => {this.onValueChange(value, "x")}}
                  />
              </Form.Item>
              <Form.Item
                label="Y坐标"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("y")}
                  onChange={(value) => {this.onValueChange(value, "y")}}
                  />
              </Form.Item>
              <Form.Item
                label="宽度"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("width")}
                  onChange={(value) => {this.onValueChange(value, "width")}}
                  />
              </Form.Item>
              <Form.Item
                label="长度"
                >
                <InputNumber 
                  step={1}
                  value={this.getValue("height")}
                  onChange={(value) => {this.onValueChange(value, "height")}}
                  />
              </Form.Item>
              <Button 
                block
                type="primary" 
                onClick={this.onRemoveClick}
                >
                删除图表容器
              </Button>
            </Form>
          </Panel>
          {this.props.curConfig ? dataConfig : null}
          {this.props.curOption ? optionConfig : null}
          {this.props.curOption ? optionInputConfig : null}
          {this.props.curInnerHtml !== null ? innerHtmlConfig : null}
          <Panel header="导出配置">
            <Form>
              <Form.Item>
                <CopyToClipboard
                  text={this.state.clipboardText}
                  >
                  <Button 
                    block
                    type="primary" 
                    onClick={this.onRectExportClick}
                    >
                    导出容器配置
                  </Button>
                </CopyToClipboard>
              </Form.Item>
              {this.props.curConfig ? dataExportConfig : null}
              {this.props.curOption ? optionExportConfig : null}
              {this.props.curInnerHtml !== null ? innerHtmlExportConfig : null}
              <Form.Item>
                <CopyToClipboard
                  text={this.state.clipboardText}
                  >
                  <Button 
                    block
                    type="primary" 
                    onClick={this.onAllExportClick}
                    >
                    导出所有配置
                  </Button>
                </CopyToClipboard>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </Drawer>
    );
  }
  /*
   * event handler
   * */
  onInnerHtmlExportClick = (e) => {
    this.exportData(this.props.curInnerHtml);
  }
  onStyleExportClick = (e) => {
    this.exportData(this.props.curStyle);
  }
  onRectExportClick = (e) => {
    this.exportData(this.props.curRect);
  }
  onOptionExportClick = (e) => {
    this.exportData(this.props.curOption);
  }
  onConfigExportClick = (e) => {
    this.exportData(this.props.curConfig);
  }
  onAllExportClick = (e) => {
    const data = {
      rect: this.props.curRect,
    }
    if(this.props.type === "chart"){
      data.option = this.props.curOption;
      data.config = this.props.curConfig;
    } else if(this.props.type === "ele"){
      data.style = this.props.curStyle;
      data.innerHtml = this.props.curInnerHtml;
    }
    this.exportData(data);
  }
  onConfigInnerHtmlClick = (e) => {
    const value = this.configInnerHtmlRef.resizableTextArea.textArea.value;
    this.props.onSetEleInnerHtml(this.props.id, value);
  }
  onConfigInputClick = (e) => {
    const value = this.configInputRef.resizableTextArea.textArea.value;
    try {
      const obj = JSON.parse(value);
      this.resetChart(obj);
    } catch (e) {
      message.error("JSON 格式有误，请重新输入");
    }
  }
  onRemoveClick = (e) => {
    this.props.onRemoveInstance(this.props.id)
  }
  onClose = () => {
    this.setConfigSider(false);
    this.props.onClearCurChartRef();
  }
  setConfigSider = (isOpen) => {
    this.setState({
      configSiderVisible: isOpen,
    });
  }
  onIntervalChange = (value) => {
    value = Math.floor(value);
    value = value < 1 ? 1 : value;
    const newObj = {...this.props.curConfig};
    newObj.interval = value;
    this.props.onSetChartConfig(this.props.id, newObj);
    if(this.props.curConfig.autoFlash){
      this.props.onSetIntervalGetter(this.props.id);
    }
  }
  onSwitchChange = (value) => {
    console.log(value)
    const newObj = {...this.props.curConfig}
    newObj.autoFlash = value;
    this.props.onSetChartConfig(this.props.id, newObj);
    this.props.onSetIntervalGetter(this.props.id);
  }
  onStyleDelete = (e) => {
    const {name, namespace, existing_src} = e;
    const newObj = this.locateValue(existing_src, namespace);
    delete newObj[name];
    this.props.onSetEleStyle(this.props.id, existing_src);
  }
  onStyleAdd = (e) => {
    const {name, namespace, existing_src, new_value} = e;
    if(name === null){
      this.props.onSetEleStyle(this.props.id, new_value);
      return;
    }
    const newObj = this.locateValue(existing_src, namespace);
    newObj[name] = new_value;
    this.props.onSetEleStyle(this.props.id, existing_src);
  }
  onStyleEdit = (e) => {
    const {name, namespace, existing_src, new_value} = e;
    if(typeof(new_value) !== "string"){
      message.error("样式值应为字符串");
      return;
    }
    const newObj = this.locateValue(existing_src, namespace);
    newObj[name] = new_value;
    this.props.onSetEleStyle(this.props.id, existing_src);
  }
  onOptionDelete = (e) => {
    const {name, namespace, existing_src} = e;
    const newObj = this.locateValue(existing_src, namespace);
    delete newObj[name];
    this.props.onSetChartOption(this.props.id, existing_src);
  }
  onOptionAdd = (e) => {
    const {name, namespace, existing_src, new_value} = e;
    if(name === null){
      this.props.onSetEleStyle(this.props.id, new_value);
      return;
    }
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
    //const {x, y, width, height} = newObj;
    this.props.onSetChartRect(this.props.id, newObj);
  }
  getValue = (key) => {
    return this.props.curRect ? this.props.curRect[key] : 0
  }
  getData = async(url) => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1],
    ]
    await new Promise((resolve) => {
      setTimeout(()=>{console.log("getting data"), resolve(1)}, 3000);
    });
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
    if(!value) {
      message.error("数据链接不能为空");
      return;
    }
    this.setState({
      searching: true,
    });
    await this.fetchData(value)
    this.setState({
      searching: false,
    });
    const newObj = {...this.props.curConfig};
    newObj.dataUrl = value;
    this.props.onSetChartConfig(this.props.id, newObj);
    if(this.props.curConfig.autoFlash) {
      this.props.onSetIntervalGetter(this.props.id);
    }
  }
  fetchData = async (url) => {
    console.log(url);
    let data = [];
    try {
      data = await this.getData(url);
    } catch (e) {
      /* handle error */
    }
    const newOption = this.mergeData(data)
    this.props.onSetChartOption(this.props.id, newOption);
  }
  setConfigInputRef = (ref) => {
    this.configInputRef = ref;
  }
  setConfigInnerHtmlRef = (ref) => {
    this.configInnerHtmlRef = ref;
  }
  resetChart = (obj) => {
    const {rect, option, config} = obj;
    if(rect){
      const newRect = {...this.props.curRect};
      Object.assign(newRect, rect);
      console.log(newRect);
      this.props.onSetChartRect(this.props.id, newRect);
    }
    if(option){
      const newOption = {...this.props.curOption};
      Object.assign(newOption, option);
      console.log(newOption);
      this.props.onSetChartOption(this.props.id, newOption);
    }
    if(config){
      const newConfig = {...this.props.curConfig};
      Object.assign(newConfig, config);
      console.log(newConfig);
      this.props.onSetChartConfig(this.props.id, newConfig);
    }
  }
  exportData = (obj) => {
    const text = JSON.stringify(obj);
    this.setState({
      clipboardText: text,
    });
    message.info("配置已经复制");
  }
}
