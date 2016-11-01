/**
 * Created by kevin on 16/10/23.
 */
var Sequelize = require('sequelize');

var Promise = require('bluebird');
var _ = require('lodash');
var sequelize = new Sequelize('project','ecp','CqmygDsx2s_MYSQL',
    {
        host:'rdsvy6jrfrbi2a2.mysql.rds.aliyuncs.com',
        dialect:'mysql',
        port:3306,
        pool:{
            max:5,
            min:0,
            idle:10000
        },
        timestamp:true,
        timezone:'+08:00'
    });

var school_teacher_design_student = sequelize.define('school_teacher_design_student',
    {
        id: {
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            unique:true
        },
        school: {
            type: Sequelize.INTEGER
        },
        teacher: {
            type: Sequelize.INTEGER
        },
        design: {
            type: Sequelize.INTEGER
        },
        student: {
            type: Sequelize.INTEGER
        }
    }
);

school_teacher_design_student.sync();

// 1.获取学校和老师之间的关系
var school_teacherSql =
    `
    SELECT u.id, u.schoolId
        FROM ecp.user u
        RIGHT JOIN project.school s ON u.schoolId = s.id
        WHERE u.schoolId <> ''
        AND s.id <>0
        AND u.isTeacher =1
    `;
    var getSchoolTeacher = function() {
        var getSchoolTeacherP = new Promise(function(resolve,reject) {
            sequelize.query(
                school_teacherSql,
                {
                    type:sequelize.QueryTypes.SELECT
                }
            ).then(function (projects) {
                // var mapedprojects = projects.map(function(item){
                //     return item.id;
                // });

                // var keyByProjects = _.keyBy(projects, 'schoolId');
                // console.log(keyByProjects);

                // projects = _.groupBy(projects,function(o){
                //     return o.schoolId;
                // });
                return resolve(projects);

                // console.log(projects,'grouped');
                // {
                // '2640':
                // [ { id: 1190, schoolId: 2640 },
                //     { id: 7942, schoolId: 2640 },
                //     { id: 17611, schoolId: 2640 },
                //     { id: 18793, schoolId: 2640 },
                //     { id: 18795, schoolId: 2640 },
                //     { id: 18797, schoolId: 2640 },
                //     { id: 18798, schoolId: 2640 },
                //     { id: 18799, schoolId: 2640 },
                //     { id: 18801, schoolId: 2640 },
                //     { id: 18802, schoolId: 2640 } ] }

                // _.forEach(projects,function(value,key){
                //     // console.log(key, '- - - - - -', value);
                //     vmped = value.map(function(v){
                //         return v.id;
                //     });
                //     // console.log(vmped);
                //
                //     console.log('学校id:'+key,'老师个数:'+vmped.length);
                //
                //     _.forEach(vmped,function(vap){
                //         console.log(' - -  老师id:'+vap);
                //     });
                //
                //     // var scollectionSql = 'select * from project.scollection where authorid='+key;
                //     // sequelize.query(
                //     //     scollectionSql,
                //     //     {
                //     //         type:sequelize.QueryTypes.SELECT
                //     //     }
                //     // ).then();
                //
                // });
                // console.log(mapedprojects);
            }).catch(function(err){
                reject(err);
            });
        });
        return getSchoolTeacherP;
    };

//2.获取老师和毕设课设的关系
var teacher_scollectionSql =
    `
    SELECT s.id,s.authorid as teacherid,s.designtype
        FROM project.scollection s
        RIGHT JOIN ecp.user u ON s.authorid = u.id
        WHERE u.isTeacher=1
        and s.designtype in (2,3)
    `;

// `
//     SELECT s.authorid as teacherid,s.designtype,count(s.designtype) as scollectionnum
//         FROM project.scollection s
//         RIGHT JOIN ecp.user u ON s.authorid = u.id
//         WHERE u.isTeacher=1
//         and s.designtype in (2,3)
//         group by teacherid,designtype
//         order by teacherid,designtype
//     `;

    var getTeacherScollection = function() {
        var getTeacherScollectionP = new Promise(function(resolve,reject) {
            sequelize.query(
                teacher_scollectionSql,
                {
                    type:sequelize.QueryTypes.SELECT
                }
            ).then(function(scollections){
                resolve(scollections);
            }).catch(function(err) {
                reject(err);
            })
        });
        return getTeacherScollectionP;
    }

//3.获取毕设课设与学生之间的关系
var scollection_studentSql =
    // `
    // SELECT scollectionid,count(scollectionid) as studentnums FROM project.scollection_user group by scollectionid
    // `;

    `
    SELECT scollectionid,uid FROM project.scollection_schedule
    `;
var getScollectionStudent = function() {
    var getScollectionStudentP = new Promise(function(resolve,reject) {
        sequelize.query(
            scollection_studentSql,
            {
                type:sequelize.QueryTypes.SELECT
            }
        ).then(function(scollections){
            resolve(scollections);
        }).catch(function(err) {
            reject(err);
        })
    });
    return getScollectionStudentP;
}

