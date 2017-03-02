/**
 * Created by massivcode on 2017. 3. 2..
 */
var jwt = require('jsonwebtoken');
const secretKey = 'secret_key';
const expiredLater = 60 * 60 * 24 * 1000;

module.exports.generateToken = function (email) {
    var iat = Date.now();

    var token = jwt.sign({
        iat: iat,
        exp: iat + expiredLater,
        email: email
    }, secretKey);

    // 비동기 방식으로 토큰을 생성하는 경우에는 비밀키 다음에 암호화 방식을 지정해야만 한다.
    // jwt.sign({iat: iat, exp: iat + expiredLater, email: email}, secretKey, {algorithm} ,function (err, token) {
    //     if (err) {
    //         return callback(false, err, null);
    //     }
    //
    //     return callback(true, null, token);
    // });

    return token;
};

module.exports.verifyToken = function (token, callback) {
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            return callback(false, err);
        } else {
            var iat = Date.now();

            if (iat > decoded.exp) {
                return callback(false, '토큰이 만료되었습니다!');
            }

            return callback(true, null);
        }
    });
};