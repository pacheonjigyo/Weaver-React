import axios from "axios";

import { message } from "antd";
import { makeAutoObservable } from "mobx";

export class searchStore {
    attribute: any = [{
        title: '스토어 이름',
        dataIndex: 'shopname',
        key: 'shopname',

        align: 'center',
    }];

    datatotal = 0;
    data: any = [];

    image: string = "";
    
    imagedata: any = null;
    concatdata: any = null;
    resizedata: any = null;

    coupangprocess: number = 0;
    coupanglog: any = [];

    settlement: string = "";
    settlementsmartstore: number = 0;
    settlementcoupang: number = 0;

    loadingsmartstore: boolean = false;
    loadingcoupang: boolean = false;

    hideheader: boolean = false;
    
    constructor() {
        makeAutoObservable(this);

        this.getDataLists();
    }

    toggleSmartStore(value: boolean) {
        this.loadingsmartstore = value;
    }

    toggleCoupang(value: boolean) {
        this.loadingcoupang = value;
    }

    setImageData(value: any) {
        this.imagedata = value;
    }

    setConcatData(value: any) {
        this.concatdata = value;
    }

    setResizeData(value: any) {
        this.resizedata = value;
    }
      
    getDataLists = async() => {
        await fetch('http://118.35.126.70:3001/api/search', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(output => {
            if(output != null && typeof output === "object" && !Object.keys(output).length)
            {
                this.initList();
            }
            else
            {
                this.initList();
                this.updateTotal(output.info.length);

                output.info = output.info.sort((a: any, b: any) => {
                    if(a['shopname'] > b['shopname']) {
                        return 1;
                    }

                    if(a['shopname'] < b['shopname']) {
                        return -1;
                    }

                    return 0;
                })

                for (var i in output.info) {
                    var index = parseInt(i);

                    this.updateLists(index, output.info[i].shopname, output.info[i]._id);
                }
            }
        });
    }

    updateTotal(total: number) {
        this.datatotal = total;
    }

    initList() {
        this.data = [];
    }

    updateLists(index: number, shopname: string, unique: string) {
        this.data[index] = {
            key: index,
            shopname: shopname,
            unique: unique
        }
    }

    setSettlement(value: string) {
        this.settlement = value;
    }

    getFilterLists = async(num_iid: string) => {
        var key = 'tel17537715186'
        var secret = '20201206'

        await axios.post('http://118.35.126.70:3001/api/filtering', {
            key: key,
            num_iid: num_iid,
            secret: secret
        })
        .then(res => res.data)
        .then(output => {
            fetch('./filtered-list.txt')
            .then(res => res.json())
            .then(data => {
                let word_list = data.words;
                let image_list = data.images;

                let desc_img = output.item.desc_img;
                let item_imgs = output.item.item_imgs;
                let prop_img = output.item.props_imgs.prop_img;

                var brand = output.item.brand;
                var desc = output.item.desc;
                var pic_url = output.item.pic_url;
                var props_name = output.item.props_name;
                var title = output.item.title;

                var counttext = 0;
                var countimage = 0;

                word_list.map((word: any) => {
                    if(title.includes(word))
                    {
                        message.error(word + '는 상표권 침해 사유가 될 수 있습니다. (상품 제목 참조)');

                        counttext++;
                    }

                    if(desc.includes(word))
                    {
                        message.error(word + '는 상표권 침해 사유가 될 수 있습니다. (상품 상세설명 참조)');

                        counttext++;
                    }

                    if(brand.includes(word))
                    {
                        message.error(word + '는 상표권 침해 사유가 될 수 있습니다. (상품 상표 참조)');

                        counttext++;
                    }

                    if(props_name.includes(word))
                    {
                        message.error(word + '는 상표권 침해 사유가 될 수 있습니다. (제품 세부사항 참조)');

                        counttext++;
                    }

                    return 0;
                })

                image_list.map((image: any) => {
                    if(pic_url.includes(image))
                    {
                        message.error(image + '는 저작권 침해 사유가 될 수 있습니다. (링크 참조)');

                        countimage++;
                    }

                    if(desc.includes(image))
                    {
                        message.error(image + '는 저작권 침해 사유가 될 수 있습니다. (링크 참조)');

                        countimage++;
                    }

                    desc_img.map((pic: any) => {
                        if(pic.includes(image))
                        {
                            message.error(image + '는 저작권 침해 사유가 될 수 있습니다. (링크 참조)');

                            countimage++;
                        }

                        return 0;
                    })

                    item_imgs.map((pic: any) => {
                        if(pic.url.includes(image))
                        {
                            message.error(image + '는 저작권 침해 사유가 될 수 있습니다. (링크 참조)');

                            countimage++;
                        }

                        return 0;
                    })

                    prop_img.map((pic: any) => {
                        if(pic.url.includes(image))
                        {
                            message.error(image + '는 저작권 침해 사유가 될 수 있습니다. (링크 참조)');

                            countimage++;
                        }

                        return 0;
                    })

                    return 0;
                })

                if(countimage === 0 && counttext === 0)
                    message.info('저작권 및 상표권 침해요소 없음');
                else
                    message.warning('저작권 침해요소 ' + countimage + '건, 상표권 침해요소 ' + counttext + '건 식별됨');
            });
        })
    }

    getSettlementFromSmartStore = async(id: string, pw: string) => {
        if(this.settlement !== "") {
            await axios.post('http://118.35.126.70:3001/api/settlement', {
                id: id,
                pw: pw,
                store: this.settlement
            })
            .then(res => {
                this.toggleSmartStore(false);

                res.data.delivering.map((data: any) => {
                    this.addSettlementSmartStore(data)

                    return [];
                })

                res.data.delivered.map((data: any) => {
                    this.addSettlementSmartStore(data)

                    return [];
                })
            })
        }
        else 
            message.warning('조회 대상 쇼핑몰이 선택되지 않았습니다.');

    }

    getSettlementFromCoupang = async(id: string, pw: string) => {
        if(this.settlement !== "") {
            await axios.post('http://118.35.126.70:3001/api/settlement', {
                id: id,
                pw: pw,
                store: this.settlement
            })
            .then(res => {
                this.toggleCoupang(false);

                res.data.delivering.map((data: any) => {
                    this.addSettlementCoupang(data)

                    return [];
                })

                res.data.delivered.map((data: any) => {
                    this.addSettlementCoupang(data)

                    return [];
                })
            })
        }
        else 
            message.warning('조회 대상 쇼핑몰이 선택되지 않았습니다.');

    }

    initSettlementSmartStore() {
        this.settlementsmartstore = 0;
    }

    initSettlementCoupang() {
        this.settlementcoupang = 0;
    }

    addSettlementSmartStore(value: string) {
        this.settlementsmartstore += parseInt(value);
    }

    addSettlementCoupang(value: string) {
        this.settlementcoupang += parseInt(value);
    }

    editProductCoupang = async(accesskey: string, secretkey: string, userproductforcoupang: any, edit: boolean) => {
        this.coupangprocess = 0;
        this.coupanglog = [];

        let exception_resp = await fetch('./coupang.json');
        let exception_json = await exception_resp.json();

        for (let i in userproductforcoupang) {
            var product_resp = await fetch("http://118.35.126.70:3001/api/coupang", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "accesskey": accesskey,
                    "secretkey": secretkey,
            
                    "path": `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${userproductforcoupang[i]}`,
                    "query": "",
                    "method": "GET",
            
                    "data": {}
                })
            });
    
