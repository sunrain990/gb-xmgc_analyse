/**
 * Created by kevin on 16/10/20.
 */
var Sequelize = require('sequelize');
var _ = require('lodash');
var sequelize = new Sequelize('project','ecp_test','Gem231320',
    {
        host:'rdsf39n5tp6w482946xa.mysql.rds.aliyuncs.com',
        dialect:'mysql',
        port:3306,
        pool:{
            max:5,
            min:0,
            idle:10000
        },
        timestamp:true
    });
// let User = sequelize.define('user_test',{
//     firstName: {
//         type: Sequelize.STRING,
//         field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
//     },
//     lastName: {
//         type: Sequelize.STRING
//     }
// }, {
//     freezeTableName: true // Model tableName will be the same as the model name
// });
//
// User.sync().then(function() {
//     return User.create({
//         firstName:'John',
//         lastName:'Hancock'
//     });
// });
var sql = 'select * from `user_test`';

// sequelize.query('update user_test set first_name="ooo"')
//     .spread(function(results,metadata){
//         console.log(results,'---- - - -- - - - -- - - -\n',metadata);
//     });

// sequelize.query(sql,{type:sequelize.QueryTypes.SELECT})
//     .then(function(users){
//         console.log(users,'|||||||||');
//     });

// let User = sequelize.define('user_test',{
//     firstName: {
//         type: Sequelize.STRING,
//         field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
//     }
// });

// sequelize.query(sql).then(function(projects){
//     console.log(projects);
// });

// var ssql = 'select * from ecp.user where schoolId <>0';
// var ssql1 =
//     `
//         SELECT *,count(schoolId)
//         FROM (
//
//         SELECT u.id, u.schoolId, s.province, s.city, s.name
//         FROM ecp.user u
//         RIGHT JOIN project.school s ON u.schoolId = s.id
//         WHERE u.schoolId <> ''
//         AND s.id <>0
//         AND u.isTeacher =1
//         )t group by t.schoolId
//     `;
//
// sequelize.query(
//     ssql1,
//     // 'select id from school',
//     // 'select * from user_test where id=?',
//     {
//         // replacements:{
//         //     ids:[1,2],
//         // },
//         // replacements:[1],
//         type:sequelize.QueryTypes.SELECT
//     }
// ).then(function (projects) {
//     // var mapedprojects = projects.map(function(item){
//     //     return item.id;
//     // });
//
//     console.log(projects);
//
//     // console.log(mapedprojects);
// });


// 1.获取各学校老师信息
// var getTeacherSql =
//     `
//     SELECT u.id, u.schoolId
//         FROM ecp.user u
//         RIGHT JOIN project.school s ON u.schoolId = s.id
//         WHERE u.schoolId <> ''
//         AND s.id <>0
//         AND u.isTeacher =1
//     `;
//     sequelize.query(
//         getTeacherSql,
//         {
//             type:sequelize.QueryTypes.SELECT
//         }
//     ).then(function (projects) {
//         // var mapedprojects = projects.map(function(item){
//         //     return item.id;
//         // });
//
//
//         // var keyByProjects = _.keyBy(projects, 'schoolId');
//         // console.log(keyByProjects);
//
//         projects = _.groupBy(projects,function(o){
//             return o.schoolId;
//         });
//
//         // console.log(projects);
//
//         _.forEach(projects,function(value,key){
//             // console.log(key, '- - - - - -', value);
//             vmped = value.map(function(v){
//                 return v.id;
//             });
//             // console.log(vmped);
//
//             console.log('学校id:'+key,'老师个数:'+vmped.length);
//
//             _.forEach(vmped,function(vap){
//                 console.log(' - -  老师id:'+vap);
//             });
//
//             // var scollectionSql = 'select * from project.scollection where authorid='+key;
//             // sequelize.query(
//             //     scollectionSql,
//             //     {
//             //         type:sequelize.QueryTypes.SELECT
//             //     }
//             // ).then();
//
//         });
//
//         // console.log(mapedprojects);
//     });

// 2.获取各老师的课设毕设
// { scollectionid: 171,teacherid: 6632, designtype: 2, scollectionnum: 1 },
// { scollectionid: 170, teacherid: 6632, designtype: 3, scollectionnum: 1 },
var getTScollectionSql =
    `
    SELECT s.authorid as teacherid,s.designtype,count(s.designtype) as scollectionnum
        FROM project.scollection s
        RIGHT JOIN ecp.user u ON s.authorid = u.id
        WHERE u.isTeacher=1
        and s.designtype in (2,3)
        group by teacherid,designtype
        order by teacherid,designtype
    `;

// { scollectionid: 8, teacherid: 1, designtype: 2 }
var getTScollectionSql =
    `
    SELECT s.id as scollectionid,s.authorid as teacherid,s.designtype
        FROM project.scollection s
        RIGHT JOIN ecp.user u ON s.authorid = u.id
        WHERE u.isTeacher=1
        and s.designtype in (2,3)
        group by teacherid,designtype
        order by teacherid,designtype
    `;


// and s.authorid=25
// group by s.designtype

sequelize.query(
    getTScollectionSql,
    {
        type:sequelize.QueryTypes.SELECT
    }
).then(function(scollections){
    console.log(scollections);
})



//3.获取scollectionid
// var getTScollectionSql =
//     `
//     SELECT scollectionid,count(scollectionid) as studentnums FROM project.scollection_user group by scollectionid
//     `;
//
//
// // and s.authorid=25
// // group by s.designtype
//
// sequelize.query(
//     getTScollectionSql,
//     {
//         type:sequelize.QueryTypes.SELECT
//     }
// ).then(function(scollections){
//     console.log(scollections);
// })