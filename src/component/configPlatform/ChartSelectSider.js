import React from "react";
//import { Menu, Drawer } from "antd";
//const { SubMenu } = Menu;
import { Menu, Layout} from "antd";
const {Sider} = Layout;
export default class ChartSelectSider extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    //return (
    //    <Drawer 
    //      title="图表选择" 
    //      placement="left" 
    //      visible={true}
    //      getContainer={false}
    //      mask={false}
    //      style={{position: "absolute"}}
    //      >
    //      <Menu
    //        mode="inline"
    //        style={{height: "100%"}}
    //        >
    //        <Menu.Item key="1">c1</Menu.Item>
    //        <Menu.Item key="2">c2</Menu.Item>
    //        <Menu.Item key="3">c3</Menu.Item>
    //      </Menu>
    //    </Drawer>
    //);
    return (
        <Sider
          collapsible={true}
          collapsedWidth={0}
          style={{height: "100%"}}
          >
          <Menu
            mode="inline"
            style={{height: "100%"}}
            >
            <Menu.Item key="1">折线图</Menu.Item>
            <Menu.Item key="2">柱状图</Menu.Item>
            <Menu.Item key="3">饼图</Menu.Item>
          </Menu>
        </Sider>
    );
  }
}

