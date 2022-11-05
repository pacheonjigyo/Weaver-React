import React from 'react';
import XLSX from 'xlsx';
import moment from 'moment-timezone';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Col, Input, Layout, Row, Spin, message } from "antd";
import { LoadingOutlined, QuestionOutlined } from '@ant-design/icons';

var FileSaver: any = require('file-saver');

var useraccesskeyforcoupang: string = "";
var usersecretkeyforcoupang: string = "";
var userproductforcoupang: any = [];

function stringToArrayBuffer(s: any) { 
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);

    for (var i=0; i<s.length; i++) 
      view[i] = s.charCodeAt(i) & 0xFF;

    return buf;
  }

export const Coupang = observer(
  function () {
    const { searchStore } = React.useContext(AppContext);

    searchStore.setHideHeader(true);

    console.log(searchStore.hideheader);
    
    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          쿠팡 배송/반품 정책 검사
        </Button>

        &nbsp;

        <Button size="large" shape="circle" type="default" icon={<QuestionOutlined />} onClick={() => {
            message.info('쿠팡 배송/반품 정책 확인 및 수정이 가능합니다.')
        }} />

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center" style={{
            marginLeft: 200,
            marginRight: 200
        }}>
            <Row style={{
                marginBottom: 10
            }}>
                <Col span={4}>
                    <Input size="large" placeholder="액세스키 입력" onChange={onChangeAccessKeyForCoupang} onPressEnter={onSearchCoupang} style={{textAlign: 'center', width: "100%"}}/>
                </Col>

                <Col span={4}>
                    <Input size="large" placeholder="시크릿키 입력" onChange={onChangeSecretKeyForCoupang} onPressEnter={onSearchCoupang} style={{textAlign: 'center', width: "100%"}}/>
                </Col>

                <Col span={4}>
                    <Input id="test" type="file" onChange={onChangeExcelFile} style={{textAlign: 'center', height: "40px", width: "100%"}}/>
                </Col>

                <Col span={4}>
                    {searchStore.coupangprocess === 0 ?
                        <Button size="large" type="primary" onClick={onSearchCoupang} style={{textAlign: 'center', width: "100%"}}>
                            검사시작
                        </Button>
                    :
                        <Spin indicator={<LoadingOutlined />} spinning={searchStore.loadingcoupang} >
                            <Button size="large" type="primary" onClick={onSearchCoupang} style={{textAlign: 'center', width: "100%"}}>
                                검사 중... ({searchStore.coupangprocess}/{userproductforcoupang.length})
                            </Button>
                        </Spin>
                    }
                </Col>

                <Col span={4}>
                    <Button size="large" type="default" onClick={onDownloadExcel} style={{textAlign: 'center', width: "100%"}}>
                        엑셀 다운로드
                    </Button>
                </Col>

                <Col span={4}>
                    <Button size="large" type="primary" onClick={onEditCoupang} style={{textAlign: 'center', width: "100%"}}>
                        일괄수정
                    </Button>
                </Col>
            </Row>

            <Row style={{
                textAlign: "left"
            }}>
                <Col span={24}>
                    {searchStore.coupangprocess === 0 ? null:
                        <>
                            <LoadingOutlined /> 진행 중... ({searchStore.coupangprocess}/{userproductforcoupang.length})
                        </>
                    }
                </Col>
            </Row>

            <Row style={{
                background: "whitesmoke",
            }}>
                <Col span={24}>
                    <div style={{
                        border: "1px solid lightgray",
                        height: 500,
                        overflowY: "scroll",
                        textAlign: "left"
                    }}>
                        {searchStore.coupanglog.map((v: any) => {return <>
                            {v.code === "SUCCESS" ? null : <div style={{
                                color: "red"
                            }}>
                                {v.id}: {v.message}
                            </div>}
                        </>})}
                    </div>
                </Col>
            </Row>
        </Layout>
      </div>
    );

    function onChangeAccessKeyForCoupang(e: any) {
        useraccesskeyforcoupang = e.target.value;
    }

    function onChangeSecretKeyForCoupang(e: any) {
        usersecretkeyforcoupang = e.target.value;
    }

    function onChangeExcelFile(e: any) {
        const fileList = e.target.files;

        if (fileList.length > 0) {
            var reader = new FileReader();

            reader.onload = function() {
                let data = reader.result;

                let workBook = XLSX.read(data, {type: 'binary'});

                workBook.SheetNames.forEach(async function (sheetName) {
                    let rows: any = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
                        defval: "",
                    });

                    console.log(rows);
                    
                    let filtered = rows.map((v: any) => v['업체상품 ID']);
                    
                    userproductforcoupang =  filtered.filter((element: any, index: any) => {
                        return filtered.indexOf(element) === index;
                    });

                    console.log(userproductforcoupang);

                    message.info(`상품 ${userproductforcoupang.length}개가 업로드 되었습니다.`);
                })
            };

            reader.readAsBinaryString(fileList[0]);
        }
    }

    function onDownloadExcel() {
        moment.tz.setDefault("Asia/Seoul");

        let inputData = searchStore.coupanglog.map((v: any, i: number) => {
            return {
                '순번': i + 1,
                '등록상품ID': v.id,
                '검사결과': v.code,
                '실패사유': v.message
            };
        });

        if (inputData.length <= 0) {
            message.error('다운로드할 데이터가 없습니다.');

            return;
        }

        var wb = XLSX.utils.book_new();
        var newWorksheet = XLSX.utils.json_to_sheet(inputData);
        
        XLSX.utils.book_append_sheet(wb, newWorksheet, '검사결과');

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        var date = moment().format('YYMMDD');

        console.log(wbout);
        
        FileSaver.saveAs(new Blob([stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), `쿠팡_배송반품비_검사결과_${date}.xlsx`);

        message.info('엑셀 파일 다운로드를 시작합니다.');
    }

    function onSearchCoupang() {
      if(useraccesskeyforcoupang === "" || useraccesskeyforcoupang.replaceAll(" ", "").length === 0) {
        message.error("액세스키를 입력해주세요.");

        return 0;
      }

      if(usersecretkeyforcoupang === "" || usersecretkeyforcoupang.replaceAll(" ", "").length === 0) {
        message.error("시크릿키를 입력해주세요.");

        return 0;
      }

      if (userproductforcoupang.length <= 0) {
        message.error("엑셀 파일을 업로드해주세요.");

        return 0;
      }

      searchStore.toggleCoupang(true);
      //   searchStore.editProductCoupang('d3087930-fdd7-490e-aa06-da32f79cc9c2', '5d4e2bce5dd8337285b634100c6a198d1b31327a', userproductforcoupang, false);
      searchStore.editProductCoupang(useraccesskeyforcoupang, usersecretkeyforcoupang, userproductforcoupang, false);
    }

    function onEditCoupang() {
        let filtered = searchStore.coupanglog.filter((v: any) => v.code !== "SUCCESS").map((v: any) => v.id);

        console.log(filtered);

        if (filtered.length <= 0) {
            message.error('수정할 상품이 없습니다.');

            return;
        }

        searchStore.toggleCoupang(true);
        // searchStore.editProductCoupang('d3087930-fdd7-490e-aa06-da32f79cc9c2', '5d4e2bce5dd8337285b634100c6a198d1b31327a', filtered, true);
        searchStore.editProductCoupang(useraccesskeyforcoupang, usersecretkeyforcoupang, userproductforcoupang, true);
    }
  }
);