            var product_json = await product_resp.json();

            if (product_json.code === 'ERROR') {
                product_json.id = userproductforcoupang[i];

                this.coupangprocess += 1;
                this.coupanglog.push(product_json);

                continue;
            }

            let matched = null;

            for (let j in exception_json) {
                if (exception_json[j].code === product_json.data.displayCategoryCode.toString()) {
                    matched = exception_json[j].name;

                    break;
                }
            }

            if (matched) {
                this.coupangprocess += 1;
                this.coupanglog.push({
                    "id": userproductforcoupang[i],
                    "code": "ERROR",
                    "message": `현재 예외 카테고리는 검사 및 수정 기능이 제공되지 않습니다. (${matched})`
                });

                continue;
            }
            
            let minPrice = Math.min(...product_json.data.items.map((v: any) => v.salePrice));

            let deliveryCharge = product_json.data.deliveryCharge;
			let deliveryChargeOnReturn = product_json.data.deliveryChargeOnReturn;

			let returnCharge = product_json.data.returnCharge;

			//유료배송비가 있는 경우 
			if (deliveryCharge > 0) {
				if (minPrice <= 20000) {
					if (returnCharge > 15000) {
						returnCharge = 15000;
					}
				} else if (minPrice > 40000) {
					if (returnCharge > 100000) {
						returnCharge = 100000;
					}
				} else {
					if (returnCharge > 20000) {
						returnCharge = 20000;
					}
				}
				
				if (returnCharge > minPrice) {
					returnCharge = minPrice;
				}
			} else {
                let sumCharge1 = deliveryChargeOnReturn + returnCharge;

				//초도반품비 + 반품비
				if (minPrice <= 20000) {
					if (sumCharge1 > 15000) {
						returnCharge = 7500;
                        deliveryChargeOnReturn = 7500;
					}
				} else if (minPrice > 40000) {
                    if (sumCharge1 > 100000) {
						returnCharge = 50000;
                        deliveryChargeOnReturn = 50000;
					}
				} else {
					if (sumCharge1 > 20000) {
						returnCharge = 10000;
                        deliveryChargeOnReturn = 10000;
					}
				}
				
				let sumCharge2 = deliveryChargeOnReturn + returnCharge;

				if (sumCharge2 > minPrice) {
					deliveryChargeOnReturn = Math.floor(minPrice / 200) * 100;
					returnCharge = Math.floor(minPrice / 200) * 100;
				}
			}

            var edit_resp = await fetch("http://118.35.126.70:3001/api/coupang", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    "accesskey": accesskey,
                    "secretkey": secretkey,
            
                    "path": `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${userproductforcoupang[i]}/partial`,
                    "query": "",
                    "method": "PUT",
            
                    "data": edit ? {
                        ...product_json.data,

                        "deliveryCharge": deliveryCharge,
                        "deliveryChargeOnReturn": deliveryChargeOnReturn,

                        "returnCharge": returnCharge,
                    } : { ...product_json.data },
                })
            });
    
            let edit_json = await edit_resp.json();

            edit_json.id = userproductforcoupang[i];

            this.coupangprocess += 1;
            this.coupanglog.push(edit_json);
        }

        message.info(`작업이 완료되었습니다.`);

        this.loadingcoupang = false;
        this.coupangprocess = 0;
    }

    setHideHeader = (value: boolean) => {
        this.hideheader = value;
    }
}