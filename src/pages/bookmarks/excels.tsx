import { observer } from 'mobx-react';
import { Button, Input, Layout, message } from 'antd';

import moment from 'moment-timezone';
import XLSX from 'xlsx';

var FileSaver: any = require('file-saver');

export const Excels = observer(
  function() {
    function onChange(e: any) {
        const fileList = e.target.files;

        var reader = new FileReader();

        reader.onload = function() {
            let data = reader.result;

            let workBook = XLSX.read(data, {type: 'binary'});

            workBook.SheetNames.forEach(async function (sheetName) {
                let rows: any = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
                  defval: ""
                });

                const fileData = JSON.stringify(rows);
                const blob = new Blob([fileData], {type: "text/plain"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                link.download = 'filename.json';
                link.href = url;
                link.click();
            })
        };

        reader.readAsBinaryString(fileList[0]);
    }

    function stringToArrayBuffer(s: any) { 
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);

      for (var i=0; i<s.length; i++) 
        view[i] = s.charCodeAt(i) & 0xFF;

      return buf;
    }

    async function onConvertExcelAll() {
        moment.tz.setDefault("Asia/Seoul");

        var data_resp = await fetch('./test.json');
        var data_json = await data_resp.json();

        console.log(data_json);

        var wb = XLSX.utils.book_new();
        var newWorksheet = XLSX.utils.json_to_sheet(data_json);
        
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Json Test Sheet');

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        var date = moment().format('YYMMDD');

        console.log(wbout);
        
        FileSaver.saveAs(new Blob([stringToArrayBuffer(wbout)], {type:"application/octet-stream"}), 'kooza_email_list_' + date + '.xlsx');

        message.info('다운로드를 시작합니다. (kooza_email_list_' + date + '.xlsx)');
    }

    return(
      <div className="App-Layout">
        <Button type="primary" size="large" shape="round">
          엑셀 업로드
        </Button>

        &nbsp;

        <Button size="large" shape="round" type="default" onClick={onConvertExcelAll}>
          전체 엑셀 다운로드
        </Button>

        <br></br>
        <br></br>
        <br></br>

        <Layout className="App-Center">
          <table className="App-Table" width="50%">
            <tr>
              <td>
                <Input
                  size="large"
                  type="file"
                  onChange={onChange}
                  style={{width: "100%", borderRadius: 20}}
                />
              </td>
            </tr>
          </table>
        </Layout>
      </div>
    )
  }
);