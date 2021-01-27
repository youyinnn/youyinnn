const dayjs = require('dayjs')
var arraySupport = require("dayjs/plugin/arraySupport");
dayjs.extend(arraySupport);

const contributionBlock = [
    ' ',  // empty
    '□',  // level 1
    '■',  // level 2
]
const weekLabel = [
    '   ',
    '   ',
    'Mon',
    '   ',
    'Wed',
    '   ',
    'Fir',
    '   ',
]

function getYearlyBoard(year, data) {
    if (!data) {
        data = {}
    }
    const board = [
        [], // month
        [], // sun
        [], // mon
        [], // tur
        [], // wed
        [], // thu
        [], // fir
        [], // sat
    ]
    for (let i = 0; i < 8; i++) {
        board[i].push(weekLabel[i])
    }
    // fill frist week of this year
    for (let i = 0; i < 12; i++) {
        fillMonthly(year, i, board, data)
    }
    // for (let i = 0; i < 8; i++) {
    //     console.log(weekLabel[i], ' ', board[i].join(' '))
    // }
    return [['Year',year], ...board]
}

function fillMonthly(year, month, board, data) {
    const fristDayOfTheMonth = dayjs([year, month, 1])
    for (let i = 1; i <= fristDayOfTheMonth.day(); i++) {
        board[i].push(contributionBlock[0])
    }
    let dayCount = 0
    let currentDay = fristDayOfTheMonth.add(dayCount, 'day')
    for (let i = fristDayOfTheMonth.day() + 1; i <= 7; i++) {
        if (data[currentDay.add(8, 'hour').unix()] !== undefined) {
            board[i].push(contributionBlock[2])
        } else {
            board[i].push(contributionBlock[1])
        }
        currentDay = currentDay.add(1, 'day')
    }
    let weekCount = 1
    while (currentDay.month() === month) {
        for (let i = 1; i <= 7; i++) {
            if (currentDay.month() === month) {
                if (data[currentDay.add(8, 'hour').unix()] !== undefined) {
                    board[i].push(contributionBlock[2])
                } else {
                    board[i].push(contributionBlock[1])
                }
            } else {
                board[i].push(contributionBlock[0])
            }
            currentDay = currentDay.add(1, 'day')
        }
        weekCount++
    }
    board[0].push(fristDayOfTheMonth.format('MMM'))
    for(let i = 0; i < weekCount - 3; i++) {
        board[0].push(' ')
    }
    for (let i = 0; i <= 7; i++) {
        board[i].push(contributionBlock[0])
    }
}

exports.getYearlyBoard = getYearlyBoard
// let data = JSON.parse("{\"1591056000\":31,\"1591142400\":14,\"1591228800\":22,\"1591315200\":3,\"1591401600\":3,\"1591488000\":17,\"1591574400\":8,\"1591660800\":5,\"1591747200\":6,\"1591833600\":5,\"1591920000\":11,\"1592006400\":16,\"1592092800\":7,\"1592179200\":1,\"1592265600\":6,\"1592352000\":3,\"1592438400\":7,\"1592524800\":19,\"1592611200\":22,\"1592697600\":45,\"1592784000\":13,\"1592870400\":34,\"1592956800\":27,\"1593043200\":31,\"1593129600\":34,\"1593216000\":19,\"1593388800\":7,\"1593475200\":30,\"1593561600\":12,\"1593648000\":41,\"1593734400\":55,\"1593820800\":50,\"1593907200\":28,\"1593993600\":15,\"1594080000\":21,\"1594166400\":19,\"1594252800\":28,\"1594339200\":21,\"1594425600\":21,\"1594512000\":4,\"1594598400\":14,\"1594684800\":28,\"1594771200\":1,\"1594944000\":3,\"1595116800\":1,\"1595721600\":4,\"1595808000\":6,\"1595894400\":3,\"1595980800\":3,\"1596240000\":13,\"1597449600\":7,\"1548892800\":1,\"1548979200\":9,\"1549065600\":13,\"1549238400\":11,\"1549324800\":26,\"1550275200\":9,\"1550361600\":5,\"1550448000\":23,\"1550534400\":41,\"1550620800\":13,\"1550707200\":10,\"1550793600\":15,\"1550966400\":10,\"1551052800\":3,\"1551312000\":5,\"1551398400\":3,\"1551484800\":7,\"1551657600\":17,\"1551830400\":15,\"1551916800\":25,\"1552003200\":36,\"1552089600\":18,\"1552176000\":19,\"1552435200\":5,\"1552521600\":4,\"1552694400\":1,\"1552780800\":26,\"1552953600\":17,\"1553040000\":14,\"1553126400\":38,\"1553212800\":30,\"1553299200\":8,\"1553385600\":10,\"1553472000\":2,\"1553558400\":6,\"1553644800\":33,\"1553731200\":9,\"1553904000\":11,\"1553990400\":9,\"1554163200\":9,\"1554249600\":10,\"1554336000\":11}")
// print(2020, null)
// print(2019, null)