function* do_analyse() {
    Promise.all(
        [getSchoolTeacher(),getTeacherScollection(),getScollectionStudent()]
    ).then(function(values) {

        /*
         [
         { id: 17, schoolId: 30 },
         { id: 36, schoolId: 30 }
         ]
         */
        var school_teacher = values[0];
        /*
         [
         { teacherid: 1, designtype: 2, scollectionnum: 747 },
         { teacherid: 1, designtype: 3, scollectionnum: 434 }
         ]
         */
        var teacher_scollection = values[1];
        /*
         [
         { scollectionid: 84, studentnums: 44 },
         { scollectionid: 85, studentnums: 41 },
         { scollectionid: 88, studentnums: 11 }
         ]
         */
        var scollection_student = values[2];
        /*
         {
         '2640':
         [ { id: 1190, schoolId: 2640 },
         { id: 7942, schoolId: 2640 },
         { id: 17611, schoolId: 2640 },
         { id: 18793, schoolId: 2640 },
         { id: 18795, schoolId: 2640 },
         { id: 18797, schoolId: 2640 },
         { id: 18798, schoolId: 2640 },
         { id: 18799, schoolId: 2640 },
         { id: 18801, schoolId: 2640 },
         { id: 18802, schoolId: 2640 } ]
         }
         */
        school_teacher = _.groupBy(school_teacher,function(o){
            return o.schoolId;
        });


        var school;
        var teacher;
        var design;
        var student;
        var onedesign;
        var onestudent;
        var stu_arr;


        var school_count = 0;
        var teacher_count = 0;
        var design_count = 0;
        var submit_count = 0;
        var stu_count = 0;

        _.forEach(school_teacher,function(value,key){
            // console.log(key, '- - - - - -', value);
            /*
             [
             7942,
             17611
             ]
             */
            //学校id
            school = key;
            school_count++;

            vmped = value.map(function(v){
                return v.id;
            });
            //教师个数
            teacher = vmped.length;
            teacher_count += teacher;

            var counted_teacher_scollection = _.countBy(teacher_scollection, 'teacherid');

            var counted_scollection_student = _.countBy(scollection_student,'scollectionid');

            console.log('学校id:'+key,'老师个数:'+vmped.length);
            logger.router('学校id:'+key,'老师个数:'+vmped.length);

            design = 0;
            student = 0;
            stu_arr = [];

            _.forEach(vmped,function(vap){
                onedesign = counted_teacher_scollection[vap];
                if(onedesign&&onedesign!='undefined'){
                    console.log(' - -  老师id:'+vap,'老师课程数:'+onedesign);
                    logger.router(' - -  老师id:'+vap,'老师课程数:'+onedesign);
                    design += onedesign;
                }else {
                    console.log(' - -  老师id:'+vap,'老师课程数:'+0);
                    logger.router(' - -  老师id:'+vap,'老师课程数:'+0);
                }



                _.forEach(teacher_scollection,function(ts) {
                    if(vap == ts.teacherid) {
                        console.log('designid为:',ts.id);
                        logger.router('designid为:',ts.id);


                        onestudent = counted_scollection_student[ts.id];
                        if(onestudent&&onestudent!='undefined') {
                            console.log('本课程学生提交数量:',onestudent);
                            logger.router('本课程学生提交数量:',onestudent);
                            student += onestudent;
                        }else {
                            console.log('本课程学生提交数量:',0);
                            logger.router('本课程学生提交数量:',0);
                        }

                        _.forEach(scollection_student,function(ss) {
                            if(ts.id == ss.scollectionid) {
                                stu_arr.push(ss.uid);
                            }
                        });

                    }
                });

            });
            console.log('|||总课程数:' + design);
            logger.router('|||总课程数:' + design);
            console.log('|||总学生选课数:' + student);
            logger.router('|||总学生选课数:' + student);

            stu_arr = _.uniq(stu_arr, true);
            console.log('|||学生列表:', stu_arr);
            logger.router('|||学生列表:', stu_arr);


            design_count += design;
            submit_count += student;
            stu_count += stu_arr.length;

            school_teacher_design_student.create({
                school: school,
                teacher: teacher,
                design: design,
                student: stu_arr.length
            });

        });


        logger.router('---- ---- ---- ---- ---- ----');
        logger.router('学校数:',school_count);
        logger.router('教师数:',teacher_count);
        logger.router('设计数:',design_count);
        logger.router('学生数:',stu_count);
        logger.router('总提交数:',submit_count);
        logger.router('---- ---- ---- ---- ---- ----');

        console.log('---- ---- ---- ---- ---- ----');
        console.log('学校数:',school_count);
        console.log('教师数:',teacher_count);
        console.log('设计数:',design_count);
        console.log('学生数:',stu_count);
        console.log('总提交数:',submit_count);
        console.log('---- ---- ---- ---- ---- ----');
    });
}

module.exports = do_analyse;