import React from 'react';
import moment from 'moment-timezone';
import XLSX from 'xlsx';

import { observer } from "mobx-react";
import { AppContext } from "../../AppContext";
import { Button, DatePicker, Dropdown, Form, Input, Layout, Menu, Modal, Table, message, Spin } from "antd";
import { DownOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';

var inputType: string = "1", databaseType: string = "all";
var dateStart: any = null, dateEnd: any = null;
var FileSaver: any = require('file-saver');

var inputData: string = "";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const validateMessages = {
  required: '필수 항목입니다.'
};

export const Lookups = observer(
  function() {
    const { itemStore } = React.useContext(AppContext);

    const [ formEdit ] = Form.useForm();
    const [ formDelete ] = Form.useForm();

    setEditFormValues(formEdit);
    setDeleteFormValues(formDelete);

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          상품 검색/관리
        </Button>

        &nbsp;

        <Button size="large" shape="round" type="default" onClick={onConvertExcel}>
          엑셀 다운로드
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
                    <Menu.Item key="EM35">EM35</Menu.Item>
                    <Menu.Item key="ORANGE">ORANGE</Menu.Item>
                  </Menu>
                }>

                {itemStore.dropdowndatabase}

                </Dropdown.Button>
              </td>

              <td>
                <Dropdown.Button size="large" icon={<DownOutlined />} overlay={
                  <Menu onClick={handleType}>
                    <Menu.Item key="상품코드">상품코드</Menu.Item>
                    <Menu.Item key="상품명">상품명</Menu.Item>
                    <Menu.Item key="등록날짜">등록날짜</Menu.Item>
                  </Menu>
                }>

                {itemStore.dropdowntype}

                </Dropdown.Button>
              </td>

              {itemStore.dropdowntype !== "등록날짜" ? 
                <td>
                  <Input
                    size="large"
                    placeholder="상품코드, 상품명 입력"
                    onChange={(e) => {onChange(e)}}
                    onPressEnter={() => onSearch(inputData)}
                    style={{width: 300}}
                  /> 
                </td>
                  :
                <div>
                  <td>
                    <DatePicker size="large" placeholder="시작 날짜 입력" onChange={onDateStart} style={{width: 150}}/>
                  </td>

                  <td>
                    <DatePicker size="large" placeholder="종료 날짜 입력" onChange={onDateEnd} style={{width: 150}}/>
                  </td>
                </div>
              }
                
              <td>
                <Button type="default" size="large" icon={<SearchOutlined />} onClick={() => onSearch(inputData)} style={{width: 50, borderTopRightRadius: 20, borderBottomRightRadius: 20}} />
              </td>
            </tr>
          </table>

          <br></br>
          <br></br>
          <br></br>

          {nullArrayChecker(itemStore.data.slice()) ? <Spin tip="상품 정보 로드 중..." indicator={<LoadingOutlined />} spinning={itemStore.enableloading} /> : <Table bordered size="small" columns={itemStore.attribute.slice()} dataSource={itemStore.data.slice()} />}
        </Layout>

        <Modal title="상품 수정" visible={itemStore.enableedit} centered width={500} onOk={handleEditClose} onCancel={handleEditClose} footer={false}>
          <Spin tip="저장 중..." indicator={<LoadingOutlined />} spinning={itemStore.loadingedit}>
            <Form form={formEdit} size="small" {...layout} name="nest-messages" onFinish={onEditFinish} validateMessages={validateMessages}>
              <Form.Item name='number' label="고유번호">
                <Input/>
              </Form.Item>

              <Form.Item name='codelocal' label="상품코드">
                {itemStore.record.codelocal}
              </Form.Item>

              <Form.Item name='codeglobal' label="해외상품코드">
                <Input/>
              </Form.Item>

              <Form.Item name='shop' label="쇼핑몰" rules={[{ required: true }]}>
                <Input/>
              </Form.Item>

              <Form.Item name='image' label="이미지 URL" rules={[{ required: true }]}>
                <Input.TextArea/>
              </Form.Item>
              
              <Form.Item name='name' label="상품명" rules={[{ required: true }]}>
                <Input.TextArea/> 
              </Form.Item>
                
              <Form.Item name='urlorigin' label="상품 URL" rules={[{ required: true }]}>
                <Input.TextArea/>
              </Form.Item>

              <Form.Item name='pricedollarlist' label="정가">
              <Input/>
              </Form.Item>

              <Form.Item name='pricedollar' label="판매가">
              <Input/>
              </Form.Item>

              <Form.Item name='pricewonlist' label="원화정가">
                <Input/>
              </Form.Item>

              <Form.Item name='pricewon' label="원화판매가">
                <Input/>
              </Form.Item>

              <Form.Item name='date' label="등록일">
                <Input type="date"/>
              </Form.Item>

              <br></br>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                <Button type="primary" htmlType="submit">
                  저장
                </Button>

                &nbsp;

                <Button type="default" onClick={handleEditClose}>
                  취소
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>

        <Modal title="상품 삭제" visible={itemStore.enabledelete} centered width={400} onOk={handleDeleteClose} onCancel={handleDeleteClose} footer={false}>
          <Spin tip="삭제 중..." indicator={<LoadingOutlined />} spinning={itemStore.loadingdelete}>
            <Form form={formDelete} size="small" {...layout} name="nest-messages" onFinish={onDeleteFinish} validateMessages={validateMessages}>
              <Form.Item name='codelocal' label="상품코드">
                {itemStore.record.codelocal}
              </Form.Item>

              <Form.Item name='password' label="비밀번호">
                <Input type="password"/>
              </Form.Item>

              <br></br>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
                <Button type="primary" htmlType="submit">
                  삭제
                </Button>

                &nbsp;

                <Button type="default" onClick={handleDeleteClose}>
                  취소
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </div>
    );

    function setEditFormValues(formData: any) {
      formData.setFieldsValue({'number': itemStore.record.number});
      formData.setFieldsValue({'codeglobal': itemStore.record.codeglobal});
      formData.setFieldsValue({'shop': itemStore.record.shop});
      formData.setFieldsValue({'image': itemStore.record.image});
      formData.setFieldsValue({'name': itemStore.record.name});
      formData.setFieldsValue({'urlorigin': itemStore.record.urlorigin});
      formData.setFieldsValue({'pricedollarlist': itemStore.record.pricedollarlist});
      formData.setFieldsValue({'pricedollar': itemStore.record.pricedollar});
      formData.setFieldsValue({'pricewonlist': itemStore.record.pricewonlist});
      formData.setFieldsValue({'pricewon': itemStore.record.pricewon});
      formData.setFieldsValue({'date': itemStore.record.date.replaceAll('.', '-')});
    }

    function setDeleteFormValues(formData: any) {
      formData.setFieldsValue({'password': ''});
    }

    function handleEditClose() {
      itemStore.enableEditModal(false);
    }

    function handleDeleteClose() {
      itemStore.enableDeleteModal(false);
    }

    function onEditFinish(values: any) {
      values.codelocal = itemStore.record.codelocal;
      values.date = values.date.replaceAll('-', '.');

      itemStore.enableLoadingEdit(true);
      itemStore.updateData(values);
    }
    
    function onDeleteFinish(values: any) {
      values.codelocal = itemStore.record.codelocal;

      if(values.password === 'sitezero1*')
      {
        itemStore.enableLoadingDelete(true);
        itemStore.deleteData(values);
      }
      else
        message.error('비밀번호가 틀렸습니다.');
    }

    function nullArrayChecker(output: any) {
      if(output != null && typeof output === "object" && !Object.keys(output).length)
        return true;
      else
        return false;
    }

    function handleDatabase(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      itemStore.changeDatabaseDropdown(e.key);
    
      switch(e.key) {
        case '전체': {
          databaseType = 'all';
    
          break;
        }
    
        case 'EM35': {
          databaseType = 'em35';
    
          break;
        }
    
        case 'ORANGE': {
          databaseType = 'orange';
    
          break;
        }
    
        default: break;
      }
    };
    
    function handleType(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      itemStore.changeTypeDropdown(e.key);
    
      switch(e.key) {
        case '전체': {
          inputType = '0';
    
          break;
        }
    
        case '상품코드': {
          inputType = '1';
    
          break;
        }
    
        case '상품명': {
          inputType = '2';
    
          break;
        }
    
        case '등록날짜': {
          inputType = '3';
    
          break;
        }
    
        default: break;
      }
    };
    
    function onChange(e: any) {
      inputData = e.target.value;
    }

    function onSearch(value: string) {
      switch(inputType){
        case '3': {
          if(dateStart !== null && dateEnd !== null && dateStart !== '' && dateEnd !== ''){
            itemStore.initList();
            itemStore.enableLoading(true);
            itemStore.filterListsBy(databaseType, inputType, dateStart, dateEnd);
          }
          else message.warning('날짜가 유효하지 않습니다.');

          break;
        }

        default: {
          if(value !== null && value !== ''){            
            if(value.replaceAll(' ', '').length !== 0){
              itemStore.initList();
              itemStore.enableLoading(true);
              itemStore.filterListsBy(databaseType, inputType, value.toUpperCase(), value.toUpperCase());
            }
            else message.warning('공백은 입력할 수 없습니다.');
          } 
          else message.warning('상품명 또는 상품코드가 유효하지 않습니다.');

          break;
        }
      }
    }

    function onDateStart(date: any, dateString: any) {
      dateStart = dateString.replaceAll('-', '.');
    }
    
    function onDateEnd(date: any, dateString: any) {
      dateEnd = dateString.replaceAll('-', '.');
    }
    
    function stringToArrayBuffer(s: any) { 
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);

      for (var i=0; i<s.length; i++) 
        view[i] = s.charCodeAt(i) & 0xFF;

      return buf;
    }

    function onConvertExcel() {
      if(!nullArrayChecker(itemStore.datatemp.slice()))
      {
        moment.tz.setDefault("Asia/Seoul");

        var wb = XLSX.utils.book_new();
        var newWorksheet = XLSX.utils.json_to_sheet(itemStore.datatemp.slice());
        
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Json Test Sheet');

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        var date = moment().format('YYMMDD');

        FileSaver.saveAs(new Blob([stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), 'kooza_item_list_' + date + '.xlsx');

        message.info('다운로드를 시작합니다. (kooza_item_list_' + date + '.xlsx)');
      }
      else
      {
        message.error('상품이 검색되지 않았습니다.');
      }
    }
  }
);