const bcrypt = require('bcrypt');

function encryptPass(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
    )
}

module.exports = {encryptPass}