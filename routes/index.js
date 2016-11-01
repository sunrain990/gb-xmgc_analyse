var router = require('koa-router')();
var analyse = require('../service/school_teacher');
var fs = require('fs');

router.get('/', function *(next) {
  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});


router.post('/', function*(next){
  console.log(
      'in analyse ing!!!!'
  );
  yield analyse();
  this.body = {
    an: '1'
  };
  // yield analyse();
  // return this.body={
  //   info: 'analyse success'
  // };
});


module.exports = router;
