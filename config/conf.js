/**
 * Created by kevin on 16/10/23.
 */
const path = require('path');
let log = {
    dir: path.join(__dirname,'../public', 'logs'),
    categories:['router'],
    format:'YYYY-MM-DD-[{category}][.log]'
};

let conf = {
    log: log
}

module.exports = conf;