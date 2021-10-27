var Erro = require('../moduleAll/Erro.moduleAll');
var User = require('../models/user.model');
var Search = require('../models/search.models');
/*

API thực hiện việc tìm kiếm người dùng hoặc tin nhắn theo 
yêu cầu của người dùng
Phương thức: POST
Input: token, id, subject và details
Kết quả đầu ra: 1000|OK - Nếu thành công thì mã thông báo 
thành công được trả về, các bài viết được tìm thấy sẽ hiện ra. 
Nếu không thành công thì sẽ có các thông báo lỗi tương ứng
Có thể người dùng viết từ khóa tùy ý nhưng ứng dụng phải 
tạo ra xâu chuẩn từ keyword

1. Người dùng truyền đúng mã phiên đăng nhập, các tham 
số khác phù hợp
Kết quả mong đợi: 1000 | OK (Thông báo thành công), 
gửi cho ứng dụng các thông tin cần thiết.
2. Người dùng gửi sai mã phiên đăng nhập (mã bị trống 
hoặc quá ngắn hoặc mã phiên đăng nhập cũ).
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập.

3. Người dùng truyền đúng mã phiên đăng nhập, các tham 
số khác phù hợp nhưng không có kết quả nào được trả về. 
Kết quả mong đợi: Hiển thị không tìm thấy kết quả nào. 
Có lẽ SV phải tự thiết kế giao diện cho trường hợp này vì 
thường Zalo sẽ luôn cố tạo ra kết quả trả về.
4. Người dùng truyền đúng mã phiên đăng nhập, và các 
tham số khác. Nhưng người dùng đã bị khóa tài khoản 
(do hệ thống khóa đi). 
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập.

5. Người dùng truyền đúng mã phiên đăng nhập, nhưng sai 
user_id của người dùng. 
Kết quả mong đợi: mã lỗi trả về báo giá trị tham số trả về
bị sai. Nhưng tất nhiên ứng dụng sẽ phải có thông báo 
khác đi
6. Người dùng truyền đúng các tham số nhưng không có 
keyword. 
Kết quả mong đợi: ứng dụng sẽ cố gắng chặn từ trước khi 
gửi lên server. Nhưng nếu lỡ gửi yêu cầu lên server thì 
server sẽ báo lỗi về tham số. Ứng dụng có thể không cần 
hiện lên thông báo gì với lỗi này.

*/

exports.addsearch = function (req, res) {
    var token = req.body.token;
    var keyword = req.body.keyword;
    var user_id = req.body.user_id;
    var index = req.body.index;
    var count = req.body.count;
    if (user_id <= 0 || user_id == null || user_id == "" || user_id == undefined || keyword.length >= 200 || keyword.length == 0 || token.length == 0 || token == undefined || keyword == undefined) {
        Erro.code1002(res);
    }
    else {
        User.checkToken(token, (err, user) => {
            if (err) {
                Erro.code1001(res);
            } else {
                if (user.length != 0) {
                    Search.search_infor(keyword, (err, data) => {
                        if (data.length != 0) {
                            var Post = [];
                            dem = 0;
                            console.log(data[0]);
                            for (let i = 0; i < data.length; i++) {
                                Search.searchContent_post(data[i], (err, getpost) => {
                                    if (err) {
                                        Erro.code1001(res);
                                    } else {
                                        Post.push(getpost[0]);
                                        dem++;
                                        if (dem == data.length) {
                                            res.send(JSON.stringify({
                                                code: 1000,
                                                message: 'ok',
                                                data: Post
                                            }));
                                        }
                                    }

                                })
                            }
                        }else{
                            res.send(JSON.stringify({
                                code: 1000,
                                message: 'ok',
                                data: "khong tim thay ket qua nao phu hop"
                            }));
                        }
                    })
                } else {
                    Erro.code9998(res);
                }
            }
        })
    }
}
