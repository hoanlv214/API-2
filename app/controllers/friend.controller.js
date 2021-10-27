var User = require('../models/user.model');
var Erro = require('../moduleAll/Erro.moduleAll');

/*
tuan 6

API thực hiện việc lấy danh sách các yêu cầu kết bạn đến 
người dùng nào đó
Request dạng: POST
Tham số: token, user_id (nếu bỏ trống tức lấy danh sách bạn 
của chính người đang đăng nhập), index, count
Kết quả đầu ra: 1000|OK - Nếu thành công thì mã thông báo 
thành công được trả về, các keyword được lưu sẽ hiện ra. Nếu 
không thành công thì sẽ có các thông báo lỗi tương ứng

Chỉ chấp nhận tham số user_id nếu request là từ phía trang 
quản trị, ứng dụng nếu truyền user_id là của người khác thì sẽ
coi là không truyền tham số này.
Tham số created biểu thị thời gian người đó gửi yêu cầu kết 
bạn đến với người dùng.
Nếu tham số này không có tức là yêu cầu kết bạn này là do hệ
thống tự gợi ý

1. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác
Kết quả mong đợi: 1000 | OK (Thông báo thành công), 
gửi cho ứng dụng các thông tin cần thiết.
2. Người dùng gửi sai mã phiên đăng nhập (mã bị trống 
hoặc quá ngắn hoặc mã phiên đăng nhập cũ) còn các 
tham số khác hợp lệ.
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập.

3. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác nhưng không có kết quả nào được trả về.
Kết quả mong đợi: Hiển thị không tìm thấy kết quả nào.
4. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác. Nhưng người dùng đã bị khóa tài khoản 
(do hệ thống khóa đi).
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập.

5. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, nhưng kết quả trả về có các thông số
username hoặc id có giá trị không chuẩn. 
Kết quả mong đợi: ứng dụng phải ẩn đi các kết quả không 
hợp lệ trước khi hiện lên.
6. Người dùng truyền đúng các tham số nhưng các lời yêu 
cầu trả về không theo đúng thứ tự thời gian.
Kết quả mong đợi: ứng dụng sẽ cố gắng sắp xếp lại các kết 
quả theo đúng thứ tự.

7. Hệ thống cho phép chức năng pull down và pull up để
làm mới và thêm mới vào danh sách các yêu cầu kết bạn.
8. Hệ thống cho phép thực hiện việc cache dữ liệu ở tab này

*/

exports.get_requested_friend=function (req, res){

}

/*
API thực hiện việc đưa ra yêu cầu kết bạn từ người chủ tài khoản 
đến người dùng nào đó.
Request dạng: POST
Tham số: token, user_id
Kết quả đầu ra: 1000|OK Nếu thành công thì mã thông báo 
thành công được trả về, các keyword được lưu sẽ hiện ra. Nếu 
không thành công thì sẽ có các thông báo lỗi tương ứng

Chức năng cho phép hiển thị danh sách những người yêu cầu 
kết bạn với người dùng, danh sách gợi ý kết bạn với người 
dùng.
Người dùng có thể chọn kết bạn hoặc từ chối các yêu cầu đó

1. Tài khoản người dùng bị khóa khi xử lí lời mời kết bạn 
(do hệ thống khóa đi mất)
Kết quả mong đợi: ứng dụng sẽ chuyển sang trang đăng 
nhập.
2. Người kết bạn bị khóa trước khi người dùng xử lí (do hệ
thống khóa đi mất)
Kết quả mong đợi: thông báo kết bạn không thành công.

3. Người dùng ấn kết bạn và hệ thống lưu dữ liệu thành 
công.
Kết quả mong đợi: thông báo kết bạn thành công khi 
chấp nhận lời mời hoặc thông báo gửi lời mời kết bạn 
thành công ở mục gợi ý kết bạn.
4. Người dùng đang kết nối thì Internet bị ngắt.
Kết quả mong đợi: ứng dụng cần hiện thông báo “Không 
thể kết nối Internet” càng sớm càng tốt.

5. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, nhưng không có người dùng nào có user_id 
như tham số yêu cầu. 
Kết quả mong đợi: hệ thống báo lỗi về cho ứng dụng, tùy 
tình trạng mà ứng dụng báo lên cho người dùng biết
6. Người dùng truyền đúng các tham số, hệ thống trả về
đúng kết quả, nhưng user_id là của chính người chủ tài 
khoản. 
Kết quả mong đợi: Ứng dụng phải cố gắng tự loại bỏ
trường hợp này. Nếu lỡ truyền lên server thì hệ thống 
phải báo lỗi về cho ứng dụng, tùy tình trạng mà ứng dụng 
báo lên cho người dùng biết.

*/

exports.set_request_friend=function (req, res){
    var token = req.body.token;
    var user_id = req.body.user_id;

    if (token==null||token=="undefined"||token.length==0||token==""||user_id==null||user_id=="undefined"||user_id<=0) {
        Erro.code1004(res);
    }
    else {
        User.checkToken(token, (err, userchecktoken) => {
            if (err) {
                Erro.code1001(res);
            } else {
                if (userchecktoken.length !== 0) {

                   
                } else {
                    Erro.code9998(res);
                }
            }
        })
    }
}




/*
API thực hiện việc lấy danh sách các người bạn hiện tại của 
người dùng nào đó
Phương thức: POST
Tham số: token, user_id (nếu bỏ trống tức lấy danh sách bạn 
của chính người đang đăng nhập), index, count

Kết quả đầu ra: Nếu thành công thì mã thông báo thành công 
được trả về, các keyword được lưu sẽ hiện ra. Nếu không 
thành công thì sẽ có các thông báo lỗi tương ứng
Chỉ chấp nhận tham số user_id nếu request là từ phía trang 
quản trị, ứng dụng nếu truyền user_id là của người khác thì 
sẽ coi là không truyền tham số này.

1. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác. 
Kết quả mong đợi: 1000 | OK (Thông báo thành công), 
gửi cho ứng dụng các thông tin cần thiết.


3. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác nhưng không có kết quả nào được trả về.
Kết quả mong đợi: Hiển thị không tìm thấy kết quả nào.

4. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác. Nhưng người dùng đã bị khóa tài khoản 
(do hệ thống khóa đi).
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập.

5. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, nhưng kết quả trả về có các thông số
username hoặc id có giá trị không chuẩn. 
Kết quả mong đợi: ứng dụng phải ẩn đi các kết quả không 
hợp lệ trước khi hiện lên.
6. Người dùng truyền đúng các tham số nhưng các user đã 
kết bạn trả về không theo đúng thứ tự chữ cái của tên 
người bạn. 
Kết quả mong đợi: ứng dụng sẽ cố gắng sắp xếp lại các kết 
quả theo đúng thứ tự chữ cái.

7. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác để lấy các bạn của chính mình, nhưng kết 
quả trả về có thời gian kết bạn bị sai. 
Kết quả mong đợi: ứng dụng vẫn phải hiển thị người bạn 
này, thời gian kết bạn có thể ẩn đi.
8. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, nhưng kết quả trả về có số bạn chung 
KHÔNG CHUẨN ở một số người bạn. 
Kết quả mong đợi: ứng dụng sẽ không hiển thị số bạn 
chung ở các người bạn này.

9. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác để lấy các bạn của một ai đó (khác người 
dùng), nhưng kết quả trả về có thời gian kết bạn bị sai.
Kết quả mong đợi: ứng dụng KHÔNG cần hiển thị thời 
gian kết bạn.

10. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác để lấy danh sách bạn của một ai đó (khác 
người dùng), nhưng kết quả trả về có số bạn chung 
KHÔNG CHUẨN ở một số người bạn. 
Kết quả mong đợi: ứng dụng sẽ không hiển thị số bạn 
chung ở các yêu cầu này.
11. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, và kết quả trả về có tổng số total lớn hơn 
tổng số người bạn đã được server trả về. 
Kết quả mong đợi: ứng dụng sẽ hiển thị tổng số total 
người bạn.

12. Người dùng truyền đúng mã phiên đăng nhập và các 
tham số khác, nhưng kết quả trả về có tổng số total người 
bạn bé hơn tổng số các người bạn trả về bởi các lần truy 
vấn. 
Kết quả mong đợi: ứng dụng sẽ hiển thị tổng số total là 
bằng tổng số người bạn đã nhận được sau các lần truy 
vấn.
13. Hệ thống cho phép chức năng pull down và pull up để
làm mới và thêm mới vào danh sách các bạn của một 
người dùng nào đó.

14. Trừ màn trang chủ, hệ thống KHÔNG cho phép thực hiện 
việc cache dữ liệu ở các giao diện sử dụng API này.
*/
exports.get_user_friends = function (req, res) {
    var count = req.body.count;
    var token = req.body.token;
    var index = req.body.index;
    var user_id = req.body.user_id;

    if (count == ''||count <=0  || index == ''||index <=0 || count == null || index == null || index == undefined || index == undefined) {
        Erro.code1004(res);
    }
    else {
        User.checkToken(token, (err, userchecktoken) => {
            if (err) {
                Erro.code1001(res);
            } else {
                if (userchecktoken.length !== 0) {

                   
                } else {
                    Erro.code9998(res);
                }
            }
        })
    }
}
