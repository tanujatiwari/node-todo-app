module.exports.currDate = async () => {
    let ts = new Date();
    let date = ts.getDate();
    let month = ts.getMonth();
    let year = ts.getFullYear();
    return year + "-" + month + "-" + date;
}