const express = require("express")
const app = express()
app.use(express.json())

// import model
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const meja = models.meja

// import auth  
// const auth = require("../auth")
// const jwt = require("jsonwebtoken")
// const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL TRANSAKSI, METHOD: GET, FUNCTION: findAll
app.get("/", async (req, res) => {
    let result = await transaksi.findAll({
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']]
    })
    res.json({
        count: result.length,
        transaksi: result
    })
})

// GET TRANSAKSI by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", async (req, res) => {
    let param = { id_transaksi: req.params.id }
    let result = await transaksi.findAll({
        where: param,
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ]
    })
    let sumTotal = await transaksi.sum('total', {
        where:
            param
        // dibayar: "Lunas",
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
    // res.json(result)
})

// GET TRANSAKSI by USER, METHOD: GET, FUNCTION: findAll
app.get("/user/:id", async (req, res) => {
    let param = { id_user: req.params.id }
    let result = await transaksi.findAll({
        where: param,
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ]
    })
    let sumTotal = await transaksi.sum('total', {
        where:
            param
        // dibayar: "Lunas",
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
    // res.json(result)
})

// POST TRANSAKSI, METHOD: POST, FUNCTION: create
// POST DETAIL TRANSAKSI, METHOD: POST, FUNCTION: bulkCreate
app.post("/", async (req, res) => {
    let current = new Date().toLocaleDateString('en-CA');
    let data = {
        tgl_transaksi: current,
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        // status: req.body.status,
        status: "Belum bayar",
        total: req.body.total
    }
    let param = {
        id_meja: req.body.id_meja
    }
    let upmeja = {
        available: "No"
    }
    await meja.update(upmeja, ({ where: param }))
    transaksi.create(data)
        .then(result => {
            let lastID = result.id_transaksi
            console.log(lastID)
            detail = req.body.detail_transaksi
            console.log(detail)
            // perulangan untuk data detail_transaksi
            detail.forEach(element => {
                element.id_transaksi = lastID
            });
            detail_transaksi.bulkCreate(detail)
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
        })
})

// UPDATE DETAIL TRANSAKSI, METHOD: POST, FUNCTION: update
app.post("/detail/:id_transaksi", (req, res) => {
    // let param = { id_transaksi: req.params.id }
    let detail = {
        id_transaksi: req.body.id_transaksi,
        id_menu: req.body.id_menu,
        harga: req.body.harga,
        qty: req.body.qty,
        subtotal: req.body.subtotal
    }
    detail_transaksi.create(detail)
    .then(result => {
        let lastID = result.id_transaksi
        console.log(lastID)
        let data = {
            total: result.subtotal
        }
        transaksi.update(data, { where: { id_transaksi: lastID } })
        // transaksi.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data total has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

// UPDATE STATUS TRANSAKSI, METHOD: POST, FUNCTION: update
app.post("/status/:id", async (req, res) => {
    let param = {
        id_transaksi: req.params.id
    }
    let data = {
        status: req.body.status
    }
    let parammeja = {
        id_meja: req.body.id_meja
    }
    let upmeja = {
        available: "Yes"
    }
    if (req.body.status === "Lunas") {
        await meja.update(upmeja, ({ where: parammeja }))
        transaksi.update(data, { where: param })
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
    } else {
        res.json({
            message: "Data can not be updated"
        })
    }
    // await meja.update(upmeja, ({ where: parammeja }))
    // transaksi.update(data, { where: param })
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

// DELETE TRANSAKSI, METHOD: DELETE, FUNCTION: destroy 
app.delete("/:id", async (req, res) => {
    let param = { id_transaksi: req.params.id }
    try {
        await detail_transaksi.destroy({ where: param })
        await transaksi.destroy({ where: param })
        res.json({
            message: "Data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

// Search transaksi 
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await transaksi.findAll({
        where: {
            // id_user: req.params.id_user,
            [Op.or]: [
                {
                    id_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    status: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_pelanggan: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$user.nama_user$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']]
    })
    let sumTotal = await transaksi.sum('total', {
        where: {
            // id_user: req.params.id_user,
            [Op.or]: [
                {
                    id_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    status: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_pelanggan: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$user.nama_user$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "user",
            // "meja",
            // {
            //     model: models.detail_transaksi,
            //     as: "detail_transaksi",
            //     include: ["menu"]
            // }
        ],
        order: [['id_transaksi', 'DESC']]
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})

app.post("/date", async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)
    let result = await transaksi.findAll({
        where: {
            // outlet_id: req.params.outlet_id,
            // dibayar: "Lunas",
            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']],
    })
    let sumTotal = await transaksi.sum('total', {
        where: {
            // outlet_id: req.params.outlet_id,
            // dibayar: "Lunas",
            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        },
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})

module.exports = app

// async = asyncronus, untuk menjalankan data  secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati