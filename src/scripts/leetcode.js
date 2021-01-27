const https = require('https')

function getSubmissionCalendar(user) {
  let data = ''
  return new Promise(function(resolve, reject) {
    const req = https.request({
      hostname: 'leetcode-cn.com',
      port: 443,
      path: `/api/user_submission_calendar/${user}/`,
      method: 'GET'
    }, res => {
      res.on('data', d => {
        data += d
      })      
      res.on('end', () => {
        resolve({result: true, data: data})
      })
    })
    
    req.on('error', error => {
      resolve({result: false, errmsg: error.message});
    })
    
    req.end()
  })
}

exports.getSubmissionCalendar = getSubmissionCalendar