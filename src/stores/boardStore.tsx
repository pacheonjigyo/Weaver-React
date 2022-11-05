import axios from 'axios';
import moment from 'moment-timezone';

import { Button, Image, Typography, message } from "antd";
import { makeAutoObservable } from "mobx";

const { Text } = Typography;

export class boardStore {
    attribute: any = [{
        title: '순번',

        dataIndex: 'key',
        key: 'key',

        align: 'center',
        width: '4%',

        sorter: {
            compare: (a: any, b: any) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
            multiple: 3,
        },
    },
    {
        title: '결제구분',

        dataIndex: 'payType',
        key: 'payType',

        align: 'center',
        width: '8%'
    },
    {
        title: '서비스명',

        dataIndex: 'title',
        key: 'title',

        align: 'center',
        width: '10%'
    },
    {
        title: '이용기간',

        dataIndex: 'servicetype',
        key: 'servicetype',

        align: 'center',
        width: '8%'
    },

    {
        title: '이름',

        dataIndex: 'name',
        key: 'name',

        align: 'center',
        width: '8%'
    },
    {
        title: '전화번호',

        dataIndex: 'phone',
        key: 'phone',

        align: 'center',
        width: '8%'
    },
    {
        title: '사업자등록증',

        dataIndex: 'company',
        key: 'company',

        align: 'center',
        width: '8%'
    },
    {
        title: '아이디',

        dataIndex: 'email',
        key: 'email',

        align: 'center',
        width: '10%'
    },
    {
        title: '포인트사용금액',

        dataIndex: 'description',
        key: 'description',

        align: 'center',
        width: '8%',

        sorter: {
            compare: (a: any, b: any) => a.description < b.description ? -1 : a.description > b.description ? 1 : 0,
            multiple: 3,
        },
    },
    {
        title: '추천인ID',

        dataIndex: 'refCode',
        key: 'refCode',

        align: 'center',
        width: '10%',

        sorter: {
            compare: (a: any, b: any) => a.refCode < b.refCode ? -1 : a.refCode > b.refCode ? 1 : 0,
            multiple: 3,
        },
    },
    {
        title: '등록일',

        dataIndex: 'moment',
        key: 'moment',

        align: 'center',
        width: '10%',

        sorter: {
            compare: (a: any, b: any) => a.moment < b.moment ? -1 : a.moment > b.moment ? 1 : 0,
            multiple: 3,
        },
    },
    {
        title: '상태',

        dataIndex: 'process',
        key: 'process',

        align: 'center',
        width: '8%'
    }];

    administration = false;

    dropdowndatabase = "전체";
    dropdowntype = "이메일";

    enableloading = false;

    backend: any = "...";
    crawller: any = "...";

    data: any = [];
    database: any = "...";

    constructor() {
        makeAutoObservable(this);

        this.getServerState();
        this.showQuery();
    }

    initList() {
        this.data = [];
    }

    changeDatabaseDropdown = (e: any) => {
        this.dropdowndatabase = e;
    }

    changeTypeDropdown = (e: any) => {
        this.dropdowntype = e;
    }

    enableLoading = (value: boolean) => {
        this.enableloading = value;
    }

    filterListsBy = async(datatype: number, inputtype: number, value: string) => {
        if(inputtype !== null && value !== null) {
            await axios.post('http://118.35.126.70:3001/api/sfyload', {
            datatype: datatype,
            inputtype: inputtype,
            value: value
            })
            .then(res => res.data)
            .then(output => {
                output.map((data: any, index: number) => {
                    var temp = moment(data.moment).format('YYYY-MM-DD HH:mm:ss');
                    var process = data.comment ? 
                        <div>
                            <Button size="small" onClick={() => {
                                var record = {
                                    key: data.key,
                                    comment: ""
                                };

                                this.addComment(record);
                            }}>
                                승인완료
                            </Button>
                        </div>
                    :
                        <div>
                            <Button size="small" type="primary" onClick={() => {
                                var record = {
                                    key: data.key,
                                    comment: "승인완료"
                                };

                                this.addComment(record);
                            }}>
                                {data.payType && data.payType === "CARD" ? "결제완료" : "입금확인중"}
                            </Button>
                        </div>;
    
                    this.data.push({
                        key: data.key,
                        email: data.email,
                        password: data.password,
                        title: data.title,
                        description: data.description !== "" ? <Text type="danger">{data.description}</Text> : "",
                        name: data.name,
                        phone: data.phone,
                        company: data.company.includes("data:image") ? <Image src={data.company} width={20} height={20} /> : "미첨부",
                        moment: temp,
                        visit: data.visit,
                        comment: data.comment,
                        process: process,
                        servicetype: data.servicetype === 0 ? "체험판" : data.servicetype === 1 ? "1개월" : data.servicetype === 2 ? "12개월" : data.servicetype === 3 ? "3개월" : data.servicetype === 4 ? "6개월" : "없음",
                        payType: data.payType === "CARD" ? "카드" : "현금",
                        refCode: data.refCode !== "" ? <Text type="danger">{data.refCode}</Text> : "",
                    });
    
                    return 0;
                });
            });
        
            await this.enableLoading(false);
        }
    }
      
