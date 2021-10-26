exports.getchat = function (req, res) {
    // res.send("hello world");
    res.sendFile(__dirname + '/view/appchat.html');
}