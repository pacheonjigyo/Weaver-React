import axios from 'axios';
import moment from 'moment-timezone';
import XLSX from 'xlsx';

import { makeAutoObservable } from "mobx";
import { Button, Image, message } from 'antd';
import { LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

var FileSaver: any = require('file-saver');

export class itemStore {
    attribute: any = [{
        title: '고유번호',

        dataIndex: 'number',
        key: 'number',

        align: 'center',
        width: '6%'
    },
    {
        title: () => {
            return (
                <div>
                    상품코드
                    <br />
                    해외상품코드
                </div>
            );
        },

        dataIndex: 'code',
        key: 'code',

        align: 'center',
        width: '10%'
    },
    {
        title: '이미지',

        dataIndex: 'image',
        key: 'image',

        align: 'center',
        width: '6%'
    },
    {
        title: '쇼핑몰',

        dataIndex: 'shop',
        key: 'shop',

        align: 'center',
        width: '6%'
    },
    {
        title: '상품명',

        dataIndex: 'name',
        key: 'name',

        align: 'center',
        width: '42%'
    },
    {
        title: '상품 URL',

        dataIndex: 'urlorigin',
        key: 'urlorigin',

        align: 'center',
        width: '6%'
    },
    {
        title: () => {
        return (
            <div>
                정가
                <br />
                판매가
            </div>
        )},

        dataIndex: 'pricedollar',
        key: 'pricedollar',
        
        align: 'center',
        width: '6%'
    },
    {
        title: () => {
        return (
            <div>
                원화정가
                <br />
                원화판매가
            </div>
        );
        },

        dataIndex: 'pricewon',
        key: 'pricewon',

        align: 'center',
        width: '6%'
    },
    {
        title: '등록일',

        dataIndex: 'date',
        key: 'date',

        align: 'center',
        width: '6%'
    },
    {
        title: '옵션',

        dataIndex: 'option',
        key: 'option',

        align: 'center',
        width: '6%'
    }];

    emailattribute: any = [{
        title: '순번',

        dataIndex: 'number',
        key: 'number',

        align: 'center',
        width: '6%',

        sorter: {
            compare: (a: any, b: any) => a.number - b.number,
            multiple: 3,
        }
    },
    {
        title: '스토어 URL',

        dataIndex: 'sid',
        key: 'sid',

        align: 'center',
        width: '8%'
    },
    {
        title: '스토어 이름',

        dataIndex: 'store',
        key: 'store',

        align: 'center',
        width: '8%',

        sorter: {
            compare: (a: any, b: any) => a.store < b.store ? -1 : a.store > b.store ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '이메일',

        dataIndex: 'email',
        key: 'email',

        align: 'center',
        width: '10%',

        sorter: {
            compare: (a: any, b: any) => a.email < b.email ? -1 : a.email > b.email ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '고객센터',

        dataIndex: 'claim',
        key: 'claim',

        align: 'center',
        width: '8%',

        sorter: {
            compare: (a: any, b: any) => a.claim < b.claim ? -1 : a.claim > b.claim ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '사업장 소재지',

        dataIndex: 'place',
        key: 'place',

        align: 'center',
        width: '16%',

        sorter: {
            compare: (a: any, b: any) => a.place < b.place ? -1 : a.place > b.place ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '통신판매업번호',

        dataIndex: 'monum',
        key: 'monum',

        align: 'center',
        width: '12%',

        sorter: {
            compare: (a: any, b: any) => a.monum < b.monum ? -1 : a.monum > b.monum ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '사업자등록번호',

        dataIndex: 'crnum',
        key: 'crnum',

        align: 'center',
        width: '10%',

        sorter: {
            compare: (a: any, b: any) => a.crnum - b.crnum,
            multiple: 3,
        }
    },
    {
        title: '대표자',

        dataIndex: 'chief',
        key: 'chief',

        align: 'center',
        width: '6%',

        sorter: {
            compare: (a: any, b: any) => a.chief < b.chief ? -1 : a.chief > b.chief ? 1 : 0,
            multiple: 3,
        }
    },
    {
        title: '상호명',

        dataIndex: 'bname',
        key: 'bname',

        align: 'center',
        width: '16%',

        sorter: {
            compare: (a: any, b: any) => a.bname < b.bname ? -1 : a.bname > b.bname ? 1 : 0,
            multiple: 3,
        }
    }];

    administration = false;

    datasearched = 0;
    datatotal = 0;
    data: any = [];
    dataedit: any = [];
    datatemp: any = [];

    emaildata: any = [];
    emaildatatemp: any = [];

    dropdowndatabase = "전체";
    dropdowntype = "상품코드";

    enableadmin = false;
    enableaboutus = false;
    enabledetailed = false;
    enableedit = false;
    enablemail = false;
    enabledelete = false;
    enabledrawer = false;
    enableloading = false;

    editorhtml: any = null;

    loadingemail = false;
    loadingedit = false;
    loadingdelete = false;

    multiple = false;

    emailfile = ""

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

    sender: String = '';

    constructor() {
        makeAutoObservable(this);

        this.getTotal();
    }

    setEditorHtml = (e: any) => {
        this.editorhtml = e;
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

    enableLoadingEdit = (value: boolean) => {
        this.loadingedit = value;
    }

    enableLoadingDelete = (value: boolean) => {
        this.loadingdelete = value;
    }

    getTotal = async() => {
        await fetch('http://118.35.126.70:3001/api/count?type=lists')
        .then(res => res.json())
        .then(output => {
            this.datatotal = output[0].orange + output[0].em35;
        });

        await this.enableLoading(false);
    }

    filterListsBy = async(filter: string, type: string, value1: string, value2: string) => {
        if (/sfy/gi.test(value1)) {
            const query = `
                query (
                    $where: ProductWhereInput, 
                    $orderBy: [ProductOrderByWithRelationInput!],
                    $take: Int,
                    $skip: Int,
                    $cursor: ProductWhereUniqueInput
                ) {
                    selectProductsByAdmin(
                        where: $where,
                        orderBy: $orderBy,
                        take: $take,
                        skip: $skip,
                        cursor: $cursor
                    ) {
                        id
                        productCode
                        name
                        price
                        imageThumbnail
                        taobaoProduct {
                            price
                            shopName
                            url
                        }
                        createdAt
                    }
                }
            `;
            
            const variables = {
                where: {
                    id: {
                        equals: parseInt(value1.split("_")[1], 36)
                    }
                }
            };

            const prodResp = await fetch('https://api.sellforyou.co.kr/graphql', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ query, variables }),
            });

            const prodJson = await prodResp.json();

            if (prodJson.errors) {
                alert(prodJson.errors[0].message);

                return;
            }

            const products = prodJson.data.selectProductsByAdmin;
      
            if (products.length === 0) {
                this.updateDataSearched(0);

                return;
            }

            products.map((data: any, index: number) => {
                this.updateLists(index, data.id, data.productCode, data.codeglobal, data.imageThumbnail[0], data.taobaoProduct.shopName, data.name, data.taobaoProduct.url, data.taobaoProduct.price, data.taobaoProduct.price, data.price, data.price, data.createdAt);
                this.updateDataSearched(products.length);

                return 0;
            });

            await this.enableLoading(false);

            return;
        }

        if(this.data !== null && filter !== null && type !== null && value1 !== null && value2 !== null)
        {
            await fetch('http://118.35.126.70:3001/api/' + filter + '?searchType=' + type + '&value1=' + value1 + '&value2=' + value2, {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(output => {
                if(output != null && typeof output === "object" && !Object.keys(output).length)
                    this.updateDataSearched(0);
                else
                {
                    output.map((data: any) => {
                        this.updateLists(data.key, data.number, data.codelocal, data.codeglobal, data.image, data.shop, data.name, data.urlorigin, data.pricedollarlist, data.pricedollar, data.pricewonlist, data.pricewon, data.date);
                        this.updateDataSearched(output.length);
            
                        return 0;
                    })
                }
            });
        
            await this.enableLoading(false);
        }
    }

    initList() {
        this.data = [];
        this.datatemp = [];
    }

    updateDataSearched(value: number) {
        this.datasearched = value;
    }

    updateLists(key: number, number: number, codelocal: string, codeglobal: string, image: string, shop: string, name: string, urlorigin: string, pricedollarlist: string, pricedollar: string, pricewonlist: string, pricewon: string, date: string) {
        var tempdollarlist;
        var tempdollar;
        var tempwonlist;
        var tempwon;

        if(pricedollarlist !== '-')
        {
          if(codelocal.includes('PROD'))
            tempdollarlist = '$' + pricedollarlist;
          else
            tempdollarlist = '¥' + pricedollarlist;
        }
        else
            tempdollarlist = '-';
    
        if(pricedollar !== '-')
        {
          if(codelocal.includes('PROD'))
            tempdollar = '$' + pricedollar
          else
            tempdollar = '¥' + pricedollar
        }
        else
            tempdollar = '-';
    
        if(pricewonlist !== '-')
            tempwonlist = pricewonlist + '원'
        else
            tempwonlist = '-';
    
        if(pricewon !== '-')
            tempwon = pricewon + '원'
        else
            tempwon = '-';
    
        this.data[key] = {
            key: key,
            number: number,
            code: <div>
                {codelocal}
                <br></br>
                {codeglobal}
            </div>,
            codelocal: codelocal,
            codeglobal: codeglobal,
            imageorigin: image,
            image: <Image src={image} width={45} height={45} alt=""/>,
            shop: shop,
            name: name,
            urlorigin: <a href={urlorigin} target="_blank" rel="noopener noreferrer"><Button shape="circle" type="primary" icon={<LinkOutlined />}/></a>,
            pricedollar: <div>
                {tempdollarlist}
                <br></br>
                {tempdollar}
            </div>,
            pricewon: <div>
                {tempwonlist}
                <br></br>
                {tempwon}
            </div>,
            date: date,
            option: <div>
                <Button type="primary" icon={<EditOutlined />} onClick={() => {
                    if(this.administration) {
                        this.record.number = number;
                        this.record.codelocal = codelocal;
                        this.record.codeglobal = codeglobal;
                        this.record.shop = shop;
                        this.record.image = image;
                        this.record.name = name;
                        this.record.urlorigin = urlorigin;
                        this.record.pricedollarlist = pricedollarlist;
                        this.record.pricedollar = pricedollar;
                        this.record.pricewonlist = pricewonlist;
                        this.record.pricewon = pricewon;
                        this.record.date = date;
    
                        this.enableedit = true;
                    }
                    else {
                        message.warning("관리자 모드에서만 사용할 수 있습니다.");
                    }
                }}/>

                &nbsp; 

                <Button type="primary" icon={<DeleteOutlined />} onClick={() => {
                    if(this.administration) {
                        this.record.codelocal = codelocal;

                        this.enabledelete = true;
                    }
                    else {
                        message.warning("관리자 모드에서만 사용할 수 있습니다.");
                    }
                }}/>
            </div>,
            translated: ""
        }
    
        this.datatemp[key] = {
          '순번': key,
          '고유번호': number,
          '상품코드': codelocal,
          '해외상품코드': codeglobal,
          '이미지': image,
          '쇼핑몰': shop,
          '상품명': name,
          '상품 URL': urlorigin,
          '정가': pricedollarlist,
          '판매가': pricedollar,
          '원화정가': pricewonlist,
          '원화판매가': pricewon,
          '등록일': date
        }
    }

    updateData = async(values: any) => {
        await axios.post('http://118.35.126.70:3001/api/edit', {
            number: values.number,
            codelocal: values.codelocal,
            codeglobal: values.codeglobal,
            image: values.image,
            shop: values.shop,
            name: values.name,
            urlorigin: values.urlorigin,
            pricedollarlist: values.pricedollarlist,
            pricedollar: values.pricedollar,
            pricewonlist: values.pricewonlist,
            pricewon: values.pricewon,
            date: values.date
        })
        .then((res: any) => {
            if(res.status === 200) {
                this.data.map((data: any) => {
                    if(data.codelocal === values.codelocal) {
                        this.updateLists(data.key, values.number, values.codelocal, values.codeglobal, values.image, values.shop, values.name, values.urlorigin, values.pricedollarlist, values.pricedollar, values.pricewonlist, values.pricewon, values.date);
                    }

                    return [];
                });
            }
            else
                message.error('오류가 발생했습니다.');
        });

        await this.enableEditModal(false);
        await this.enableLoadingEdit(false);
    }

    deleteData = async(values: any) => {
        await axios.post('http://118.35.126.70:3001/api/delete', {
            codelocal: values.codelocal
        })
        .then((res: any) => {
            if(res.status === 200) {
                this.data = this.data.filter((data: any) => {
                    if(data.codelocal.includes(values.codelocal) === false)
                        return data;

                    return [];
                });

                this.updateDataSearched(this.data.length);
            }
            else
                message.error('오류가 발생했습니다.');
        });

        await this.enableDeleteModal(false);
        await this.enableLoadingDelete(false);
    }

    enableEditModal(value: boolean) {
        this.enableedit = value;
    }

    enableDeleteModal(value: boolean) {
        this.enabledelete = value;
    }

    enableAdminModal(value: boolean) {
        this.enableadmin = value;
    }

    enableMailModal(value: boolean) {
        this.enablemail = value;
    }

    enableAboutUsModal(value: boolean) {
        this.enableaboutus = value;
    }

    toggleAdministration(value: boolean) {
        this.administration = value;
    }

    toggleDrawer(value: boolean) {
        this.enabledrawer = value;
    }

    toggleMultiple(value: boolean) {
        this.multiple = value;
    }

    setCurrentSender(value: String) {
        this.sender = value;
    }

    sendMail = (values: any) => {
        if(this.multiple === true) {
            var sentence = values.to.replaceAll(" ", "");

            var list = sentence.split(",");
            var temp = 0;

            while(temp < list.length) {
                if(list[temp] === "")
                {
                    temp += 1;

                    continue;
                }
            
                axios.post("http://118.35.126.70:3001/api/mail", {
                    type: values.type,
                    to: list[temp],
                    subject: values.subject,
                    text: values.text,
                    html: values.html
                })
                .then((res: any) => {
                    message.info(res.data);
                });

                temp += 1;
            }
        }
        else {
            axios.post("http://118.35.126.70:3001/api/mail", {
                type: values.type,
                to: values.to,
                subject: values.subject,
                text: values.text,
                html: values.html
            })
            .then((res: any) => {
                message.info(res.data);
            });
        }
    }

    enableDetailedModal = (value: boolean) => {
        this.enabledetailed = value;
    }

    setDescription = (value: any) => {
        this.record.description = value;
    }

    pushEmailData = (data: any, index: Number) => {
        this.emaildata.push({
            key: index,
            number: data._id,
            sid: <a href={data.sid} target="_blank" rel="noopener noreferrer"><Button shape="circle" type="primary" icon={<LinkOutlined />}/></a>,
            store: data.store,
            email: data.email,
            claim: data.claim,
            place: data.place,
            monum: data.monum,
            crnum: data.crnum,
            chief: data.chief,
            bname: data.bname
        })

        this.emaildatatemp.push({
            "순번": data._id,
            "스토어 URL": data.sid,
            "스토어 이름": data.store,
            "이메일": data.email,
            "고객센터": data.claim,
            "사업장 소재지": data.place,
            "통신판매업번호": data.monum,
            "사업자등록번호": data.crnum,
            "대표자": data.chief,
            "상호명": data.bname
        })
    }

    getEmailResults = async() => {
        this.emaildatatemp = []

        await axios.post("http://118.35.126.70:3001/api/getemailall")
        .then(res => res.data)
        .then(output => {
            output.map((data: any) => {
                this.emaildatatemp.push({
                    "순번": data._id,
                    "스토어 URL": data.sid,
                    "스토어 이름": data.store,
                    "이메일": data.email,
                    "고객센터": data.claim,
                    "사업장 소재지": data.place,
                    "통신판매업번호": data.monum,
                    "사업자등록번호": data.crnum,
                    "대표자": data.chief,
                    "상호명": data.bname
                })

                return 0;
            })
        })

        moment.tz.setDefault("Asia/Seoul");

        var wb = XLSX.utils.book_new();
        var newWorksheet = XLSX.utils.json_to_sheet(this.emaildatatemp.slice());
        
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Json Test Sheet');

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        var date = moment().format('YYMMDD');

        FileSaver.saveAs(new Blob([this.stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), 'kooza_email_list_all_' + date + '.xlsx');

        message.info('다운로드를 시작합니다. (kooza_email_list_' + date + '.xlsx)');
    }

    stringToArrayBuffer(s: any) { 
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
  
        for (var i=0; i<s.length; i++) 
          view[i] = s.charCodeAt(i) & 0xFF;
  
        return buf;
      }

    loadEmailFromDB = async(value: any) => {
        this.emaildata = []
        this.emaildatatemp = []

        this.loadingemail = true;

        if(value === "") {
            await axios.post("http://118.35.126.70:3001/api/getemailall")
            .then(res => res.data)
            .then(output => {
                output.map((data: any, index: Number) => {
                    this.pushEmailData(data, index)

                    return 0;
                })
            })
        } else {
            await axios.post("http://118.35.126.70:3001/api/getemail", { email: value })
            .then(res => res.data)
            .then(output => {
                output.map((data: any, index: Number) => {
                    this.pushEmailData(data, index)

                    return 0;
                })
            })
        }

        this.loadingemail = false;
    }

    setEmailFile = (value: any) => {
        this.emailfile = value
    }
}