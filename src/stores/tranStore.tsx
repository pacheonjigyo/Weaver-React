import axios from "axios";

import { makeAutoObservable } from "mobx";
import { Button, Typography, message } from "antd";

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const option = {
  maximumFractionDigits: 4
};

export class tranStore {
  data: any = []

  attribute: any = [
    {
      title: '구분',
      dataIndex: 'index',
      key: 'index',

      align: 'center',
      width: '4%',

      sorter: {
        compare: (a: any, b: any) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '아이디',
      dataIndex: 'userid',
      key: 'userid',

      align: 'center',
      width: '8%',

      sorter: {
        compare: (a: any, b: any) => a.userid < b.userid ? -1 : a.userid > b.userid ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '비밀번호',
      dataIndex: 'userpw',
      key: 'userpw',

      align: 'center',
      width: '8%',

      sorter: {
        compare: (a: any, b: any) => a.userid < b.userid ? -1 : a.userid > b.userid ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '서비스 이용 시작일',
      dataIndex: 'create',
      key: 'create',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.create < b.create ? -1 : a.create > b.create ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '서비스 유효기간',
      dataIndex: 'limit',
      key: 'limit',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.limit < b.limit ? -1 : a.limit > b.limit ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '남은 이미지 수',
      dataIndex: 'usage',
      key: 'usage',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.credit < b.credit ? -1 : a.credit > b.credit ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '이메일주소',
      dataIndex: 'email',
      key: 'email',

      align: 'center',
      width: '12%',

      sorter: {
        compare: (a: any, b: any) => a.login < b.login ? -1 : a.login > b.login ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',

      align: 'center',
      width: '8%',

      sorter: {
        compare: (a: any, b: any) => a.login < b.login ? -1 : a.login > b.login ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '추천인코드',
      dataIndex: 'refcode',
      key: 'refcode',

      align: 'center',
      width: '8%',

      sorter: {
        compare: (a: any, b: any) => a.login < b.login ? -1 : a.login > b.login ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '적립금',
      dataIndex: 'credit',
      key: 'credit',

      align: 'center',
      width: '6%',

      sorter: {
        compare: (a: any, b: any) => a.login < b.login ? -1 : a.login > b.login ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '회원 관리',
      dataIndex: 'option',
      key: 'option',

      align: 'center',
      width: '6%',
    },
  ]

  administration = false;

  visiblenew = false;
  visibleedit = false;
  visibledelete = false;

  enableloading = false;
  loadingdelete = false;

  dropdowndatabase = "전체";
  dropdowntype = "아이디";

  record: any = {
    number: 0,
    codelocal: "-",
    codeglobal: "-",
    shop: "-",
    image: "-",
    name: "-",
    urlorigin: "-",
    pricedollarlist: 0,
    pricedollar: 0,
    pricewonlist: 0,
    pricewon: 0,
    date: "-",
    translated: "",
  };

  loadingedit = false;

  constructor() {
    makeAutoObservable(this);

    this.getUserData("all")
  }

  changeDatabaseDropdown = (e: any) => {
    this.dropdowndatabase = e;
  }

  changeTypeDropdown = (e: any) => {
    this.dropdowntype = e;
  }

  insertUserData = async(values: any) => {
    await axios.post('http://118.35.126.70:3001/api/addtrangers', {
      userid: values._id,
      userpw: values.password,
      servicerank: values.servicerank,
      credit: values.credit,
      limit: values.limit,
      name: values.name,
      create: values.create,
    })
    .then(res => res.data)
    .then(output => {
      if(output === 'OK') {
        this.getUserData("all")

        message.success('계정이 생성되었습니다.')
      } else {
        message.error('계정 생성에 실패하였습니다.')
      }

      return 0;
    })
  };

  initData = () => {
    this.data = [];
  }

  filterListsBy = async(datatype: string, inputtype: string, value: string) => {
    if(datatype !== null && inputtype !== null && value !== null) {
      await axios.post('http://118.35.126.70:3001/api/flttrangers', {
        datatype: datatype,
        inputtype: inputtype,
        value: value
      })
      .then(res => res.data)
      .then(output => {
        output.map((data: any, index: number) => {
          this.data.push({
            key: index,
            index: data['servicerank'] === "basic" ? "체험판" : data['servicerank'] === "pro" ? "프로모션" : data['servicerank'] === "premium" ? "정식판" : "미설정",
            name: data['name'] === "" ? <Text type="secondary">미등록</Text> : data['name'],
            userid: data['_id'],
            userpw: "**********",
            limit: data['limit'] === "0" ? "무제한": <Text type="danger">{data['limit']}</Text>,
            create: data['create'] === "" ? <Text type="secondary">미등록</Text> : data['create'],
            credit: data['usage'] > 999 ? data['usage'].toLocaleString('ko-KR', option) : data['usage'],
            login: data['available'] ? <Text type="secondary">오프라인</Text> : <Text type="success">온라인</Text>,
            option: <div>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => {
                if(this.administration) {
                  this.record.index = data['servicetype'];
                  this.record.rank = data['servicerank'];
                  this.record.name = data['name'];
                  this.record.email = data['email'];
                  this.record.userid = data['_id'];
                  this.record.userpw = data['password'];
                  this.record.limit = data['limit'];
                  this.record.create = data['create'];
                  this.record.credit = data['usage'];
                  this.record.login = data['available'];

                  this.visibleedit = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />

              &nbsp;

              <Button type="primary" size="small" icon={<DeleteOutlined />} onClick={() => {
                if(this.administration) {
                  this.record.userid = data['_id'];

                  this.visibledelete = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />
            </div>
          })

          return 0;
        })
      });
    
      await this.enableLoading(false);
    }
  }

  getUserData = async(datatype: string) => {
    this.initData();
    this.enableloading = true;
    
    await axios.post('http://118.35.126.70:3001/api/gettrangers', {
      datatype: datatype
    })
    .then(res => res.data)
    .then(output => {
        output.map((data: any, index: number) => {
          this.data.push({
            key: index,
            index: data['servicerank'] === "basic" ? "체험판" : data['servicerank'] === "pro" ? "프로모션" : data['servicerank'] === "premium" ? "정식판" : "미설정",
            name: data['name'] === "" ? <Text type="secondary">미등록</Text> : data['name'],
            userid: data['_id'],
            userpw: "**********",
            create: data['create'] === "" ? <Text type="secondary">미등록</Text> : data['create'],
            limit: <Text type="danger">{data['limit']}</Text>,
            usage: data['usage'],
            email: data['email'],
            phone: data['phone'],
            refcode: data['refcode'],
            credit: data['credit'],
            login: data['available'] ? <Text type="secondary">오프라인</Text> : <Text type="success">온라인</Text>,
            option: <div>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => {
                if(this.administration) {
                  this.record.rank = data['servicerank'];
                  this.record.name = data['name'];
                  this.record.userid = data['_id'];
                  this.record.userpw = data['password'];
                  this.record.create = data['create'];
                  this.record.limit = data['limit'];
                  this.record.usage = data['usage'];
                  this.record.email = data['email'];
                  this.record.phone = data['phone'];
                  this.record.refcode = data['refcode'];
                  this.record.credit = data['usage'];

                  this.visibleedit = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />

              &nbsp;

              <Button type="primary" size="small" icon={<DeleteOutlined />} onClick={() => {
                if(this.administration) {
                  this.record.userid = data['_id'];

                  this.visibledelete = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />
            </div>
          })

          return 0;
        })
    })

    this.enableloading = false;
  };

  updateData = async(values: any) => {
    await axios.post('http://118.35.126.70:3001/api/edittrangers', {
      _id: values._id,
      password: values.password,
      servicetype: values.servicetype,
      servicerank: values.servicerank,
      credit: values.credit,
      limit: values.limit,
      name: values.name,
      create: values.create
    })
    .then((res: any) => {
        if(res.status === 200) {
          this.getUserData("all")
        }
        else
          message.error('오류가 발생했습니다.');
    });

    await this.enableEditModal(false);
    await this.enableLoadingEdit(false);
  }

  deleteData = async(values: any) => {
    await axios.post('http://118.35.126.70:3001/api/deletetrangers', {
        _id: values._id
    })
    .then((res: any) => {
        if(res.status === 200) {
          this.getUserData("all")
        }
        else
            message.error('오류가 발생했습니다.');
    });

    await this.enableDeleteModal(false);
    await this.enableLoadingDelete(false);
  }

  enableLoading = (value: boolean) => {
    this.enableloading = value;
  }

  enableLoadingEdit = (value: boolean) => {
    this.loadingedit = value;
  }

  enableLoadingDelete = (value: boolean) => {
    this.loadingdelete = value;
  }

  enableNewModal(value: boolean) {
    this.visiblenew = value
  }

  enableEditModal(value: boolean) {
    this.visibleedit = value
  }

  enableDeleteModal(value: boolean) {
    this.visibledelete = value
  }

  toggleAdministration(value: boolean) {
    this.administration = value
  }
}