
exports.getDay = function () {

    return new Date().toLocaleString('en-us', { weekday: 'long', month: "long", day: "numeric", })
}
exports.getFullDay = function () {

    return new Date().toLocaleString('en-us', { weekday: 'long' })
}

// module.exports.getDay = getDay;
// module.exports.getFullDay = getFullDay;
