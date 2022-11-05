import React from 'react';

import { Button, Layout, Table, Spin, message } from 'antd';
import { observer } from "mobx-react";
import { AppContext } from "../../AppContext";
import { LoadingOutlined, QuestionOutlined } from '@ant-design/icons';

export const Progressing = observer(
  function () {
    const { marketStore } = React.useContext(AppContext);

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          스토어 진행상황
        </Button>

        &nbsp;

        <Button size="large" shape="circle" type="default" icon={<QuestionOutlined />} onClick={() => {
          message.info('스토어별 상품 처리 현황을 파악할 수 있습니다.')
        }} />

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          {nullArrayChecker(marketStore.progressdata.slice()) ? 
            <Spin tip="데이터 로드 중..." indicator={<LoadingOutlined />} spinning={true} />
              : 
            <Table size={'small'} pagination={false} style={{whiteSpace: 'pre'}} showSorterTooltip={false} columns={marketStore.progressattribute} dataSource={marketStore.progressdata.slice()} />
          }
        </Layout>
      </div>
    );

    function nullArrayChecker(output: any) {
      if(output != null && typeof output === "object" && !Object.keys(output).length)
        return true;
      else
        return false;
    }
  }
);