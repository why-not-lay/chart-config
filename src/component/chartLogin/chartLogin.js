import React from "react";
import {Form, Input, Button, Card, message, Spin} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import MD5 from "js-md5";
import { requestPost } from "../../util/request";

export default class ChartLogin extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      spinning: false,
    };
  }
  render(){
    return (
      <Spin
        spinning={this.state.spinning}
        tip="登录中"
        >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "#ececec",
          }}
          >
          <Card
            title="用户登录"
            bordered={false}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              borderRadius: "10px",
            }}
            >
            <Form
              name="login"
              onFinish={this.onFinish}
              >
              <Form.Item
                name="username"
                rules={[{required: true, message: "请输入用户名"}]}
                >
                <Input 
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{required: true, message: "请输入密码"}]}
                >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码"
                  />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

      </Spin>
    );
  }
  onFinish = (values) => {
    const data = new FormData();
    const {username, password} = values;
    const url = "/chart/login"
    data.append("username", username);
    data.append("password", MD5(password).toUpperCase())
    this.setState({
      spinning: true,
    });
    requestPost(url, data)
      .then((res) => {
        if(res.success){
          window.location.replace("/chart/select");
        } else {
          message.error(res.err);
        }
      })
      .catch((res) => {
        message.error(res.err);
      })
      .finally(() => {
        this.setState({
          spinning: false,
        });
      })
  }
}
