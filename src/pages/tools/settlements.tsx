import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Col, Input, Layout, Row, Spin, message } from "antd";
import { LoadingOutlined, QuestionOutlined } from '@ant-design/icons';

var useridforsmartstore: string = "";
var userpwforsmartstore: string = "";

var useridforcoupang: string = "";
var userpwforcoupang: string = "";

export const Settlements = observer(
  function () {
    const { searchStore } = React.useContext(AppContext);

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          쇼핑몰 정산 예정 금액 계산기
        </Button>

        &nbsp;

        <Button size="large" shape="circle" type="default" icon={<QuestionOutlined />} onClick={() => {
          message.info('쇼핑몰 아이디와 비밀번호를 입력하여 간단하게 정산금을 예측할 수 있습니다.')
        }} />

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          <br></br>
          <br></br>
          <br></br>

          <Row>
            <Col span={3} />

            <Col span={3}>
              <Button size="large" type={searchStore.settlement === '스마트스토어' ? "primary" : "default"} style={{width: "95%"}} onClick={() => onClickSettlement("스마트스토어")}>
                스마트스토어
              </Button>
            </Col>

            <Col span={3}>
              <Input size="large" disabled={searchStore.settlement === '스마트스토어' ? false : true} placeholder="아이디" onChange={onChangeIDForSmartStore} onPressEnter={onSearchSmartStore} style={{textAlign: 'center', width: "95%"}}/>
            </Col>

            <Col span={3}>
              <Input size="large" disabled={searchStore.settlement === '스마트스토어' ? false : true} placeholder="비밀번호" type="password" onChange={onChangePasswordForSmartStore} onPressEnter={onSearchSmartStore} style={{textAlign: 'center', width: "95%"}}/>
            </Col>

            <Col span={3}>
              <Button size="large" disabled={searchStore.settlement === '스마트스토어' ? false : true} type="primary" onClick={onSearchSmartStore} style={{width: "95%"}}>
                조회하기
              </Button>
            </Col>

            <Col span={3}>
              {searchStore.settlementsmartstore ?
                <Input disabled={searchStore.settlement === '스마트스토어' ? false : true} size="large" value={searchStore.settlementsmartstore.toLocaleString() + " 원"} style={{textAlign: 'end', width: "95%"}}/>
                  :
                <Spin indicator={<LoadingOutlined />} spinning={searchStore.loadingsmartstore}>
                  <Input disabled={searchStore.settlement === '스마트스토어' ? false : true} size="large" value={searchStore.loadingsmartstore ? "조회 중..." : "정산금 미조회"} style={{textAlign: 'end', width: "95%"}}/>
                </Spin>
              }
            </Col>

            <Col span={3}>
              {searchStore.settlementsmartstore ?
                <Input disabled={searchStore.settlement === '스마트스토어' ? false : true} size="large" value={"? 원"} style={{textAlign: 'end', width: "95%"}}/>
                  :
                <Spin indicator={<LoadingOutlined />} spinning={searchStore.loadingsmartstore}>
                  <Input disabled={searchStore.settlement === '스마트스토어' ? false : true} size="large" value={searchStore.loadingsmartstore ? "조회 중..." : "정산금 미조회"} style={{textAlign: 'end', width: "95%"}}/>
                </Spin>
              }
            </Col>

            <Col span={3} />
          </Row>

          <br></br>

          <Row>
            <Col span={3} />

            <Col span={3}>
              <Button size="large" type={searchStore.settlement === '쿠팡' ? "primary" : "default"} style={{width: "95%"}} onClick={() => onClickSettlement("쿠팡")}>
                쿠팡
              </Button>
            </Col>

            <Col span={3}>
              <Input size="large" disabled={searchStore.settlement === '쿠팡' ? false : true} placeholder="아이디" onChange={onChangeIDForCoupang} onPressEnter={onSearchCoupang} style={{textAlign: 'center', width: "95%"}}/>
            </Col>

            <Col span={3}>
              <Input size="large" disabled={searchStore.settlement === '쿠팡' ? false : true} placeholder="비밀번호" type="password" onChange={onChangePasswordForCoupang} onPressEnter={onSearchCoupang} style={{textAlign: 'center', width: "95%"}}/>
            </Col>

            <Col span={3}>
              <Button size="large" disabled={searchStore.settlement === '쿠팡' ? false : true} type="primary" onClick={onSearchCoupang} style={{width: "95%"}}>
                조회하기
              </Button>
            </Col>

            <Col span={3}>
              {searchStore.settlementcoupang ?
                <Input size="large" disabled={searchStore.settlement === '쿠팡' ? false : true} value={searchStore.settlementcoupang.toLocaleString() + " 원"} style={{textAlign: 'end', width: "95%"}}/>
                  :
                <Spin indicator={<LoadingOutlined />} spinning={searchStore.loadingcoupang} >
                  <Input disabled={searchStore.settlement === '쿠팡' ? false : true} size="large" value={searchStore.loadingcoupang ? "조회 중..." : "정산금 미조회"} style={{textAlign: 'end', width: "95%"}}/>
                </Spin>
              }
            </Col>

            <Col span={3}>
              {searchStore.settlementcoupang ?
                <Input disabled={searchStore.settlement === '쿠팡' ? false : true} size="large" value={"? 원"} style={{textAlign: 'end', width: "95%"}}/>
                  :
                <Spin indicator={<LoadingOutlined />} spinning={searchStore.loadingcoupang} >
                  <Input disabled={searchStore.settlement === '쿠팡' ? false : true} size="large" value={searchStore.loadingcoupang ? "조회 중..." : "정산금 미조회"} style={{textAlign: 'end', width: "95%"}}/>
                </Spin>
              }
            </Col>

            <Col span={3} />
          </Row>
        </Layout>
      </div>
    );

    function onChangeIDForSmartStore(e: any) {
      useridforsmartstore = e.target.value;
    }

    function onChangePasswordForSmartStore(e: any) {
      userpwforsmartstore = e.target.value;
    }

    function onChangeIDForCoupang(e: any) {
      useridforcoupang = e.target.value;
    }

    function onChangePasswordForCoupang(e: any) {
      userpwforcoupang = e.target.value;
    }

    function onClickSettlement(value: string) {
      searchStore.setSettlement(value);
    }

    function onSearchSmartStore() {
      if(searchStore.settlement === "") {
        message.error("쇼핑몰을 선택해주세요.");

        return 0;
      }

      if(useridforsmartstore === "" || useridforsmartstore.replaceAll(" ", "").length === 0) {
        message.error("아이디를 입력해주세요.");

        return 0;
      }

      if(userpwforsmartstore === "" || userpwforsmartstore.replaceAll(" ", "").length === 0) {
        message.error("비밀번호를 입력해주세요.");

        return 0;
      }

      searchStore.toggleSmartStore(true);
      searchStore.initSettlementSmartStore();
      searchStore.getSettlementFromSmartStore(useridforsmartstore, userpwforsmartstore);
    }

    function onSearchCoupang() {
      if(searchStore.settlement === "") {
        message.error("쇼핑몰을 선택해주세요.");

        return 0;
      }

      if(useridforcoupang === "" || useridforcoupang.replaceAll(" ", "").length === 0) {
        message.error("아이디를 입력해주세요.");

        return 0;
      }

      if(userpwforcoupang === "" || userpwforcoupang.replaceAll(" ", "").length === 0) {
        message.error("비밀번호를 입력해주세요.");

        return 0;
      }

      searchStore.toggleCoupang(true);
      searchStore.initSettlementCoupang();
      searchStore.getSettlementFromCoupang(useridforcoupang, userpwforcoupang);
    }
  }
);