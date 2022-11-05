import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Input, Layout, Table, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import moment from 'moment-timezone';
import XLSX from 'xlsx';

var FileSaver: any = require('file-saver');

var inputdata = "";

export const Emails = observer(
  function() {
    const { itemStore } = React.useContext(AppContext);

    function onChange(e: any) {
      inputdata = e.target.value
    }

    function onSearch(value: any) {
      itemStore.loadEmailFromDB(value)
    }

    function nullArrayChecker(output: any) {
      if(output != null && typeof output === "object" && !Object.keys(output).length)
        return true;
      else
        return false;
    }

    function stringToArrayBuffer(s: any) { 
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);

      for (var i=0; i<s.length; i++) 
        view[i] = s.charCodeAt(i) & 0xFF;

      return buf;
    }

    function onConvertExcel() {
      if(!nullArrayChecker(itemStore.emaildatatemp.slice()))
      {
        moment.tz.setDefault("Asia/Seoul");

        var wb = XLSX.utils.book_new();
        var newWorksheet = XLSX.utils.json_to_sheet(itemStore.emaildatatemp.slice());
        
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Json Test Sheet');

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        var date = moment().format('YYMMDD');

        FileSaver.saveAs(new Blob([stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), 'kooza_email_list_' + date + '.xlsx');

        message.info('다운로드를 시작합니다. (kooza_email_list_' + date + '.xlsx)');
      }
      else
      {
        message.error('이메일이 검색되지 않았습니다.');
      }
    }

    function onConvertExcelAll() {
      itemStore.getEmailResults()
    }

    return(
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          이메일 검색
        </Button>

        &nbsp;

        <Button size="large" shape="round" type="default" onClick={onConvertExcel}>
          검색 결과 엑셀 다운로드
        </Button>

        &nbsp;

        <Button size="large" shape="round" type="default" onClick={onConvertExcelAll}>
          전체 엑셀 다운로드
        </Button>
        
        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          <table className="App-Table" width="50%">
            <tr>
              <td>
                <Input
                  size="large"
                  placeholder="이메일 주소 입력"
                  onChange={onChange}
                  onPressEnter={() => {onSearch(inputdata)}}
                  style={{width: "100%", borderRadius: 20}}
                />
              </td>
            </tr>
          </table>

          <br></br>
          <br></br>
          <br></br>

          {nullArrayChecker(itemStore.emaildata.slice()) ? <Spin tip="이메일 정보 로드 중..." indicator={<LoadingOutlined />} spinning={itemStore.loadingemail} /> : <Table size="small" columns={itemStore.emailattribute} dataSource={itemStore.emaildata.slice()} />}
        </Layout>

        {/* <Card className="App-Card">
          <Meta title={"판매자 정보 내려받기"} description={
            <div>
              <br></br>
              <br></br>
              <br></br>
              
              <Layout className="App-Center">
                <form action = "http://118.35.126.70:5001/seller" method="POST" encType="multipart/form-data">
                  <Row>
                    <Col span={4}>
                      <Button size="large" type="default" shape="round" style={{width: "100%"}}>
                        네이버 스마트스토어
                      </Button>
                    </Col>

                    <Col span={1} />

                    <Col span={9}>
                      <input type="file" name="file" onChange={(e) => {itemStore.setEmailFile(e.target.value.replace(/^.*[\\\/]/, ''))}} accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{width: "100%"}}/>
                      <input type="hidden" name="name" value={itemStore.emailfile} />
                    </Col>

                    <Col span={1} />

                    <Col span={4}>
                      <Button shape="round" type="default" size="large" onClick={() => window.open('http://118.35.126.70:5001/seller?type=naver')} style={{width: "100%"}}>
                        엑셀 양식 다운로드
                      </Button>
                    </Col>

                    <Col span={1} />

                    <Col span={4}>
                      <button style={{width: "100%"}}>
                        내려받기
                      </button>
                    </Col>
                  </Row>
                </form>
                  <Col span={2} />

                  <Col span={9}>
                    <Button size="large" type="default" shape="round">
                      쿠팡
                    </Button>

                    <Divider />

                    <Card style={{borderRadius: "10px"}}>
                      <form action = "http://118.35.126.70:5000/seller" method="POST" encType="multipart/form-data">
                        <input type="file" name="file" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{width: "100%"}}/>
        
                        <Divider />

                        <button style={{width: "100%"}}>
                          판매자 정보 내려받기
                        </button>
                      </form>
                      
                      <br></br>

                      <Button shape="round" type="default" onClick={() => window.open('http://118.35.126.70:5000/seller?type=coupang')} style={{width: "100%"}}>
                        엑셀 양식 다운로드
                      </Button>
                    </Card>
                  </Col>

                  <Col span={2} />
              </Layout>
            </div>
          }
          />
        </Card>

        <Card className="App-Card">
          <Meta title={"검색어로 내려받기"} description={
            <div>
              <br></br>
              <br></br>
              <br></br>
              
              <Layout className="App-Center">
                <form action = "http://118.35.126.70:5001/search" method="POST" encType="multipart/form-data">
                  <Row>
                    <Col span={4}>
                      <Button size="large" type="default" shape="round" style={{width: "100%"}}>
                        네이버 스마트스토어
                      </Button>
                    </Col>

                    <Col span={2} />

                    <Col span={2}>
                      <input type="text" name="keyword" placeholder={"검색어(한글)"} required={true}/>
                    </Col>

                    <Col span={1} />
                    
                    <Col span={2}>
                      <input type="text" name="filename" placeholder={"파일명"} required={true}/>
                    </Col>

                    <Col span={1} />

                    <Col span={2}>
                      <input type="text" name="start" placeholder={"시작 페이지(숫자)"} required={true}/>
                    </Col>

                    <Col span={1} />

                    <Col span={2}>
                      <input type="text" name="pages" placeholder={"페이지 개수(숫자)"} required={true}/>
                    </Col>

                    <Col span={3} />

                    <Col span={4}>
                      <button style={{width: "100%"}}>
                        내려받기
                      </button>
                    </Col>
                  </Row>
                </form>
              </Layout>
            </div>
          }/>
        </Card> */}
      </div>
    )
  }
);