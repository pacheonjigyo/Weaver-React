import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Col, Divider, Dropdown, Input, Layout, Menu, Row, Spin, Table, Typography, message } from "antd";
import { DownOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

var comment: String = "";

var inputdata: String = "";
var inputType : number = 0;

var databaseType: number = 0;

export const SellForYou = observer(
  function () {
    const { boardStore, itemStore } = React.useContext(AppContext);

    function handleDatabase(e: any) {
      boardStore.changeDatabaseDropdown(e.key);

      switch(e.key) {
        case '전체': {
          databaseType = 0;
    
          break;
        }
    
        case '1개월': {
          databaseType = 1;
    
          break;
        }

        case '3개월': {
          databaseType = 3;
    
          break;
        }

        case '6개월': {
          databaseType = 4;
    
          break;
        }
    
        case '12개월': {
          databaseType = 2;
    
          break;
        }

        default: break;
      }
    }

    function handleType(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      boardStore.changeTypeDropdown(e.key);
    
      switch(e.key) {
        case '이메일': {
          inputType = 0;
    
          break;
        }
    
        case '제목': {
          inputType = 1;
    
          break;
        }

        case '이름': {
          inputType = 2;
    
          break;
        }

        case '전화번호': {
          inputType = 3;
    
          break;
        }
    
        default: break;
      }
    }

    function onChange(e: any) {
      inputdata = e.target.value;
    }

    function onSearch(value: any) {
      if(value !== null && value !== '' && value.replaceAll(' ', '').length !== 0){           
        boardStore.initList();
        boardStore.enableLoading(true);
        boardStore.filterListsBy(databaseType, inputType, value.toLowerCase());
      } 
      else {
        boardStore.enableLoading(true);
        boardStore.getUserData(databaseType);
      }
    }

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          솔루션 신청 관리
        </Button>

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          <table className="App-Table">
            <tr>
              <td>
                <Dropdown.Button size="large" icon={<DownOutlined />} overlay={
                  <Menu onClick={handleDatabase}>
                    <Menu.Item key="전체">전체</Menu.Item>
                    <Menu.Item key="1개월">1개월</Menu.Item>
                    <Menu.Item key="3개월">3개월</Menu.Item>
                    <Menu.Item key="6개월">6개월</Menu.Item>
                    <Menu.Item key="12개월">12개월</Menu.Item>
                  </Menu>
                }>

                {boardStore.dropdowndatabase}

                </Dropdown.Button>
              </td>

              <td>
                <Dropdown.Button size="large" icon={<DownOutlined />} overlay={
                  <Menu onClick={handleType}>
                    <Menu.Item key="이메일">이메일</Menu.Item>
                    <Menu.Item key="제목">제목</Menu.Item>
                    <Menu.Item key="이름">이름</Menu.Item>
                    <Menu.Item key="전화번호">전화번호</Menu.Item>
                  </Menu>
                }>

                {boardStore.dropdowntype}

                </Dropdown.Button>
              </td>

              <td>
                <Input
                  size="large"
                  placeholder="이메일, 이름, 제목, 전화번호 입력"
                  onChange={(e) => {onChange(e)}}
                  onPressEnter={() => onSearch(inputdata)}
                  style={{width: 300}}
                /> 
              </td>
                
              <td>
                <Button type="default" size="large" icon={<SearchOutlined />} onClick={() => onSearch(inputdata)} style={{width: 50, borderTopRightRadius: 20, borderBottomRightRadius: 20}} />
              </td>
            </tr>
          </table>

          <br />
          <br />
          <br />

          {nullArrayChecker(boardStore.data.slice()) ? <Spin tip="회원 정보 로드 중..." indicator={<LoadingOutlined />} spinning={boardStore.enableloading} /> : <Table size="small" pagination={{pageSize: 50}} columns={boardStore.attribute.slice()} dataSource={boardStore.data.slice()} expandable={{
            onExpand: (e, record) => onExpanded(e, record),
            expandedRowRender: record => <div>
              <Text style={{fontSize: "20px", fontWeight: 100}}>Q. {record.title}</Text>

              <br></br>

              from {record.email}, at {record.moment}              

              <br></br>
              <br></br>

              추천인 ID: {record.description === "" ? "미입력" : record.description}

              <Divider />

              {itemStore.administration ?
                <div>
                  <Text style={{fontSize: "20px", fontWeight: 100}}>A. {record.title}</Text>

                  {record.comment ? 
                    <div>
                      from KOOZAPAS

                      <br></br>
                      <br></br>

                      {record.comment}
                    </div>
                      :
                    <div>
                      <br></br>

                      <Row className="App-Center">
                        <Col span="22">
                          <TextArea rows={3} onChange={onChangeComment} placeholder="답변을 작성해주세요." />
                        </Col>

                        <Col span="2">
                          <Button type="primary" style={{width: "90%", height: "100%"}} onClick={() => addComment(record)}>답변하기</Button>
                        </Col>  
                      </Row>
                    </div>
                  }
                </div>
                  :
                <div>         
                  {record.comment ? 
                    <div>
                      <Text style={{fontSize: "20px", fontWeight: 100}}>A. {record.title}</Text>

                      <br></br>

                      from KOOZAPAS

                      <br></br>
                      <br></br>

                      {record.comment}
                    </div>
                      :
                    <div>
                      아직 답변이 작성되지 않았습니다.
                    </div>
                  }
                </div>

              }

            </div> 
          }} />}
        </Layout>
      </div>
    );

    function addComment(record: any) {
      if(comment.replaceAll(" ", "").length > 0) {
        record.comment = comment;
      
        boardStore.addComment(record);
      }
      else
        message.warning("공백은 입력할 수 없습니다.");
    }

    function onChangeComment(e: any) {
      comment = e.target.value;
    }

    function onExpanded(e: boolean, record: any) {
      if(e === true) {
        boardStore.addVisit(record);
      }
    }

    function nullArrayChecker(output: any) {
      if(output != null && typeof output === "object" && !Object.keys(output).length) {
          return true;
      } else {
          return false;
      }
    }
  }
);