import React from 'react';
import moment from 'moment-timezone';
import XLSX from 'xlsx';
import ReactApexChart from "react-apexcharts";

import { Button, Layout, Modal, Table, Spin, message } from 'antd';
import { observer } from "mobx-react";
import { AppContext } from "../../AppContext";
import { LoadingOutlined, QuestionOutlined } from '@ant-design/icons';

var FileSaver: any = require('file-saver');

export const Statistics = observer(
  function () {
    const { marketStore } = React.useContext(AppContext);

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          스토어 통계
        </Button>

        &nbsp;

        <Button type="default" size="large" shape="round" onClick={convertJsonToExcel}>
          엑셀 다운로드
        </Button>

        &nbsp;

        <Button size="large" shape="circle" type="default" icon={<QuestionOutlined />} onClick={() => {
          message.info('스토어별 판매 중인 상품 수량을 파악할 수 있습니다.')
        }} />

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          {nullArrayChecker(marketStore.data.slice()) ? <Spin tip="데이터 로드 중..." indicator={<LoadingOutlined />} spinning={true} /> : <Table size={'small'} pagination={false} style={{whiteSpace: 'pre'}} showSorterTooltip={false} columns={marketStore.attribute.slice()} dataSource={marketStore.data.slice()} />}

          <Modal title={marketStore.record.shop + " - " + marketStore.record.shopname} visible={marketStore.visiblebar} centered width={1000} onOk={handleBarClose} onCancel={handleBarClose} footer={false}>
            <div>
              <Button type="primary" className="1" onClick={onClickWeekly}>주</Button> 
              
              &nbsp; 
              
              <Button type="primary" className="2" onClick={onClickMonthly}>월</Button> 
              
              &nbsp; 
              
              <Button type="primary" className="3" onClick={onClickYearly}>년</Button>
            </div>

            <Spin tip="차트를 생성하는 중입니다..." indicator={<LoadingOutlined />} spinning={marketStore.loadingchart}>
              <ReactApexChart options={marketStore.optionsline} series={marketStore.seriesline.slice()} type={"bar"}/>
            </Spin>
          </Modal>

          <Modal title={marketStore.record.shop + " - " + marketStore.record.shopname} visible={marketStore.visibleline} centered width={1000} onOk={handleLineClose} onCancel={handleLineClose} footer={false}>
            <div>
              <Button type="primary" className="1" onClick={onClickWeekly}>주</Button> 
              
              &nbsp; 
              
              <Button type="primary" className="2" onClick={onClickMonthly}>월</Button> 
              
              &nbsp; 
              
              <Button type="primary" className="3" onClick={onClickYearly}>년</Button>
            </div>

            <Spin tip="차트를 생성하는 중입니다..." indicator={<LoadingOutlined />} spinning={marketStore.loadingchart}>
              <ReactApexChart options={marketStore.optionsline} series={marketStore.seriesline.slice()} type={"line"}/>
            </Spin>
          </Modal>
        </Layout>
      </div>
    );

    function nullArrayChecker(output: any) {
      if(output != null && typeof output === "object" && !Object.keys(output).length)
        return true;
      else
        return false;
    }

    function handleBarClose(e: any) {
      marketStore.enableBarChartModal(false);
    }

    function handleLineClose(e: any) {
      marketStore.enableLineChartModal(false);
    }

    function onClickWeekly(e: any) {
      marketStore.enableLoadingChart(true);
      marketStore.updateChartData("1", marketStore.record.unique);
    }

    function onClickMonthly(e: any) {
      marketStore.enableLoadingChart(true);
      marketStore.updateChartData("2", marketStore.record.unique);
    }

    function onClickYearly(e: any) {
      marketStore.enableLoadingChart(true);
      marketStore.updateChartData("3", marketStore.record.unique);
    }

    function stringToArrayBuffer(s: any) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);

      for (var i=0; i<s.length; i++) 
        view[i] = s.charCodeAt(i) & 0xFF;

      return buf;    
    }

    function convertJsonToExcel() {
      moment.tz.setDefault("Asia/Seoul");

      var wb = XLSX.utils.book_new();
      var newWorksheet = XLSX.utils.json_to_sheet(marketStore.datatemp.slice());
      
      XLSX.utils.book_append_sheet(wb, newWorksheet, 'Json Test Sheet');

      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
      var date = moment().format('YYMMDD');

      FileSaver.saveAs(new Blob([stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), 'kooza_store_list_' + date + '.xlsx');

      message.info('다운로드를 시작합니다. (kooza_store_list_' + date + '.xlsx)');
    }
  }
);

export default Statistics;