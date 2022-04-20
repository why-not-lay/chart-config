import React from "react";
import {requestGet, requestPost} from "../../util/request";
import { 
  Row, 
  Col,
  Spin, 
  Card, 
  Menu,
  Input,
  Modal,
  Avatar,
  Layout, 
  Dropdown,
  Pagination,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
const {Header, Content, Footer} = Layout;
const {Meta} = Card;
export default class ChartSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      isCreateModalVisible: false,
      total: 100,
      curPage: 1,
      curIdx: -1,
      chartList: [],
    };
    this.cardWidth = 200;
    this.editInputRef = null;
    this.createInputRef = null;
  }
  componentDidMount(){
    const chartList = [
    ]
    for (let i = 0; i < 10; i++){
      chartList.push(
        {img: "", title: `t-${this.state.curPage}-${i}`, hash: Math.ceil(1000 * Math.random())}
      );
    }
    this.setState({
      chartList: chartList,
    });
  }
  render(){
    const menu = (
      <Menu>
        <Menu.Item key="a-m">
          <a>退出</a>
        </Menu.Item>
      </Menu>
    );
    const cards = this.state.chartList.map((chart, idx) => {
      const {img, title, hash} = chart;
      return (
        <Col
          key={hash}
          style={{
            width: `${this.cardWidth}px`,
          }}
          >
          <Card
            hoverable
            cover={
              <img 
                src={img}
                style={{
                }}
                />
            }
            actions={[
              <EditOutlined 
                key={`${hash}-edit`}
                onClick={(e) => {this.onEditClick(e, idx)}}
                />,
              <SettingOutlined
                key={`${hash}-settting`}
                onClick={(e) => {this.onSettingClick(e, idx)}}
                />,
              <DeleteOutlined 
                key={`${hash}-delete`}
                onClick={(e) => {this.onDeleteClick(e, idx)}}
                />
            ]}
            >
            <Meta
              title={title}
              />
          </Card>
        </Col>
      );
    });
    cards.push((
      <Col
        key="add-new"
        style={{
          width: `${this.cardWidth}px`,
        }}
        >
        <Card 
          hoverable
          onClick={this.onCreateClick}
          >
          <Row 
            justify="center"
            align="middle"
            >
            <Col>
              <PlusCircleFilled
                style={{
                  fontSize: "500%",
                  color: "rgba(0, 0, 0, 0.25)",
                }}
                />
            </Col>
          </Row>
        </Card>
      </Col>
    ));
    return(
      <Layout>
        <Header>
          <Dropdown 
            overlay={menu}
            trigger={["click", "hover"]}
            >
            <Avatar size="large" icon={<UserOutlined />}/>
          </Dropdown>
        </Header>
        <Content
          style={{
            height: "calc(100vh - 64px - 70px)",
          }}
          >
          <div
            style={{
              height: "90%",
              padding: "24px 48px",
              background: "#fff",
            }}
            >
            <div
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                height: "calc(100% - 32px)",
              }}
              >
              <Row 
                gutter={[16, 8]}
                >
                {cards}
              </Row>
            </div>
            <Row
              justify="center"
              >
              <Pagination
                current={this.state.curPage}
                total={this.state.total}
                hideOnSinglePage={true}
                onChange={this.onPageChange}
                />
            </Row>
          </div>
        </Content>
        <Footer style={{textAlign: "center"}}>Created by LYH</Footer>
        <Modal
          title="删除提示"
          visible={this.state.isDeleteModalVisible}
          onOk={this.onDeleteConfirmClick}
          onCancel={this.onDeleteCancelClick}
          >
          <p>确定要删除图表{`${this.state.curIdx === -1 ? "" : this.state.chartList[this.state.curIdx].title}`}</p>
        </Modal>
        <Modal
          title="修改名称"
          visible={this.state.isEditModalVisible}
          onOk={this.onEditConfirmClick}
          onCancel={this.onEditCancelClick}
          >
          <Input
            key={`${(new Date).getTime()}-edit-input`}
            defaultValue={this.state.curIdx === -1 ? "" : this.state.chartList[this.state.curIdx].title}
            ref={(ref) => {
              this.editInputRef = ref;
            }}
            />
        </Modal>
        <Modal
          title="新图表名称"
          visible={this.state.isCreateModalVisible}
          onOk={this.onCreateConfirmClick}
          onCancel={this.onCreateCancelClick}
          >
          <Input
            key={`${(new Date).getTime()}-create-input`}
            defaultValue=""
            ref={(ref) => {
              this.createInputRef = ref;
            }}
            />
        </Modal>
      </Layout>
    );
  }
  onEditClick = (e, idx) => {
    this.setState({
      curIdx: idx,
      isEditModalVisible: true,
    });
  }
  onEditConfirmClick = () => {
    const value = this.editInputRef.input.value;
    /*
     * network
     * */
    this.setState({
      isEditModalVisible: false,
      curIdx: -1,
    });
  }
  onEditCancelClick = () => {
    this.setState({
      isEditModalVisible: false,
      curIdx: -1,
    });
  }
  onDeleteClick = (e, idx) => {
    this.setState({
      curIdx: idx,
      isDeleteModalVisible: true,
    });
  }
  onDeleteConfirmClick = () => {
    /*
     * network
     * */
    this.setState({
      curIdx: -1,
      isDeleteModalVisible: false,
    });
  }
  onDeleteCancelClick = () => {
    this.setState({
      isDeleteModalVisible: false,
      curIdx: -1,
    });
  }
  onCreateClick = (e) => {
    this.setState({
      isCreateModalVisible: true,
    });
  }
  onCreateConfirmClick = () => {
    /*
     * network
     * */
    const value = this.createInputRef.input.value;
    this.setState({
      isCreateModalVisible: false,
    });
  }
  onCreateCancelClick = () => {
    this.setState({
      isCreateModalVisible: false,
    });
  }
  onSettingClick = (e, idx) => {
    /**
     * 跳转
     */
  }
  onPageChange = (page, pageSize) => {
    this.setState({
      curPage: page,
    });
  }
  sendMessage = async (url, data) => {
    try {
      const rp = await requestPost(url, data);
      const {success, data, err} = rp;
      if(!success){
        message.error("请求出错，请检查网络");
        return;
      }
    } catch (e) {
      message.error("操作错误");
    }
  }
}
