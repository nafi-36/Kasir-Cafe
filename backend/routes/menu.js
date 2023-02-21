const express = require("express");
const app = express();
app.use(express.json())

// import multer, path, file system
const multer = require("multer")
const path = require("path")
const fs = require("fs")            // file sistem (mengakses file tersebut), membaca file sistem (dimana file itu) 

// import models
const models = require('../models/index')
const menu = models.menu
const detail_transaksi = models.detail_transaksi

// import auth 
// const auth = require("../auth")
// const jwt = require("jsonwebtoken")
// const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// config storage image, membuat konfigurasi untuk menyimpan foto (dimana foto yang diinsert akan disimpan)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/menu")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
// cb(callback) setiap dijalankan call lagi / berulang 

let upload = multer({ storage: storage })    // yang diganti yang ada didalam cb

// GET ALL MENU, METHOD: GET, FUNCTION: findAll
app.get("/", (req, res) => {
    menu.findAll()
        .then(result => {
            res.json({
                count: result.length,
                menu: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// GET MENU by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", (req, res) => {
    menu.findOne({ where: { id_menu: req.params.id } })
        .then(result => {
            res.json({
                menu: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// ADD MENU, METHOD: POST, FUNCTION: create
app.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    }
    else {
        let data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            image: req.file.filename,
            harga: req.body.harga,
        }
        menu.create(data)
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

// UPDATE MENU, METHOD: PUT, FUNCTION: update
app.put("/:id", upload.single("image"), (req, res) => {
    let param = {
        id_menu: req.params.id
    }
    let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga
    }
    if (req.file) {
        // get data by id
        const row = menu.findOne({ where: param })
            .then(result => {
                let oldFileName = result.image  // hasil gambar kita dapatkan dari database disimpan

                // delete old file 
                let dir = path.join(__dirname, "../image/menu", oldFileName)    // direktori gambar
                // menghapus sebuah file dari sistem
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })
        // set new filename (image)
        data.image = req.file.filename
    }

    menu.update(data, { where: param })
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

// DELETE MENU, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", async (req, res) => {
    try {
        let param = { id_menu: req.params.id }
        const row = await detail_transaksi.findOne({ where: param })
        if (row !== null) {
            res.json({
                message: "Data can not be deleted",
            })
        } 
        else {
            let result = await menu.findOne({ where: param })
            let oldFileName = result.image
            // delete old file
            let dir = path.join(__dirname, "../image/menu", oldFileName)
            fs.unlink(dir, err => console.log(err))

            // delete data
            menu.destroy({ where: param })
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

// SEARCH MENU, METHOD: POST, FUNCTION: findAll
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await menu.findAll({
        where: {
            [Op.or]: [
                {
                    id_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    jenis: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    harga: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
    })
    res.json({
        menu: result
    })
})

module.exports = app;