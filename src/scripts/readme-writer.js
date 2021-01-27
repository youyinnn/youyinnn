const leetCode = require('./leetcode')
const board = require('./yearly-contributions-board')

const fs = require('fs')
const path = require('path')
const content = []

const readmePath = path.join(__dirname, '..', '..', 'README.md')

console.log(readmePath)

leetCode.getSubmissionCalendar('youyinnn').then(function (data) {
    let obj = JSON.parse(JSON.parse(data.data))
    content.push('My LeetCode Submission Calendar\r\n')
    content.push('```\r\n')
    let _2019 = board.getYearlyBoard(2019, obj)
    for(let i = 0; i < _2019.length; i++) {
        content.push(_2019[i].join('') + '\r\n')
    }
    content.push('\r\n')
    let _2020 = board.getYearlyBoard(2020, obj)
    for(let i = 0; i < _2020.length; i++) {
        content.push(_2020[i].join('') + '\r\n')
    }
    content.push('```\r\n')
    console.log(content)
    fs.writeFile(readmePath, content.join(''), err => {
        if (err) {
          console.error(err)
          return
        }
    })
})