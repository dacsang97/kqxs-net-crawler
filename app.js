const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')
const path = require('path')
const _ = require('lodash')
const mkdirp = require('mkdirp')
const fs = require('fs')
const baseUrl = 'http://ketqua.net/xo-so-truyen-thong.php?ngay='

const crawl = () => {
    for (let day = 1; day <=31; day++)
        for (let mon = 1; mon <=12; mon++)
            for (let year = 2011; year <= 2017; year++) {
                try {
                    let str = `${day}-${mon}-${year}`
                    let x = moment(str, "DD-MM-YYYY");
                    if (x.isValid()) {
                        request(`${baseUrl}${x.format("DD-MM-YYYY")}`, function (error, response, html) {
                            if (!error && response.statusCode == 200) {
                                var $ = cheerio.load(html);
                                let table = $('table#result_tab_mb')[0]
                                let td = $(table).find('td')
                                let result = '';
                                td.each(function(id, item) {
                                    let txt = $(item).text().trim()
                                    try {
                                        let num = parseInt(txt)
                                        if (_.isNaN(num)) {
                                            result += `\n${txt}`
                                        } else {
                                            result += `-${num}`
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                })
                                let pathDir = `${year}/${mon}/${day}/${x.format("DD-MM-YYYY")}.txt`
                                fs.writeFileSync(pathDir, result, function(err) {
                                    if (err) console.log(err)
                                        else console.log(`Done ${x.format("DD-MM-YYYY")}`)
                                })
                            }
                        });
                    }
                } catch (e) {
                    console.log(e)
                }
            }
}

crawl()