import React from "react";
import {requestGet, requestPost} from "../../util/request";
import { 
  Row, 
  Col,
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
  EnterOutlined,
  DeleteOutlined,
  SettingOutlined,
  PlusCircleFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
const {Header, Content, Footer} = Layout;
const {Meta} = Card;
export default class ChartSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isShareModalVisible: false,
      total: 0,
      curPage: 1,
      curPageNum: 10,
      curIdx: -1,
      chartList: [],
    };
    this.cardWidth = 200;
    this.editInputRef = null;
    this.createInputRef = null;
  }
  componentDidMount(){
    this.getInfo();
  }
  render(){
    const menu = (
      <Menu>
        <Menu.Item key="a-m">
          <a href="/chart/logout">退出</a>
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
              <ShareAltOutlined
                key={`${hash}-share`}
                onClick={(e) => {this.onShareClick(e, idx)}}
                />,
              <EditOutlined 
                key={`${hash}-edit`}
                onClick={(e) => {this.onEditClick(e, idx)}}
                />,
              <SettingOutlined
                key={`${hash}-settting`}
                onClick={(e) => {this.onSettingClick(e, idx)}}
                />,
              <EnterOutlined
                key={`${hash}-enter`}
                onClick={(e) => {this.onEnterClick(e, idx)}}
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
                pageSize={this.state.curPageNum}
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
          title="链接分享"
          visible={this.state.isShareModalVisible}
          onOk={this.onShareConfirmClick}
          >
          <p>{this.state.curIdx === -1 ? "" : `${window.location.origin}/chart/show?cid=${this.state.chartList[this.state.curIdx].hash}`}</p>
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
  onShareClick = (e, idx) => {
    this.setState({
      curIdx: idx,
      isShareModalVisible: true,
    });
  }
  onShareConfirmClick = () => {
    this.setState({
      isShareModalVisible: false,
      curIdx: -1,
    });
  }
  onEditClick = (e, idx) => {
    this.setState({
      curIdx: idx,
      isEditModalVisible: true,
    });
  }
  onEditConfirmClick = () => {
    const value = this.editInputRef.input.value;
    const data = new FormData();
    const hash = this.state.chartList[this.state.curIdx].hash;
    data.append("cid", hash);
    data.append("name", value);
    requestPost("/chart/set/name", data)
      .then((res) => {
        if(res.success){
          message.info("修改成功");
          this.getInfo();
        }
      })
      .catch((err) => {
        message.error("操作有误");
      })
      .finally(() => {
        this.setState({
          isEditModalVisible: false,
          curIdx: -1,
        });
      })
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
    const hash = this.state.chartList[this.state.curIdx].hash;
    requestGet(`/chart/delete?cid=${hash}`)
      .then((res) => {
        if(res.success){
          message.info("删除成功");
          this.getInfo();
        } else {
          message.error(res.error);
        }
      })
      .catch((err) => {
        message.error("操作有误");
      })
      .finally(() => {
        this.setState({
          curIdx: -1,
          isDeleteModalVisible: false,
        });
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
    const value = this.createInputRef.input.value;
    const data = new FormData();
    data.append("name", value);
    requestPost("/chart/add", data)
      .then((res) => {
        if(res.success){
          message.info("创建成功");
          this.getInfo();
        } else {
          message.error(res.err);
        }
      })
      .catch((err) => {
        message.error("操作错误");
      })
      .finally(() => {
        this.setState({
          isCreateModalVisible: false,
        });
      })
  }
  onCreateCancelClick = () => {
    this.setState({
      isCreateModalVisible: false,
    });
  }
  onEnterClick = (e, idx) => {
    const chart = this.state.chartList[idx];
    const url = `/chart/show?cid=${chart.hash}`;
    window.open(url);
  }
  onSettingClick = (e, idx) => {
    const chart = this.state.chartList[idx];
    const url = `/chart/operation?cid=${chart.hash}`;
    window.open(url);
  }
  onPageChange = (page, pageSize) => {
    this.setState({
      curPage: page,
      curPageNum: pageSize,
    },
    () => {
      this.getInfo();
    });
  }
  getInfo = async () => {
    try {
      const url = `/chart/info?page=${this.state.curPage}&pageNum=${this.state.curPageNum}`
      const res = await requestGet(url);
      if(res.success){
        this.updateChartList(res.data);
      } else {
        message.error("请求出错，请检查网络")
      }
    } catch (e) {

    }
  }

  updateChartList = (data) => {
    const chartList = [];
    const {list, total} = data;
    list.forEach((chart) => {
      chartList.push({
        img: chart.thumb,
        title: chart.name,
        hash: chart.hash,
      });
    });
    this.setState({
      chartList: chartList,
      total: total,
    });
  }
}
