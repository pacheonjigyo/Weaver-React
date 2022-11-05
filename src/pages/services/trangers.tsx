import React from 'react';

import moment from 'moment-timezone';

import { observer } from 'mobx-react';
import { AppContext } from "../../AppContext";
import { Button, Dropdown, Form, Input, Layout, Menu, Modal, Select, Spin, Table, message, Typography } from "antd";
import { DownOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const validateMessages = {
  required: '필수 항목입니다.'
};

var inputdata = ""

var inputType: string = "1";
var databaseType: string = "all";

export const Trangers = observer(
  function () {
    const { tranStore } = React.useContext(AppContext);

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
        tranStore.initData();
        tranStore.enableLoading(true);
        tranStore.filterListsBy(databaseType, inputType, value.toLowerCase());
      } 
      else {
        tranStore.enableLoading(true);
        tranStore.getUserData(databaseType);
      }
    }

    function handleDatabase(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      tranStore.changeDatabaseDropdown(e.key);

      switch(e.key) {
        case '전체': {
          databaseType = 'all';
    
          break;
        }
    
        case '체험판': {
          databaseType = 'exp';
    
          break;
        }
    
        case '정식판': {
          databaseType = 'ful';
    
          break;
        }

        case '프로모션': {
          databaseType = 'pro';
    
          break;
        }
    
        default: break;
      }
    }

    function handleType(e: any) {
      message.info(e.key + '을(를) 선택하였습니다.');
        
      tranStore.changeTypeDropdown(e.key);
    
      switch(e.key) {
        case '전체': {
          inputType = '0';
    
          break;
        }
    
        case '아이디': {
          inputType = '1';
    
          break;
        }
    
        case '이름': {
          inputType = '2';
    
          break;
        }
    
        default: break;
      }
    }

    return (
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          트랜져스 회원 관리
        </Button>

        &nbsp;

        <Button type="default" size="large" shape="round" onClick={() => {
          if (tranStore.administration) {
            tranStore.enableNewModal(true);
          } else {
            message.warning('관리자 모드에서만 사용할 수 있습니다.')
          }
        }}>
          새 계정 만들기
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
                    <Menu.Item key="정식판">정식판</Menu.Item>
                    <Menu.Item key="프로모션">프로모션</Menu.Item>
                  </Menu>
                }>

                {tranStore.dropdowndatabase}

                </Dropdown.Button>
              </td>

              <td>
                <Dropdown.Button size="large" icon={<DownOutlined />} overlay={
                  <Menu onClick={handleType}>
                    <Menu.Item key="아이디">아이디</Menu.Item>
                    <Menu.Item key="이름">이름</Menu.Item>
                  </Menu>
                }>

                {tranStore.dropdowntype}

                </Dropdown.Button>
              </td>

              <td>
                <Input
                  size="large"
                  placeholder="아이디, 이름 입력"
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

          {nullArrayChecker(tranStore.data.slice()) ? <Spin tip="회원 정보 로드 중..." indicator={<LoadingOutlined />} spinning={tranStore.enableloading} /> : <Table size="small" pagination={{pageSize: 50}} columns={tranStore.attribute.slice()} dataSource={tranStore.data.slice()} />}

          <Modal title={"새 계정 만들기"} visible={tranStore.visiblenew} centered width={700} onOk={handleNewClose} onCancel={handleNewClose} footer={false}>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Text type="danger">
                ※ 서비스 타입을 선택하면 맞춤 값으로 자동 세팅됩니다.
              </Text>
            </Form.Item>

            <Form form={formAdd} size="small" {...layout} name="nest-messages" onFinish={onAddFinish} validateMessages={validateMessages}>
              <Form.Item name='servicerank' label="서비스 타입" rules={[{ required: true }]}>
                <Select onChange={changeAddCombo} defaultValue="선택">
                  <Select.Option value="basic">체험판</Select.Option>
                  <Select.Option value="pro">프로모션</Select.Option>
                  <Select.Option value="premium">정식판</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name='name' label="이름">
                <Input placeholder="예) 김쿠자"/>
              </Form.Item>

              <Form.Item name='_id' label="계정 아이디" rules={[{ required: true }]}>
                <Input/>
              </Form.Item>
              
              <Form.Item name='password' label="계정 비밀번호" rules={[{ required: true }]}>
                <Input/> 
              </Form.Item>

              <Form.Item name='create' label="서비스 이용 시작일">
                <Input placeholder="예) 2021-06-18"/>
              </Form.Item>

              <Form.Item name='limit' label="서비스 유효기간" rules={[{ required: true }]}>
                <Input placeholder="예) 2021-06-25 (무제한 적용 시 '0' 입력)"/>
              </Form.Item>

              <Form.Item name='credit' label="남은 이미지 수" rules={[{ required: true }]}>
                <Input placeholder="예) 2000"/>
              </Form.Item>

              <br></br>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                <Button type="primary" htmlType="submit">
                  저장
                </Button>

                &nbsp;

                <Button type="default" onClick={handleNewClose}>
                  취소
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal title={"계정 정보 수정"} visible={tranStore.visibleedit} centered width={700} onOk={handleEditClose} onCancel={handleEditClose} footer={false}>
            <Spin tip="저장 중..." indicator={<LoadingOutlined />} spinning={tranStore.loadingedit}>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Text type="danger">
                  ※ 서비스 타입을 선택하면 맞춤 값으로 자동 세팅됩니다.
                </Text>
              </Form.Item>

              <Form form={formEdit} size="small" {...layout} name="nest-messages" onFinish={onEditFinish} validateMessages={validateMessages}>
                <Form.Item name='servicerank' label="서비스 타입" rules={[{ required: true }]}>
                  <Select onChange={changeEditCombo}>
                    <Select.Option value="basic">체험판</Select.Option>
                    <Select.Option value="pro">프로모션</Select.Option>
                    <Select.Option value="premium">정식판</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name='name' label="이름">
                  <Input />
                </Form.Item>

                <Form.Item name='id' label="계정 아이디">
                  {tranStore.record.userid}
                </Form.Item>

                <Form.Item name='password' label="계정 비밀번호" rules={[{ required: true }]}>
                  <Input/>
                </Form.Item>
                
                <Form.Item name='create' label="서비스 이용 시작일">
                  <Input/>
                </Form.Item>

                <Form.Item name='limit' label="서비스 유효기간" rules={[{ required: true }]}>
                  <Input/> 
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>     
                
                  <Text type="secondary">
                    ※ 0으로 표기되어 있는 경우, 오늘 날짜를 기준으로 계산됩니다.
                  </Text>  

                  <br></br>
                  <br></br>

                  &nbsp;
                  &nbsp;
                  &nbsp;
                  
                  <Button size="large" onClick={onClickBasic}>
                    유효기간 7일 연장
                  </Button>

                  &nbsp;

                  <Button size="large" onClick={onClickPremium}>
                    유효기간 1개월 연장
                  </Button>
                </Form.Item>

                <Form.Item name='credit' label="남은 이미지 수" rules={[{ required: true }]}>
                <Input/>
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

          <Modal title={"계정 삭제"} visible={tranStore.visibledelete} centered width={700} onOk={handleDeleteClose} onCancel={handleDeleteClose} footer={false}>
            <Spin tip="삭제 중..." indicator={<LoadingOutlined />} spinning={tranStore.loadingdelete}>
              <Form form={formDelete} size="small" {...layout} name="nest-messages" onFinish={onDeleteFinish} validateMessages={validateMessages}>
                <Form.Item name='userid' label="계정 아이디">
                  {tranStore.record.userid}
                </Form.Item>

                <Form.Item name='password' label="비밀번호">
                  <Input type="password"/>
                </Form.Item>

                <br></br>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
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
      if (values.name === undefined)
        values.name = ""

      if (values.create === undefined)
        values.create = ""

      tranStore.insertUserData(values)
    }

    function onClickBasic(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var basic = moment().add(7, 'd').format('YYYY-MM-DD');

      var limit = formEdit.getFieldValue('limit');

      if (limit === 0) {
        formEdit.setFieldsValue({'limit': basic});
      }
      else {
        var newlimit = moment(limit).add(7, 'd').format('YYYY-MM-DD');

        formEdit.setFieldsValue({'limit': newlimit});
      }
    }

    function onClickPremium(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      var limit = formEdit.getFieldValue('limit');

      if (limit === 0) {
        formEdit.setFieldsValue({'limit': premium});
      }
      else {
        var newlimit = moment(limit).add(1, 'M').format('YYYY-MM-DD');

        formEdit.setFieldsValue({'limit': newlimit});
      }
    }

    function changeAddCombo(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var today = moment().format('YYYY-MM-DD');
      var basic = moment().add(7, 'd').format('YYYY-MM-DD');
      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      if (e === "basic") {
        formAdd.setFieldsValue({'limit': basic});
        formAdd.setFieldsValue({'create': today});
        formAdd.setFieldsValue({'credit': 2000});
      }

      if (e === "pro") {
        formAdd.setFieldsValue({'limit': 0});
        formAdd.setFieldsValue({'create': today});
        formAdd.setFieldsValue({'credit': 1000000});
      }

      if (e === "premium") {
        formAdd.setFieldsValue({'limit': premium});
        formAdd.setFieldsValue({'create': today});
        formAdd.setFieldsValue({'credit': 0});
      }
    }

    function changeEditCombo(e: any) {
      moment.tz.setDefault("Asia/Seoul");

      var today = moment().format('YYYY-MM-DD');
      var basic = moment().add(7, 'd').format('YYYY-MM-DD');
      var premium = moment().add(1, 'M').format('YYYY-MM-DD');

      if (e === "basic") {
        formEdit.setFieldsValue({'limit': basic});
        formEdit.setFieldsValue({'create': today});
        formEdit.setFieldsValue({'credit': 2000});
      }

      if (e === "pro") {
        formEdit.setFieldsValue({'limit': 0});
        formEdit.setFieldsValue({'create': today});
        formEdit.setFieldsValue({'credit': 1000000});
      }

      if (e === "premium") {
        formEdit.setFieldsValue({'limit': premium});
        formEdit.setFieldsValue({'create': today});
        formEdit.setFieldsValue({'credit': 0});
      }
    }

    function setEditFormValues(formData: any) {
      formData.setFieldsValue({'servicetype': tranStore.record.index});
      // formData.setFieldsValue({'servicerank': tranStore.record.rank});
      formData.setFieldsValue({'servicerank': "선택"});
      formData.setFieldsValue({'name': tranStore.record.name});
      formData.setFieldsValue({'email': tranStore.record.email});
      formData.setFieldsValue({'password': tranStore.record.userpw});
      formData.setFieldsValue({'limit': tranStore.record.limit});
      formData.setFieldsValue({'create': tranStore.record.create});
      formData.setFieldsValue({'credit': tranStore.record.credit});
    }

    function setDeleteFormValues(formData: any) {
      formData.setFieldsValue({'password': ""});
    }

    function onEditFinish(values: any) {
      values._id = tranStore.record.userid;

      if (values.name === undefined)
        values.name = ""

      if (values.create === undefined)
        values.create = ""

      tranStore.enableLoadingEdit(true);
      tranStore.updateData(values);
    }

    function onDeleteFinish(values: any) {
      values._id = tranStore.record.key;

      if(values.password === 'sitezero1*')
      {
        tranStore.enableLoadingDelete(true);
        tranStore.deleteData(values);
      }
      else
        message.error('비밀번호가 틀렸습니다.');
    }

    function handleNewClose(e: any) {
      tranStore.enableNewModal(false);
    }

    function handleEditClose(e: any) {
      tranStore.enableEditModal(false);
    }

    function handleDeleteClose(e: any) {
      tranStore.enableDeleteModal(false);
    }

    function nullArrayChecker(output: any) {
        if(output != null && typeof output === "object" && !Object.keys(output).length)
            return true;
        else
            return false;
    }
  }
);