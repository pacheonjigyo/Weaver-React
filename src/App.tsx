import './App.less';

import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from "./AppContext";
import { Lookups } from './pages/goods/lookups';
import { Keywords } from './pages/markets/keywords';
import { Emails } from './pages/bookmarks/emails';
import { Excels } from './pages/bookmarks/excels';
import { SellForYou } from './pages/services/sellforyou';
import { SellerCat } from './pages/services/sellercat';
import { Trangers } from './pages/services/trangers';
import { Coupang } from './pages/tools/coupang';

import { Switch, Route, Link } from "react-router-dom";
import { BackTop, Button, Checkbox, Col, Divider, Form, Input, Layout, Menu, Modal, Radio, Row, Typography, message } from 'antd';
import { ArrowUpOutlined, GiftOutlined, InfoOutlined, MailOutlined, NotificationOutlined, ShopOutlined, SyncOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const login = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

const email = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

const { SubMenu } = Menu;

const { Text } = Typography;
const { TextArea } = Input;
const { Header, Content } = Layout;

export const App = observer(() => {
    const { boardStore, itemStore, catStore, tranStore, searchStore } = React.useContext(AppContext);

    const [ formEmail ] = Form.useForm();
    const [ formLogin ] = Form.useForm();

    React.useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!accessToken || !refreshToken) {
        message.error('로그인 후 이용해주세요.');

        return;
      }

      message.success('로그인되었습니다.');

      boardStore.toggleAdministration(true);
      tranStore.toggleAdministration(true);
      catStore.toggleAdministration(true);
      itemStore.toggleAdministration(true);
    }, []);

    return (
      <Layout className="App">
        <BackTop>
          <div className="App-Top"><ArrowUpOutlined /></div>
        </BackTop>

        {searchStore.hideheader ? null : <Header className="App-Header" style={{position: 'fixed', zIndex: 1, width: '100%', height: '70px'}}>
          <Row>
            <Col span={6}>
              <Menu className="App-Menu" theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <SubMenu title={<GiftOutlined style={{fontSize: '25px'}}/>}>
                  <Menu.Item>
                    상품 검색/관리

                    <Link to="/lookup" />
                  </Menu.Item>
                </SubMenu>

                <SubMenu title={<ShopOutlined style={{fontSize: '25px'}}/>}>              
                  <Menu.Item>
                    키워드 검색

                    <Link to="/keywords" />
                  </Menu.Item>
                </SubMenu>

                <SubMenu title={<UsergroupAddOutlined style={{fontSize: '25px'}}/>}>
                  <Menu.Item>
                    솔루션 신청 관리

                    <Link to="/sellforyou" />
                  </Menu.Item>

                  <Menu.Item>
                    트랜져스 회원 관리

                    <Link to="/trangers" />
                  </Menu.Item>

                  <Menu.Item>
                    셀러캣 회원 관리

                    <Link to="/sellercat" />
                  </Menu.Item>
                </SubMenu>

                <SubMenu title={<NotificationOutlined style={{fontSize: '25px'}}/>}>
                  <Menu.Item>
                    이메일 검색

                    <Link to="/emails" />
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Col>

            <Col span={12}>
              <img src="./favicon.png" height={70} alt=""/>
            </Col>

            <Col span={3} />

            <Col span={3}>
              <Menu className="App-Menu" theme="dark" mode="horizontal">
                <Menu.Item icon={<MailOutlined style={{fontSize: "25px"}}/>} onClick={onClickMail} />
                <Menu.Item icon={<UserOutlined style={{fontSize: "25px"}} />} onClick={onClickAdmin} />
                <Menu.Item icon={<InfoOutlined style={{fontSize: "25px"}} />} onClick={onClickAboutUs} />
              </Menu>
            </Col>
          </Row>
        </Header>}

        <Content className="App-Content" style={{margin: 100}}>
          <Switch>
            <Route path="/" component={Lookups} exact={true} />
            <Route path="/lookup" component={Lookups} exact={true} />
            <Route path="/keywords" component={Keywords} exact={true} />
            <Route path="/sellforyou" component={SellForYou} exact={true} />
            <Route path="/trangers" component={Trangers} exact={true} />
            <Route path="/sellercat" component={SellerCat} exact={true} />
            <Route path="/emails" component={Emails} exact={true} />
            <Route path="/excels" component={Excels} exact={true} />
            <Route path="/coupang" component={Coupang} exact={true} />
          </Switch>
        </Content>

        <Modal title="메일 전송 서비스" visible={itemStore.enablemail} centered width={600} onOk={handleMailClose} onCancel={handleMailClose} footer={false}>
          <Form form={formEmail} size="large" {...email} name="nest-messages" onFinish={onEmailFinish}>
            서비스 종류(네이버, 구글) 선택 후 받는 사람 이메일과 제목, 내용(HTML) 작성 후 전송 버튼을 클릭하여 간단하게 이메일을 보낼 수 있습니다.

            <br></br>
            <br></br>

            [발신자 정보]

            <br></br>
            <br></br>

            이메일: 

            &nbsp;
            
            {itemStore.sender ? 
              <Text>koozapas@{itemStore.sender}.com</Text> 
                :
              <Text type="danger">서비스 타입을 지정해주세요.</Text>}

            <br></br>

            발송 정책:

            &nbsp;

            {itemStore.multiple ?
              <Text>
                다중 발송
              </Text>
                :
              <Text>
                단일 발송
              </Text>
            }

            <br></br>
            <br></br>

            <Row>
              <Col span={12}>
                <Form.Item name="type" rules={[{ required: true, message: '필수 입력 항목입니다.' }]}>
                  <Radio.Group onChange={onRadioChange}>
                    <Radio value="naver">네이버</Radio>
                    <Radio value="gmail">구글</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="multiple">
                  <Checkbox.Group onChange={onCheckChange}>
                    <Checkbox value={true} style={{lineHeight: '10px'}}>
                      다중 발송
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            {itemStore.multiple ? 
              <Form.Item name='to' rules={[{ required: true, message: '필수 입력 항목입니다.' }]}>
                <Input placeholder="수신자 이메일 주소 - 콤마(,)로 구분" />
              </Form.Item>
                : 
              <Form.Item name='to' rules={[{ required: true, message: '필수 입력 항목입니다.' }]}>
                <Input placeholder="수신자 이메일 주소" />
              </Form.Item>
            }

            <Form.Item name='subject'>
              <Input placeholder="메일 제목" />
            </Form.Item>

            <Form.Item name='text'>
              <TextArea rows={2} placeholder="메일 내용(TEXT)" />
            </Form.Item>

            <Form.Item name='html'>
              <TextArea rows={4} placeholder="메일 내용(HTML)" />
            </Form.Item>

            <br></br>

            <Form.Item wrapperCol={{ ...email.wrapperCol }}>
              <Button style={{width: "100%"}} type="primary" htmlType="submit">
                전송
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal title="관리자 모드" visible={itemStore.enableadmin} centered width={400} onOk={handleAdminClose} onCancel={handleAdminClose} footer={false}>
          <Form form={formLogin} size="large" {...login} name="nest-messages" onFinish={onLoginFinish}>
            관리자 모드를 활성화 할 경우 상품 및 트랜져스 회원 정보 수정/삭제, 피드백 답글 쓰기 등이 가능합니다.
            
            <br></br>
            <br></br>

            <Form.Item name='id'>
              <Input placeholder="아이디" />
            </Form.Item>

            <Form.Item name='password'>
              <Input type="password" placeholder="비밀번호" />
            </Form.Item>

            <Form.Item wrapperCol={{ ...login.wrapperCol }}>
              <Button style={{width: "100%"}} type="primary" htmlType="submit">
                로그인
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal title="서비스 정보" visible={itemStore.enableaboutus} centered width={450} onOk={handleAboutUsClose} onCancel={handleAboutUsClose} footer={false}>
            <Row>
              <Col span={8}>
                Name
              </Col>

              <Col span={16}>
                WEAVER
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                Version
              </Col>

              <Col span={16}>
                2.7.0
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col span={8}>
                Backend
              </Col>

              <Col span={8}>
                {boardStore.backend}
              </Col>

              <Col span={8}>
                <Button icon={<SyncOutlined />} type="default" shape="round" size="small" onClick={() => {boardStore.getBackendState()}}/>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                Crawller
              </Col>

              <Col span={8}>
                {boardStore.crawller}
              </Col>

              <Col span={8}>
                <Button icon={<SyncOutlined />} type="default" shape="round" size="small" onClick={() => {boardStore.getCrawllerState()}}/>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                Database
              </Col>

              <Col span={8}>
                {boardStore.database}
              </Col>

              <Col span={8}>
                <Button icon={<SyncOutlined />} type="default" shape="round" size="small" onClick={() => {boardStore.getDatabaseState()}}/>
              </Col>
            </Row>

            <Divider />

            <Row>
              Copyright ⓒ 2021, (주) 쿠자피에이에스 All rights reserved.
            </Row>
        </Modal>
      </Layout>
    );

    function onRadioChange(e: any) {
      itemStore.setCurrentSender(e.target.value);
    }

    function onCheckChange(e: any) {
      if(e[0] === true)
        itemStore.toggleMultiple(true);
      else
        itemStore.toggleMultiple(false);
    }

    function handleAdminClose() {
      itemStore.enableAdminModal(false);
    }

    function handleMailClose() {
      itemStore.enableMailModal(false);
    }

    function handleAboutUsClose() {
      itemStore.enableAboutUsModal(false);
    }

    function onClickAdmin() {
      if(!itemStore.administration) {
        itemStore.enableAdminModal(true);
        
        return;
      }

      const accept = window.confirm("로그아웃 하시겠습니까?");

      if (!accept) {
        return;
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      message.success('로그아웃 되었습니다.');
    }

    function onClickMail() {
      itemStore.enableMailModal(true);
    }

    function onClickAboutUs() {
      itemStore.enableAboutUsModal(true);
    }

    async function onLoginFinish(values: any) {
      const query = `
        mutation ($id: String!, $password: String!) {
          signInAdminByEveryone(
            id: $id,
            password: $password
          ) {
            accessToken
            refreshToken
          }
        }
      `;
      
      const variables = {
        id: values.id,
        password: values.password
      };

      const loginResp = await fetch('https://api.sellforyou.co.kr/graphql', {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ query, variables }),
      });

      const loginJson = await loginResp.json();

      if (loginJson.errors) {
        message.error('로그인 실패');

        alert(loginJson.errors[0].message);

        return;
      }

      const accessToken = loginJson.data.signInAdminByEveryone.accessToken;
      const refreshToken = loginJson.data.signInAdminByEveryone.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      message.success('로그인 성공');

      boardStore.toggleAdministration(true);
      tranStore.toggleAdministration(true);
      catStore.toggleAdministration(true);

      itemStore.toggleAdministration(true);
      itemStore.enableAdminModal(false);
    }

    function onEmailFinish(values: any) {
      console.log(values);

      itemStore.sendMail(values);
      itemStore.enableMailModal(false);
    }
  }
);