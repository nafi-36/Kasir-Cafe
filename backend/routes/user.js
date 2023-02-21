const express = require("express");
const app = express();
app.use(express.json())

const md5 = require('md5')  // import md5 (untuk enkripsi password)

// import multer, path, file system
const multer = require("multer")
const path = require("path")
const fs = require("fs")            // file sistem (mengakses file tersebut), membaca file sistem (dimana file itu) 

// import models
const models = require('../models/index')
const user = models.user
const transaksi = models.transaksi

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const { userInfo } = require("os");
const Op = Sequelize.Op;

// config storage image, membuat konfigurasi untuk menyimpan foto (dimana foto yang diinsert akan disimpan)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/user")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
// cb(callback) setiap dijalankan call lagi / berulang 

let upload = multer({ storage: storage })    // yang diganti yang ada didalam cb

// GET ALL USER, METHOD: GET, FUNCTION: findAll
app.get("/", auth, async (req, res) => {
    user.findAll()
        .then(result => {
            res.json({
                count: result.length,
                user: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// GET USER by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", (req, res) => {
    user.findOne({ where: { id_user: req.params.id } })
        .then(result => {
            res.json({
                user: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
// ADD USER, METHOD: POST, FUNCTION: create
app.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    }
    else {
        let data = {
            nama_user: req.body.nama_user,
            role: req.body.role,
            image: req.file.filename,
            username: req.body.username,
            password: md5(req.body.password)
        }
        user.create(data)
            .then(result => {
                res.json({
                    message: "Data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})

// UPDATE USER, METHOD: PUT, FUNCTION: update
app.put("/:id", upload.single("image"), (req, res) => {
    let param = {
        id_user: req.params.id
    }
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username
    }
    if (req.file) {
        // get data by id
        const row = user.findOne({ where: param })
            .then(result => {
                let oldFileName = result.image  // hasil gambar kita dapatkan dari database disimpan

                // delete old file 
                let dir = path.join(__dirname, "../image/user", oldFileName)    // direktori gambar
                // menghapus sebuah file dari sistem
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })
        // set new filename (image)
        data.image = req.file.filename
    }

    // if (req.body.password) {
    //     data.password = md5(req.body.password)
    // }

    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// UPDATE PASSWORD USER, METHOD: PUT, FUNCTION: update
app.put("/password/:id", (req, res) => {
    let param = {
        id_user: req.params.id
    }
    let data = {
        password: md5(req.body.password)
    }
    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// DELETE USER, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", async (req, res) => {
    try {
        let param = { id_user: req.params.id }
        const row = await transaksi.findOne({ where: param })
        if (row !== null) {
            res.json({
                message: "Data can not be deleted",
            })
        } else {
            let result = await user.findOne({ where: param })
            let oldFileName = result.image

            // delete old file
            let dir = path.join(__dirname, "../image/user", oldFileName)
            fs.unlink(dir, err => console.log(err))

            // delete data
            user.destroy({ where: param })
                .then(result => {
                    res.json({
                        message: "Data has been deleted",
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

// LOGIN USER, METHOD: POST, FUNCTION: findOne
app.post("/auth", async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    // mencari data admin yang username dan passwordnya sama dengan inputan
    let result = await user.findOne({ where: data })
    if (result) {
        // jika ditemukan, set payload data
        let payload = JSON.stringify({
            id_user: result.id_user,
            nama_user: result.nama_user,
            username: result.username
        })
        // generate token based on payload and secret key
        let token = jwt.sign(payload, SECRET_KEY)
        // set output 
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }
    else {
        // jike tidak ditemukan 
        res.json({
            logged: false,
            message: "invalid username or password"
        })
    }
})

// SEARCH USER, METHOD: POST, FUNCTION: findAll
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await user.findAll({
        where: {
            [Op.or]: [
                {
                    id_user: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_user: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    role: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
    })
    res.json({
        user: result
    })
})

module.exports = app;