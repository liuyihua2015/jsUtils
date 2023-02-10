document.write('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>');
document.write('<script src="https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js"></script>');

//加密
function encrypted(data) {
  var key = CryptoJS.enc.Utf8.parse('shinssonshinsson');
  var iv = CryptoJS.enc.Utf8.parse('0');

  var srcs = JSON.stringify(data);

  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });  //Crypto
  return encrypted.toString();
}


//解密
function decrypt(encrypt) {
  var key = CryptoJS.enc.Utf8.parse('shinssonshinsson');
  var iv = CryptoJS.enc.Utf8.parse('0');
  var decrypted = CryptoJS.AES.decrypt(encrypt, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });
  var str = decrypted.toString(CryptoJS.enc.Utf8);

  //特殊字符处理
  var items = str.split('"}')
  items.pop()
  var newStr = items.join('"}')
  return newStr + '"}'
}

function getFileObject(file,canblck) {
  JSZip.loadAsync(file).then((res) => {
    res.forEach((ele, obj) => {
      if (!obj.dir) {//判断是否为文件
        // 压缩包内文件名称
        let fileName = obj.name;
        //压缩包内文件大小
        let unsize = obj._data.uncompressedSize / 1024;
        let fileSize = unsize.toFixed(2) + "KB";
        //下载操作
        let base = res.file(obj.name).async('blob');
        base.then(rr => {
          if (window.FileReader) {
            let reader = new FileReader();
            reader.readAsText(rr);
            reader.onload = function () {
              var data = reader.result;

              var dec = decrypt(data.toString())
              canblck(JSON.parse(dec));
            };
            reader.onerror = function () {
              console.log('读取失败');
              console.log(reader.error);
            }

          } else {
            console.log('你的浏览器不支持读取文件');
          }

        })
      }
    })
  })
}

