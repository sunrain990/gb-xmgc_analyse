var router = require('koa-router')();
var fs = require('fs');
var path = require('path');

router.get('/', function *(next) {
  console.log('this is logs', path.join(__dirname,'../logs'));

  fs.readdir(path.join(__dirname,'../logs'), function(err, files) {
    if(err) {
      return this.body ={
        err: err
      }
    }else {
      console.log(files);
      return this.body= {
        files: files
      };
    }
  })

});

module.exports = router;