    getUserData = async(datatype: number) => {
        this.initList();
        this.enableloading = true;
        
        await axios.post('http://118.35.126.70:3001/api/sfyloadall', {
            datatype: datatype
        })
        .then(res => res.data)
        .then(output => {
            output.map((data: any, index: number) => {
                var temp = moment(data.moment).format('YYYY-MM-DD HH:mm:ss');
                var process = data.comment ? 
                    <div>
                        <Button size="small" onClick={() => {
                            var record = {
                                key: data.key,
                                comment: ""
                            };

                            this.addComment(record);
                        }}>
                            승인완료
                        </Button>
                    </div>
                :
                    <div>
                        <Button size="small" type="primary" onClick={() => {
                            var record = {
                                key: data.key,
                                comment: "승인완료"
                            };

                            this.addComment(record);
                        }}>
                            {data.payType && data.payType === "CARD" ? "결제완료" : "입금확인중"}
                        </Button>
                    </div>;

                this.data.push({
                    key: data.key,
                    email: data.email,
                    password: data.password,
                    title: data.title,
                    description: data.description !== "" ? <Text type="danger">{data.description}</Text> : "",
                    name: data.name,
                    phone: data.phone,
                    company: data.company.includes("data:image") ? <Image src={data.company} width={20} height={20} /> : "미첨부",
                    moment: temp,
                    visit: data.visit,
                    comment: data.comment,
                    process: process,
                    servicetype: data.servicetype === 0 ? "체험판" : data.servicetype === 1 ? "1개월" : data.servicetype === 2 ? "12개월" : data.servicetype === 3 ? "3개월" : data.servicetype === 4 ? "6개월" : "없음",
                    payType: data.payType === "CARD" ? "카드" : "현금",
                    refCode: data.refCode !== "" ? <Text type="danger">{data.refCode}</Text> : "",
                });

                return 0;
            });
        })

        this.enableloading = false;
    };
        
    updateLists(index: number, key: number, email: string, password: string, title: string, description: string, name: string, phone: string, company: string, datetime: string, visit: number, comment: string, servicetype: number, payType: string, refCode: string) {
        var temp = moment(datetime).format('YYYY-MM-DD HH:mm:ss');
        var process = comment ? 
            <div>
                <Button size="small" onClick={() => {
                    var record = {
                        key: key,
                        comment: ""
                    };

                    this.addComment(record);
                }}>
                    승인완료
                </Button>
            </div>
        :
            <div>
                <Button size="small" type="primary" onClick={() => {
                    var record = {
                        key: key,
                        comment: "승인완료"
                    };

                    this.addComment(record);
                }}>
                    {payType === "CARD" ? "결제완료" : "입금확인중"}
                </Button>
            </div>;

        this.data[index] = {
            key: key,
            email: email,
            password: password,
            title: title,
            description: description !== "" ? <Text type="danger">{description}</Text> : "",
            name: name,
            phone: phone,
            company: company.includes("data:image") ? <Image src={company} width={20} height={20} /> : "미첨부",
            moment: temp,
            visit: visit,
            comment: comment,
            process: process,
            servicetype: servicetype === 0 ? "체험판" : servicetype === 1 ? "1개월" : servicetype === 2 ? "12개월" : servicetype === 3 ? "3개월" : servicetype === 4 ? "6개월" : "없음",
            payType: payType === "CARD" ? "카드" : "현금",
            refCode: refCode !== "" ? <Text type="danger">{refCode}</Text> : "",
        }
    }

    getServerState = () => {
        this.getBackendState();
        this.getCrawllerState();
        this.getDatabaseState();
    }

    getBackendState = async() => {
        this.backend = <Text type="warning">동기화 중...</Text>;

        await fetch('http://118.35.126.70:3001/api')
        .then((res: any) => {
            if(res.status === 200) {
                this.backend = <Text type="success">정상</Text>;
            }
            else
                this.backend = <Text type="danger">실패</Text>;
        });
    }

    getCrawllerState = async() => {
        this.crawller = <Text type="warning">동기화 중...</Text>;

        await fetch('http://118.35.126.70:3001/api/crawller')
        .then((res: any) => {
            if(res.status === 200) {
                this.crawller = <Text type="success">정상</Text>;
            }
            else
                this.backend = <Text type="danger">실패</Text>;
        });
    }

    getDatabaseState = async() => {
        this.database = <Text type="warning">동기화 중...</Text>;
        
        await fetch('http://118.35.126.70:3001/api/count')
        .then((res: any) => {
            if(res.status === 200) {
                this.database = <Text type="success">정상</Text>;
            }
            else
                this.backend = <Text type="danger">실패</Text>;
        });
    }

    showQuery = async() => {
        this.enableloading = true;

        await fetch("http://118.35.126.70:3001/api/board")
        .then((res: any) => res.json())
        .then((output: any) => {
            this.initList();

            output.map((data: any, index: any) => {
                this.updateLists(index, data.key, data.email, data.password, data.title, data.description, data.name, data.phone, data.company, data.moment, data.visit, data.comment, data.servicetype, data.payType ?? "", data.refCode);

                return [];
            })
        });

        this.enableloading = false;
    }

    addComment = async(record: any) => {
        if (this.administration) {
            axios.post("http://118.35.126.70:3001/api/comment", {
                key: record.key,
                comment: record.comment
            })
            .then(res => res.data)
            .then((output) => {
                if(output === "OK")
                {
                    this.sendMailTo(record);
                    this.showQuery();
    
                    message.success("처리되었습니다.");
    
                }
                else
                    message.error("전송에 실패하였습니다.");
            });
        }
    }

    addVisit = (values: any) => {
        axios.post("http://118.35.126.70:3001/api/visit", {
            key: values.key,
            visit: values.visit
        });
    }

    sendMailTo = (record: any) => {
        axios.post("http://118.35.126.70:3001/api/mail", {
            type: 'naver',
            to: record.email,
            subject: '[셀포유] ' + record.title + ' (답변)',
            text: record.comment
        });
    }

    toggleAdministration(value: boolean) {
        this.administration = value;
    }
}