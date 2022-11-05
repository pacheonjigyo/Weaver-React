import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Col, Input, Layout, Row, message } from "antd";
import { QuestionOutlined } from '@ant-design/icons';

var code: any = "";
var url: string = "";

export const Filtering = observer(
  function () {
    const { searchStore } = React.useContext(AppContext);

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          저작권 침해 여부 검사
        </Button>

        &nbsp;

        <Button size="large" shape="circle" type="default" icon={<QuestionOutlined />} onClick={() => {
          message.info('저작권 침해가 발생할 수 있는 텍스트나 이미지 등을 식별할 수 있습니다.')
        }} />

        <br></br>
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
            <Col span={4} />
            <Col span={16}>
              <Input
                placeholder="타오바오 상품 주소 입력"
                size="large"
                style={{width: "100%", borderRadius: 20}}

                onChange={onChangeCode}
                onPressEnter={onEnterCode}
              />
            </Col>
            <Col span={4} />
          </Row>
        </Layout>
      </div>
    );

    function onChangeCode(e: any) {
      url = e.target.value;
    }

    function onEnterCode(e: any) {
      code = getParameterByName('id', url);

      searchStore.getFilterLists(code);
    }

    function getParameterByName(name: string, url: string) {
      name = name.replace(/[\]]/g, '\\$&');

      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);

      if (!results) 
        return null;

      if (!results[2]) 
        return '';

      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }
);