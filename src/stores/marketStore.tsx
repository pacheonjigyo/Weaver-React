import { makeAutoObservable } from "mobx";
import { Button, Typography } from 'antd';
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';

import axios from 'axios';
import moment from 'moment-timezone';

const { Text } = Typography;

var storeID = [];

export class marketStore {
    attribute: any = [];
    
    data: any = [];
    datatemp: any = [];
    datatotal: any = 0;
    datetimeline: any;
    dayzero: any;
    dayone: any;
    daytwo: any;
    daythree: any;
    dayfour: any;
    dayfive: any;
    daysix: any;
    dayseven: any;

    flownumber: number = 2;

    loadingchart: boolean = false;

    optionsline: any;

    progressattribute: any = [];
    progressdata: any = [];

    record: any = [];

    seriesline: any = [];

    visiblebar: any = false;
    visibleline: any = false;

    constructor() {
        makeAutoObservable(this);

        this.seriesline = [
          {
            name: "전체 상품 수",
            data: []
          }
        ];
        
        this.optionsline = {
          chart: {
            type: 'none',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#e78200'],
          plotOptions: {
            bar: {
              columnWidth: "40%"
            }
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 3,
            curve: 'smooth'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['transparent', 'transparent'],
              opacity: 0.5
            },
          },
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeFormatter: {
                year: 'yyyy년',
                month: 'MM월',
                day: 'MM월 dd일',
              }
            }
          },
        };

        this.attribute = [
            {
              title: '구분',
              dataIndex: 'shop',
              key: 'shop',
      
              align: 'center',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.shop < b.shop ? -1 : a.shop > b.shop ? 1 : 0,
                multiple: 3,
              }
            },
            {
              title: '스토어 이름(URL)',
              dataIndex: 'shopname',
              key: 'shopname',
      
              align: 'left',
              width: '23%',

              sorter: {
                compare: (a: any, b: any) => a.shopname < b.shopname ? -1 : a.shopname > b.shopname ? 1 : 0,
                multiple: 3,
              }
            },
            {
              title: '차트',
              dataIndex: 'unique',
              key: 'unique',
      
              align: 'center',
              width: '5%',
            },
            {
              title: '오늘',
              dataIndex: 'total0',
              key: 'total0',
      
              align: 'right',
              width: '8%',
            },
            {
              title: '어제',
              dataIndex: 'total1',
              key: 'total1',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total1 - b.total1,
                multiple: 3,
              }
            },
            {
              title: '2일 전',
              dataIndex: 'total2',
              key: 'total2',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total2 - b.total2,
                multiple: 3,
              }
            },
            {
              title: '3일 전',
              dataIndex: 'total3',
              key: 'total3',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total3 - b.total3,
                multiple: 3,
              }
            },
            {
              title: '4일 전',
              dataIndex: 'total4',
              key: 'total4',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total4 - b.total4,
                multiple: 3,
              }
            },
            {
              title: '5일 전',
              dataIndex: 'total5',
              key: 'total5',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total5 - b.total5,
                multiple: 3,
              }
            },
            {
              title: '6일 전',
              dataIndex: 'total6',
              key: 'total6',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total6 - b.total6,
                multiple: 3,
              }
            },
            {
              title: '7일 전',
              dataIndex: 'total7',
              key: 'total7',
      
              align: 'right',
              width: '8%',

              sorter: {
                compare: (a: any, b: any) => a.total7 - b.total7,
                multiple: 3,
              }
            },
        ];

        this.progressattribute = [
          {
            title: '구분',
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
            title: '스토어 이름',
            dataIndex: 'shopname',
            key: 'shopname',
    
            align: 'center',
            width: '20%',

            sorter: {
              compare: (a: any, b: any) => a.shopname < b.shopname ? -1 : a.shopname > b.shopname ? 1 : 0,
              multiple: 3,
            }
          },
          {
            title: '신규주문',
            dataIndex: 'order',
            key: 'order',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.order - b.order,
              multiple: 3,
            }
          },
          {
            title: '발주확인',
            dataIndex: 'confirm',
            key: 'confirm',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.confirm - b.confirm,
              multiple: 3,
            }
          },
          {
            title: '배송중',
            dataIndex: 'delivering',
            key: 'delivering',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.delivering - b.delivering,
              multiple: 3,
            }
          },
          {
            title: '배송완료',
            dataIndex: 'delivered',
            key: 'delivered',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.delivered - b.delivered,
              multiple: 3,
            }
          },
          {
            title: '취소요청',
            dataIndex: 'cancel',
            key: 'cancel',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.cancel - b.cancel,
              multiple: 3,
            }
          },
          {
            title: '반품요청',
            dataIndex: 'returns',
            key: 'returns',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.return - b.return,
              multiple: 3,
            }
          },
          {
            title: '교환요청',
            dataIndex: 'exchange',
            key: 'exchange',
    
            align: 'right',
            width: '10%',

            sorter: {
              compare: (a: any, b: any) => a.exchange - b.exchange,
              multiple: 3,
            }
          }
        ]

        this.getDataLists();
        // this.getMarketProgress();
    }

    getDataLists = async() => {
      await fetch('http://118.35.126.70:3001/api/market')
      .then(res => res.json())
      .then(output => {
        if(output != null && typeof output === "object" && !Object.keys(output).length)
          this.initList();
        else
        {
          this.initList();

          output.info.map((data: any, index: number) => {
            var days = [];
  
            for(var i = 0; i < output.info.length; i++){
              for(var j = 0; j < 8; j++){
                if(output['total' + j][i] === null)
                  continue;
                else
                {
                  try {
                    if(output['total' + j][i] !== null && data._id === output['total' + j][i].unique)
                      days[j] = output['total' + j][i].total;
                  } catch(e) {
                    //
                  }
                }
              }
            }
  
            storeID[output.info[index].shopname] = output.info[index]._id;
  
            this.updateLists(index, output.info[index].shop, output.info[index].shopname, output.info[index]._id, days, days[0] - days[1]);
  
            return 0;
          });
        }
      });
    }

    getMarketProgress = async() => {
      await axios.get('http://118.35.126.70:3001/api/progress')
      .then(res => res.data)
      .then(output => {
        var key = 0;
        var totalorder = 0;
        var totalconfirm = 0;
        var totaldelivering = 0;
        var totaldelivered = 0;
        var totalcancel = 0;
        var totalreturn = 0;
        var totalexchange = 0;
        
        output.info.map((data: any, index: number) => {
          key = index;

          totalorder += data.order;
          totalconfirm += data.confirm;
          totaldelivering += data.delivering;
          totaldelivered += data.delivered;
          totalcancel += data.cancel;
          totalreturn += data.return;
          totalexchange += data.exchange;

          this.updateProgress(index, data.shop, data.shopname, data.order, data.confirm, data.delivering, data.delivered, data.cancel, data.return, data.exchange);

          return 0;
        })

        this.updateProgress(key + 1, '합계', '', totalorder, totalconfirm, totaldelivering, totaldelivered, totalcancel, totalreturn, totalexchange);
      })
    };

    initList() {
        this.data = [];
        this.datatemp = [];
    }
    
    updateProgress(index: number, shop: string, shopname: string, order: number, confirm: number, delivering: number, delivered: number, cancel: number, returns: number, exchange: number) {
      this.progressdata[index] = {
        shop: shop,
        shopname: shopname,
        order: order,
        confirm: confirm,
        delivering: delivering,
        delivered: delivered,
        cancel: cancel,
        returns: returns,
        exchange: exchange
      }
    }

    updateLists(index: number, shop: string, shopname: string, unique: string, totals: any, flow: number) {
      this.data[index] = {
        key: index,
        shop: shop,
        shopname: shopname + "(" + unique  + ")",
        unique: <div>
          <Button type="primary" size="small" icon={<BarChartOutlined />} onClick={() => {
            this.enableBarChartModal(true);
            this.updateChartData("1", unique);

            this.record.shop = shop;
            this.record.shopname = shopname;
            this.record.unique = unique;
          }}/>

          &nbsp;

          <Button type="primary" size="small" icon={<LineChartOutlined />} onClick={() => {
            this.enableLineChartModal(true);
            this.updateChartData("1", unique);

            this.record.shop = shop;
            this.record.shopname = shopname;
            this.record.unique = unique;
          }}/>
        </div>,
        total0: <div>
          {totals[0]} {this.displayFlows(flow)}
        </div>,
        total1: totals[1],
        total2: totals[2],
        total3: totals[3],
        total4: totals[4],
        total5: totals[5],
        total6: totals[6],
        total7: totals[7],
      }

      moment.tz.setDefault("Asia/Seoul"); 
      
      this.datatemp[index] = {
          "순번": index + 1,
          "스토어 구분": shop,
          "스토어 이름": shopname,
          "고유 아이디": unique
      };

      var year = moment().year().toString();
      var month = moment().month() + 1;

      var strmonth = "";
  
      if(month < 10) {
        strmonth = "0" + month.toString()
      }
      else {
        strmonth = month.toString()
      }

      for(var i = 0; i < 8; i++) {
        var days = moment().subtract(i, 'days').date();

        var strdays = "";

        if(days < 10) {
          strdays = "0" + days.toString();
        }
        else {
          strdays = days.toString();
        }

        var format = year + "-" + strmonth + "-" + strdays;

        this.datatemp[index][format] = totals[i];
      }
    }

    displayFlows(flow: number) {
      if(flow > 0)
        return <Text type="success"> ▲ {Math.abs(flow)}</Text>
      else
        if(flow === 0)
          return null;

        return <Text type="danger"> ▼ {Math.abs(flow)}</Text>
    }

    updateChartData = async(type: string, unique: string) => {
      await fetch('http://118.35.126.70:3001/api/chart?term=' + type + '&unique=' + unique)
      .then(res => res.json())
      .then(output => {
        if(output != null && typeof output === "object" && !Object.keys(output).length)
        {
          //NULL Array Checker: [], {}
        }
        else
        {
          var temp = [];
  
          for(var i = 0; i < output['index']; i++){
            var x, y;
  
            x = output['time' + i];
  
            try {
              y = parseInt(output['total' + i][0].total, 10);
            } catch(e) { 
              y = 0;
            }
  
            temp.push({x: x, y: y});
          }
  
          this.updateLine(temp);
        }
      });
  
      await this.enableLoadingChart(false);
    }
  
    updateLine(temp: any) {
      this.seriesline = [
        {
          name: "전체 상품 수",
          data: temp
        }
      ]
    }

    updateTotalLists(count: number) {
      this.datatotal = count;
    }
  
    enableLoadingChart(enabled: boolean) {
      this.loadingchart = enabled;
    }
  
    enableBarChartModal(enabled: boolean) {
      this.visiblebar = enabled;
    }
  
    enableLineChartModal(enabled: boolean) {
      this.visibleline = enabled;
    }
  }