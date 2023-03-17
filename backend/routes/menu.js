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
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

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
app.get("/", auth, (req, res) => {
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
app.get("/:id", auth, (req, res) => {
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
app.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        let harga = req.body.harga;
        let nama_menu = req.body.nama_menu;
        let existingMenu = await menu.findOne({ where: { nama_menu: nama_menu } });
        if (existingMenu) {
            return res.json({
                message: "Nama menu already exists"
            })
        }
        if (!req.file) {
            res.json({
                message: "No uploaded file"
            })
        }
        if (harga < 1) {
            return res.json({
                message: "Harga tidak boleh 0 atau minus"
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
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

// UPDATE MENU, METHOD: PUT, FUNCTION: update
app.put("/:id", auth, upload.single("image"), async (req, res) => {
    try {
        let id_menu = parseInt(req.params.id);
        let nama_menu = req.body.nama_menu;
        let harga = req.body.harga;
    
        let existingMenu = await menu.findOne({ where: { nama_menu: nama_menu } });
        if (existingMenu && existingMenu.id_menu !== id_menu) {
            return res.json({
                message: "Nama menu already exists"
            })
        } 
        if (harga < 1) {
            return res.json({
                message: "Harga tidak boleh 0 atau minus"
            })
        }
        let data = {
            nama_menu: nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga
        };

        if (req.file) {
            // get data by id
            const row = await menu.findOne({ where: { id_menu: id_menu } })
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

        let options = {
            where: { id_menu: id_menu }
        };

        let updatedMenu = await menu.update(data, options);
        return res.json({
            message: "Data has been updated"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
    // let param = {
    //     id_menu: req.params.id
    // }
    // let data = {
    //     nama_menu: req.body.nama_menu,
    //     jenis: req.body.jenis,
    //     deskripsi: req.body.deskripsi,
    //     harga: req.body.harga
    // }
    // if (req.file) {
    //     // get data by id
    //     const row = menu.findOne({ where: param })
    //         .then(result => {
    //             let oldFileName = result.image  // hasil gambar kita dapatkan dari database disimpan

    //             // delete old file 
    //             let dir = path.join(__dirname, "../image/menu", oldFileName)    // direktori gambar
    //             // menghapus sebuah file dari sistem
    //             fs.unlink(dir, err => console.log(err))
    //         })
    //         .catch(error => {
    //             console.log(error.message)
    //         })
    //     // set new filename (image)
    //     data.image = req.file.filename
    // }

    // menu.update(data, { where: param })
    //     .then(result => {
    //         res.json({
    //             message: "Data has been updated"
    //         })
    //     })
    //     .catch(error => {
    //         res.json({
    //             message: error.message
    //         })
    //     })
})

// DELETE MENU, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", auth, async (req, res) => {
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

// SEARCH MENU makanan, METHOD: POST, FUNCTION: findAll
app.get("/search/makanan", auth, async (req, res) => {
    // let keyword = req.body.keyword
    let param = {
        jenis: "Makanan"
    }
    let result = await menu.findAll({ where: param })
    res.json({
        menu: result
    })
})

// SEARCH MENU makanan, METHOD: POST, FUNCTION: findAll
app.get("/search/minuman", auth, async (req, res) => {
    // let keyword = req.body.keyword
    let param = {
        jenis: "Minuman"
    }
    let result = await menu.findAll({ where: param })
    res.json({
        menu: result
    })
})

// SEARCH MENU, METHOD: POST, FUNCTION: findAll
app.post("/search", auth, async (req, res) => {
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

// GET MENU by QTY, METHOD: GET, FUNCTION: findAll
app.get("/search/favorite", auth, async (req, res) => {
    try {
        const result = await detail_transaksi.findAll({
            attributes: [
                'id_menu',
                [models.sequelize.fn('sum', models.sequelize.col('qty')), 'total_penjualan']
            ],
            include: [{
                model: menu,
                as: 'menu',
                // where: {jenis: 'Makanan'}
                attributes: ['nama_menu']
            }],
            group: ['id_menu'],
            order: [
                [models.sequelize.fn('sum', models.sequelize.col('qty')), 'DESC']
            ],
            limit: 6,
        });
        res.status(200).json({ menu: result });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET MENU by QTY, METHOD: GET, FUNCTION: findAll
app.get("/search/least", auth, async (req, res) => {
    try {
        const result = await detail_transaksi.findAll({
            attributes: [
                'id_menu',
                [models.sequelize.fn('sum', models.sequelize.col('qty')), 'total_penjualan']
            ],
            include: [{
                model: menu,
                as: 'menu',
                // where: {jenis: 'Makanan'}
                attributes: ['nama_menu']
            }],
            group: ['id_menu'],
            order: [
                [models.sequelize.fn('sum', models.sequelize.col('qty'))]
            ],
            limit: 6,
        });
        res.status(200).json({ menu: result });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = app;