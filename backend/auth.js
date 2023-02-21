// Berikut kode untuk authorization yaitu pengenalan user / pemberian akses pada user
// Token berbentuk string
// Header warna merah, berisi algoritma dan tipe token
// Playload warna ungu, sub : id, name : nama, iat : waktu
// Signature warna biru, untuk verifikasi, bisa menambahkan secret key 

// import jsonwebtoken
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// end-point authorization
// next = agar auth tidak dijalankan lagi (dijalankan sekali)
auth = (req, res, next) => {
    // get authorization from header
    let header = req.headers.authorization
    // get token 
    let token = header && header.split(" ")[1]
    // setting header
    let jwtHeader = {
        algorithm: "HS256"
    }
    // jika token tidak ada
    if (token == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
    // jika token ada
    else {
        jwt.verify(token, SECRET_KEY, jwtHeader, (error, user) => {
            if (error) {
                res.status(401).json({
                    message: "Invalid Token"
                })
            } else {
                console.log(user)
                next()
            }
        })
    }
}

module.exports = auth