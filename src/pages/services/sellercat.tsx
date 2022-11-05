import React from 'react';

import moment from 'moment-timezone';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Dropdown, Form, Input, Layout, Menu, Modal, Select, Spin, Table, message, Typography } from "antd";
import { DownOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
};

const validateMessages = {
  required: '필수 항목입니다.'
};

var inputdata = ""

var inputType: string = "1";
var databaseType: string = "all";

export const SellerCat = observer(
  function () {
    const { catStore } = React.useContext(AppContext);

    const [ formAdd ] = Form.useForm();
    const [ formEdit] = Form.useForm();
    const [ formDelete ] = Form.useForm();

    setEditFormValues(formEdit);
    setDeleteFormValues(formDelete);

    function onChange(e: any) {
      inputdata = e.target.value;
    }

    function onSearch(value: any) {
      if(value !== null && value !== '' && value.replaceAll(' ', '').length !== 0){           
        catStore.initData();
        catStore.enableLoading(true);
        catStore.filterListsBy(databaseType, inputType, value.toLowerCase());
      } 
      else {
        catStore.enableLoading(true);
        catStore.getUserData(databaseType);
      }
    }

    function handleDatabase(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      catStore.changeDatabaseDropdown(e.key);

      switch(e.key) {
        case '전체': {
          databaseType = 'all';
    
          break;
        }
    
        case '체험판': {
          databaseType = 'demo';
    
          break;
        }

        case '프로모션': {
          databaseType = 'promotion';
    
          break;
        }
    
        case '정식판': {
          databaseType = 'full';
    
          break;
        }

        default: break;
      }
    }

    function handleType(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      catStore.changeTypeDropdown(e.key);
    
      switch(e.key) {
        case '전체': {
          inputType = '0';
    
          break;
        }

        case '아이디': {
          inputType = '1';
    
          break;
        }
    
        case '쇼핑몰': {
          inputType = '2';
    
          break;
        }

        case '인증키': {
          inputType = '3';
    
          break;
        }
    
        default: break;
      }
    }

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          셀러캣 회원 관리
        </Button>

        &nbsp;

        <Button type="default" size="large" shape="round" onClick={() => {
          if (catStore.administration) {
            catStore.enableNewModal(true);
          } else {
            message.warning('관리자 모드에서만 사용할 수 있습니다.')
          }
        }}>
          새 정품 인증 키 생성
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
                    <Menu.Item key="체험판">체험판</Menu.Item>
                    <Menu.Item key="프로모션">프로모션</Menu.Item>
                    <Menu.Item key="정식판">정식판</Menu.Item>
                  </Menu>
                }>

                {catStore.dropdowndatabase}

                </Dropdown.Button>
              </td>

              <td>
                <Dropdown.Button size="large" icon={<DownOutlined />} overlay={
                  <Menu onClick={handleType}>
                    <Menu.Item key="아이디">아이디</Menu.Item>
                    <Menu.Item key="쇼핑몰">쇼핑몰</Menu.Item>
                    <Menu.Item key="인증키">인증키</Menu.Item>
                  </Menu>
                }>

                {catStore.dropdowntype}

                </Dropdown.Button>
              </td>

              <td>
                <Input
                  size="large"
                  placeholder="아이디, 쇼핑몰, 인증키 입력"
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
          
          <br></br>
          <br></br>
          <br></br>

          {nullArrayChecker(catStore.data.slice()) ? <Spin tip="회원 정보 로드 중..." indicator={<LoadingOutlined />} spinning={catStore.enableloading} /> : <Table size="small" pagination={{pageSize: 50}} columns={catStore.attribute.slice()} dataSource={catStore.data.slice()} />}

          <Modal title={"새 정품 인증 키 생성"} visible={catStore.visiblenew} centered width={450} onOk={handleNewClose} onCancel={handleNewClose} footer={false}>
            <Form form={formAdd} size="small" {...layout} name="nest-messages" onFinish={onAddFinish} validateMessages={validateMessages}>
              <Form.Item name='servicerank' label="서비스 타입" rules={[{ required: true }]}>
                <Select onChange={changeAddCombo} defaultValue="선택">
                  <Select.Option value="demo">체험판</Select.Option>
                  <Select.Option value="promotion">프로모션</Select.Option>
                  <Select.Option value="full">정식판</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name='limit' label="서비스 유효기간" rules={[{ required: true }]}>
                <Input placeholder="예) 2021-06-25 (무제한 적용 시 '0')"/>
              </Form.Item>

              <br></br>

              <Form.Item wrapperCol={{ offset: 9 }}>
                <Button type="primary" htmlType="submit">
                  생성
                </Button>

                &nbsp;

                <Button type="default" onClick={handleNewClose}>
                  취소
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal title={"계정 정보 수정"} visible={catStore.visibleedit} centered width={450} onOk={handleEditClose} onCancel={handleEditClose} footer={false}>
            <Spin tip="저장 중..." indicator={<LoadingOutlined />} spinning={catStore.loadingedit}>
              <Form.Item wrapperCol={{ offset: 2 }}>
                <Text type="danger">
                  ※ 서비스 타입을 선택하면 맞춤 값으로 자동 세팅됩니다.
                </Text>
              </Form.Item>

              <Form form={formEdit} size="small" {...layout} name="nest-messages" onFinish={onEditFinish} validateMessages={validateMessages}>
                <Form.Item name='rank' label="서비스 타입" rules={[{ required: true }]}>
                  <Select onChange={changeEditCombo}>
                    <Select.Option value="demo">체험판</Select.Option>
                    <Select.Option value="promotion">프로모션</Select.Option>
                    <Select.Option value="full">정식판</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name='serial' label="인증 키 일련번호">
                  {catStore.record.serial}
                </Form.Item>

                <Form.Item name='shop' label="쇼핑몰 구분" rules={[{ required: true }]}>
                  <Select onChange={changeEditCombo}>
                    <Select.Option value="taobao">타오바오</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name='userid' label="쇼핑몰 아이디" rules={[{ required: true }]}>
                  <Input/> 
                </Form.Item>

                <Form.Item name='expiration' label="서비스 유효기간" rules={[{ required: true }]}>
                  <Input/> 
                </Form.Item>

                <br />

                <Form.Item wrapperCol={{ offset: 2 }}>     
                  <Button size="large" onClick={onClickBasic}>
                    유효기간 7일 연장
                  </Button>

                  &nbsp;

                  <Button size="large" onClick={onClickPremium}>
                    유효기간 1개월 연장
                  </Button>
                </Form.Item>

                <br></br>

                <Form.Item wrapperCol={{ offset: 9 }}>
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

          <Modal title={"계정 삭제"} visible={catStore.visibledelete} centered width={450} onOk={handleDeleteClose} onCancel={handleDeleteClose} footer={false}>
            <Spin tip="삭제 중..." indicator={<LoadingOutlined />} spinning={catStore.loadingdelete}>
              <Form form={formDelete} size="small" {...layout} name="nest-messages" onFinish={onDeleteFinish} validateMessages={validateMessages}>
                <Form.Item name='serial' label="인증 키 일련번호">
                  {catStore.record.serial}
                </Form.Item>

                <Form.Item name='password' label="비밀번호">
                  <Input type="password"/>
                </Form.Item>

                <br></br>

                <Form.Item wrapperCol={{ offset: 9 }}>
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
        </Layout>
      </div>
    );

    function onAddFinish(values: any) {
      catStore.insertUserData(values)
    }

    function onEditFinish(values: any) {
      values.serial = catStore.record.serial;

      catStore.enableLoadingEdit(true);
      catStore.updateData(values);
    }

    function onDeleteFinish(values: any) {
      if(values.password === 'sitezero1*')
      {
        console.log(catStore.record);

        values.serial = catStore.record.serial;
        
        catStore.enableLoadingDelete(true);
        catStore.deleteData(values);
      } else {
        message.error('비밀번호가 틀렸습니다.');
      }
    }

    function onClickBasic(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var basic = moment().add(7, 'd').format('YYYY-MM-DD');

      var limit = formEdit.getFieldValue('expiration');

      if (limit === 0) {
        formEdit.setFieldsValue({'expiration': basic});
      }
      else {
        var newlimit = moment(limit).add(7, 'd').format('YYYY-MM-DD');

        formEdit.setFieldsValue({'expiration': newlimit});
      }
    }

    function onClickPremium(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      var limit = formEdit.getFieldValue('expiration');

      if (limit === 0) {
        formEdit.setFieldsValue({'expiration': premium});
      }
      else {
        var newlimit = moment(limit).add(1, 'M').format('YYYY-MM-DD');

        formEdit.setFieldsValue({'expiration': newlimit});
      }
    }

    function changeAddCombo(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var basic = moment().add(7, 'd').format('YYYY-MM-DD');
      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      if (e === "demo") {
        formAdd.setFieldsValue({'limit': basic});
      }

      if (e === "promotion") {
        formAdd.setFieldsValue({'limit': premium});
      }

      if (e === "full") {
        formAdd.setFieldsValue({'limit': premium});
      }
    }

    function changeEditCombo(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var basic = moment().add(7, 'd').format('YYYY-MM-DD');
      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      if (e === "demo") {
        formEdit.setFieldsValue({'expiration': basic});
      }

      if (e === "promotion") {
        formEdit.setFieldsValue({'expiration': premium});
      }

      if (e === "full") {
        formEdit.setFieldsValue({'expiration': premium});
      }
    }

    function setEditFormValues(formData: any) {
      formData.setFieldsValue({'rank': "선택"});
      formData.setFieldsValue({'serial': catStore.record.serial});
      formData.setFieldsValue({'shop': catStore.record.shop});
      formData.setFieldsValue({'userid': catStore.record.userid});
      formData.setFieldsValue({'expiration': catStore.record.expiration});
    }

    function setDeleteFormValues(formData: any) {
      formData.setFieldsValue({'password': ""});
    }

    function handleNewClose(e: any) {
      catStore.enableNewModal(false);
    }

    function handleEditClose(e: any) {
      catStore.enableEditModal(false);
    }

    function handleDeleteClose(e: any) {
      catStore.enableDeleteModal(false);
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