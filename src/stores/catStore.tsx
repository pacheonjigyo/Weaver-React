import axios from "axios";

import { makeAutoObservable } from "mobx";
import { Button, Typography, message } from "antd";

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export class catStore {
  data: any = []

  attribute: any = [
    {
      title: '서비스 구분',
      dataIndex: 'rank',
      key: 'rank',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '인증 키 일련번호',
      dataIndex: 'serial',
      key: 'serial',

      align: 'center',
      width: '50%',

      sorter: {
        compare: (a: any, b: any) => a.shop < b.shop ? -1 : a.shop > b.shop ? 1 : 0,
        multiple: 3,
      }
    },


    {
      title: '쇼핑몰 구분',
      dataIndex: 'shop',
      key: 'shop',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.shop < b.shop ? -1 : a.shop > b.shop ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '쇼핑몰 아이디',
      dataIndex: 'userid',
      key: 'userid',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.userid < b.userid ? -1 : a.userid > b.userid ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '서비스 유효기간',
      dataIndex: 'expiration',
      key: 'expiration',

      align: 'center',
      width: '10%',

      sorter: {
        compare: (a: any, b: any) => a.expiration < b.expiration ? -1 : a.expiration > b.expiration ? 1 : 0,
        multiple: 3,
      }
    },

    {
      title: '회원 관리',
      dataIndex: 'option',
      key: 'option',

      align: 'center',
      width: '10%',
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
    key: 0,
    serial: "",
    rank: "",
    shop: "",
    userid: "",
    expiration: ""
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
    await axios.post('http://118.35.126.70:3001/api/sccreatekey', {
      rank: values.servicerank,
      expiration: values.limit,
    })
    .then(res => res.data)
    .then(output => {
      if(output === 'OK') {
        this.getUserData("all")

        message.success('인증키가 생성되었습니다.')
      } else {
        message.error('인증키 생성에 실패하였습니다.')
      }

      return 0;
    })
  };

  initData = () => {
    this.data = [];
  }

  filterListsBy = async(datatype: string, inputtype: string, value: string) => {
    if(datatype !== null && inputtype !== null && value !== null) {
      await axios.post('http://118.35.126.70:3001/api/scload', {
        datatype: datatype,
        inputtype: inputtype,
        value: value
      })
      .then(res => res.data)
      .then(output => {
        output.map((data: any, index: number) => {
          this.data.push({
            key: index,
            serial: data._id,
            rank: data.rank === "demo" ? "체험판" : data.rank === "full" ? "정식판" : "프로모션",
            shop: data.shop ? data.shop : <Text type="secondary">할당되지 않음</Text>,
            userid: data.userid ? data.userid : <Text type="secondary">할당되지 않음</Text>,
            option: <div>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => {
                if(this.administration) {
                  this.record = {
                    key: index,
                    serial: data._id,
                    rank: data.rank,
                    shop: data.shop,
                    userid: data.userid,
                    expiration: data.expiration
                  };

                  this.visibleedit = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />

              &nbsp;

              <Button type="primary" size="small" icon={<DeleteOutlined />} onClick={() => {
                if(this.administration) {
                  this.record = {
                    key: index,
                    serial: data._id,
                    rank: data.rank,
                    shop: data.shop,
                    userid: data.userid,
                    expiration: data.expiration
                  };

                  this.visibledelete = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />
            </div>
          });

          return 0;
        })
      });
    
      await this.enableLoading(false);
    }
  }

  getUserData = async(datatype: string) => {
    this.initData();
    this.enableloading = true;
    
    await axios.post('http://118.35.126.70:3001/api/scloadall', {
      datatype: datatype
    })
    .then(res => res.data)
    .then(output => {
        output.map((data: any, index: number) => {
          this.data.push({
            key: index,
            serial: data._id,
            rank: data.rank === "demo" ? "체험판" : data.rank === "full" ? "정식판" : "프로모션",
            shop: data.shop ? data.shop : <Text type="secondary">할당되지 않음</Text>,
            userid: data.userid ? data.userid : <Text type="secondary">할당되지 않음</Text>,
            expiration: data.expiration ? data.expiration : <Text type="secondary">할당되지 않음</Text>,
            option: <div>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => {
                if(this.administration) {
                  this.record = {
                    key: index,
                    serial: data._id,
                    rank: data.rank,
                    shop: data.shop,
                    userid: data.userid,
                    expiration: data.expiration
                  };

                  this.visibleedit = true;
                }
                else {
                  message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />

              &nbsp;

              <Button type="primary" size="small" icon={<DeleteOutlined />} onClick={() => {
                if(this.administration) {
                  this.record = {
                    key: index,
                    serial: data._id,
                    rank: data.rank,
                    shop: data.shop,
                    userid: data.userid,
                    expiration: data.expiration
                  };

                  this.visibledelete = true;
                }
                else {
                    message.warning("관리자 모드에서만 사용할 수 있습니다.");
                }
              }} />
            </div>
          });

          return 0;
        })
    })

    this.enableloading = false;
  };

  updateData = async(values: any) => {
    await axios.post('http://118.35.126.70:3001/api/scedit', {
      _id: values.serial,
      rank: values.rank,
      shop: values.shop,
      userid: values.userid,
      expiration: values.expiration,
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
    await axios.post('http://118.35.126.70:3001/api/scdelete', {
      _id: values.serial
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