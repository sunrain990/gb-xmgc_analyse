/**
 * Created by kevin on 16/10/20.
 */
var Mysql = require('../config/db/my');

var ssql1 = 'select * from ecp.user right join project.school s on  ecp.user.school=project.school.id';

var result = yield Mysql.ecp.query(ssql1);
console.log(result, 'this is result');