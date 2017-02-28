/**
 * Created by massivcode on 2017. 2. 28..
 */
var pool = require('../config/databaseConfiguration').pool;

/**
 * Node.js 의 대부분의 기능들은 철저한 비동기 방식으로 구현됩니다.
 *
 * 마지막 파라미터 보시면 callback => 콜백 메소드
 */
module.exports.duplicateCheck = function (email, callback) {
    const sql = "SELECT * FROM member WHERE email = ?";

    // Connection Pool 에서 Connection 을 가져온다.
    pool.getConnection(function (err, connection) {
        if (err) {
            // getConnection 에서 err 예외가 발생한 경우는 주로, 계정 정보가 틀리거나 db 가 죽어있을 때
            callback("DbError", null);
            connection.release();
        } else {
            // 실제 db에 쿼리 날리는 부분
            // 첫번째 파라미터 (고정) : SQL 문
            // 두번째 파라미터 (가변) : 배열로서 선언을 하는데, SQL 문에서 ? 의 개수만큼 값을 넣어 줘야 문제가 안생긴다.
            // 세번째 파라미터 (고정) : 콜백 메소드로서 err (예외 관련 객체), rows (쿼리 결과 객체)
            connection.query(sql, [email], function (err, rows) {
                // 쿼리를 날렸는데 예외가 발생한다. 무슨 예외일까?
                // 쿼리문 자체에 문제가 있을 때
                if (err) {
                    callback("SqlError", null);
                    // 사용한 connection 객체를 connection pool 에 반환한다.
                    connection.release();
                } else {
                    // 중복이 아니다
                    if (rows.length == 0 || rows == null) {
                        callback(null, true);
                        connection.release();
                    } else { // 중복이다
                        callback(null, false);
                        connection.release();
                    }
                }
            })
        }
    })
};

module.exports.join = function (email, password, callback) {
    const sql = "INSERT INTO member (email, password) VALUES (?, ?)";

    pool.getConnection(function (err, connection) {
        if (err) {
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [email, password], function (err, rows) {
                if (err) {
                    callback("SqlError", null);
                    connection.release();
                } else {
                    callback(null, true);
                    connection.release();
                }
            })
        }
    })
};

module.exports.login = function (email, password, callback) {
    const sql = "SELECT * FROM member WHERE email = ? AND password = ?";

    pool.getConnection(function (err, connection) {
        if (err) {
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [email, password], function (err, rows) {
                if (err) {
                    callback("SqlError", null);
                    connection.release();
                } else {
                    if (rows.length == 0 || rows == null) {
                        callback(null, false);
                        connection.release();
                    } else {
                        callback(null, true);
                        connection.release();
                    }
                }
            })
        }
    })
};