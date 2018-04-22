const http = require('http');
const CryptoJS = require('crypto-js');
const prompt = require('prompt');
const port = 3000;

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello Node.js Server!');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if(err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
  handleReadLine();
});

function handleReadLine() {
  let mode;
  let padding;
  let modeSchema = {
    properties: {
      mode: {
        description: 'Mode of decrypt, 1 for CBC, 2 for CTR',
      }
    }
  };
  prompt.start();
  prompt.get(modeSchema, (err, result) => {
    if(result.mode === '1') {
      mode = 'CBC';
      padding = 'Pkcs7';
    } else if(result.mode === '2') {
      mode = 'CTR';
      padding = 'NoPadding';
    } else {
      console.log('Choose a mode!');
      prompt.close();
    }
    prompt.get(['encryptedText', 'key'], (err, result) => {
      console.log(`decrypt with ${mode} mode: `, decrypt(result.encryptedText, result.key, mode, padding));
    });
  }); 
}


function decrypt (transitmessage, key, mode, padding) {
  let iv = transitmessage.substr(0, 16);
  let encrypted = transitmessage.substr(16, transitmessage.length);

  key = CryptoJS.enc.Hex.parse(key);
  iv = CryptoJS.enc.Hex.parse(iv);
  encrypted = CryptoJS.enc.Hex.parse(encrypted);

  let decrypted = CryptoJS.AES.decrypt({ciphertext: +encrypted.toString()}, key, { 
    iv: iv, 
    padding: CryptoJS.pad[padding],
    mode: CryptoJS.mode[mode]
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}