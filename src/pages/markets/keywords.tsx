import React from 'react';

import { Button, Input, Card, Col, Layout, Row } from 'antd';
import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";

const { Meta } = Card;

var inputData: string = "";

export const Keywords = observer(
  function() {
    const { searchStore } = React.useContext(AppContext);

    return(
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          키워드 검색
        </Button>
          
        &nbsp;

        <Button type="default" shape="round" size="large">{searchStore.datatotal}개의 스토어</Button>

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          <table className="App-Table" width="50%">
            <tr>
              <td>
                <Input
                  onChange={onChange}
                  onPressEnter={onEntered}
                  placeholder="키워드 입력"
                  size="large"
                  style={{width: "100%", borderRadius: 20}}
                />
              </td>
            </tr>
          </table>

          <br></br>
          <br></br>

          <Row className="App-Table">
            {searchStore.data.slice().map((data: any, i: number) => (
              <Col span={3}>
                <Card className="App-Card" key={i} hoverable onClick={() => {openURL(data.unique)}}>
                  <Meta title={data.shopname} description={data.unique} />
                </Card>
              </Col>
            ))}
          </Row>
        </Layout>
      </div>
    )

    function onChange(e: any) {
      inputData = e.target.value;
    }
    
    function onEntered() {
      searchStore.getDataLists();
    }

    function openURL(value: string) {
      if(inputData !== null && inputData !== ''){
        if(inputData.replaceAll(' ', '').length !== 0){            
            window.open('https://smartstore.naver.com/' + value + '/search?q=' + inputData, '_blank');
        }
        else
          window.open('https://smartstore.naver.com/' + value + '/category/ALL?cp=1', '_blank');
      }
      else window.open('https://smartstore.naver.com/' + value + '/category/ALL?cp=1', '_blank');
    }
  }
);