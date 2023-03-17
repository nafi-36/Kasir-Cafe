const express = require("express")
const app = express()
app.use(express.json())

// import model
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const meja = models.meja

// import auth  
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL TRANSAKSI, METHOD: GET, FUNCTION: findAll
app.get("/", auth, async (req, res) => {
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
    let sumTotal = await transaksi.sum('total');
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal,
    })
})

// GET TRANSAKSI by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", auth, async (req, res) => {
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
app.get("/user/:id", auth, async (req, res) => {
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
        ],
        order: [['id_transaksi', 'DESC']]
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

// GET TRANSAKSI Lunas, METHOD: GET, FUNCTION: findAll
app.get("/trans/lunas", auth, async (req, res) => {
    let result = await transaksi.findAll({
        where: { status: "Lunas" },
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
        where: { status: "Lunas" }
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})

// POST TRANSAKSI, METHOD: POST, FUNCTION: create
// POST DETAIL TRANSAKSI, METHOD: POST, FUNCTION: bulkCreate
app.post("/", auth, async (req, res) => {
    let current = new Date().toISOString().split('T')[0]
    let data = {
        tgl_transaksi: current, //current : 
        id_user: req.body.id_user, //siapa customer yang beli
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: "Belum bayar",
        total: 0 // inisialisasi nilai total awal
    }
    let param = { id_meja: req.body.id_meja }

    // Periksa apakah meja tersedia atau tidak
    let mejaData = await meja.findOne({
        where: { id_meja: req.body.id_meja, available: "Yes" },
    });
    if (!mejaData) {
        return res.json({
            message: "Meja tidak tersedia",
        });
    }

    // Periksa apakah meja masih digunakan atau tidak
    let transaksiData = await transaksi.findOne({
        where: { id_meja: req.body.id_meja, status: "Belum bayar" },
    });
    if (transaksiData) {
        return res.json({
            message: "Meja masih digunakan",
        });
    }
    let upMeja = {
        available: "No"
    }
    await meja.update(upMeja, ({ where: param }))
    transaksi.create(data)
        .then(result => {
            let lastID = result.id_transaksi
            console.log(lastID)
            detail = req.body.detail_transaksi
            let total = 0
            detail.forEach(element => {
                element.id_transaksi = lastID
                element.subtotal = element.qty * element.harga
                total += element.subtotal
            });
            console.log(detail);
            detail_transaksi.bulkCreate(detail)
                .then(result => {
                    transaksi.update({ total: total }, { where: { id_transaksi: lastID } })
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
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        })
        .catch(error => {
            console.log(error.message);
        })
})

// UPDATE DETAIL TRANSAKSI, METHOD: POST, FUNCTION: update
// app.post("/updateDetail/:id", auth, async (req, res) => {
//     let detail = req.body.detail_transaksi.map((item) => ({
//         // id_transaksi: req.body.id_transaksi,
//         id_transaksi: req.params.id,
//         id_menu: item.id_menu,
//         harga: item.harga,
//         qty: item.qty,
//         subtotal: item.harga * item.qty
//     }));
//     detail_transaksi.bulkCreate(detail)
//         .then(async (result) => {
//             let lastID = req.params.id;
//             console.log(lastID);
//             // Mengambil data transaksi berdasarkan id_transaksi
//             let transaksiData = await transaksi.findByPk(lastID);
//             if (transaksiData) {
//                 // Menghitung total baru berdasarkan detail transaksi yang baru ditambahkan
//                 let newTotal = await detail_transaksi.sum("subtotal", {
//                     where: { id_transaksi: lastID },
//                 });
//                 // Update total pada data transaksi
//                 transaksiData.total = newTotal;
//                 await transaksiData.save();
//                 res.json({
//                     message: "Data total has been updated",
//                 });
//             } else {
//                 res.json({
//                     message: "Data transaksi not found",
//                 });
//             }
//         })
//         .catch((error) => {
//             res.json({
//                 message: error.message,
//             });
//         });
// });

// UPDATE STATUS TRANSAKSI, METHOD: POST, FUNCTION: update
app.post("/status/:id", auth, async (req, res) => {
    let param = { id_transaksi: req.params.id }
    let data = {
        status: req.body.status,
        id_meja: req.body.id_meja,
    }
    // let parammeja = { id_meja: data.id_meja }
    // let upmeja = {
    //     available: "Yes"
    // }
    if (req.body.status === "Lunas") {
        let parammeja = { id_meja: data.id_meja }
        let upmeja = {
            available: "Yes"
        }
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
})

// DELETE TRANSAKSI, METHOD: DELETE, FUNCTION: destroy 
app.delete("/:id", auth, async (req, res) => {
    let param = { id_transaksi: req.params.id }
    try {
        // await meja.
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

// Search all transaksi where status lunas 
app.post("/search", auth, async (req, res) => {
    let keyword = req.body.keyword
    let result = await transaksi.findAll({
        where: {
            // id_user: req.params.id_user,
            status: "Lunas",
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
            status: "Lunas",
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

// Search transaksi for each user
app.post("/search/:id_user", auth, async (req, res) => {
    let keyword = req.body.keyword;
    let id_user = req.params.id_user;
    let result = await transaksi.findAll({
        where: {
            id_user: id_user,
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
    });
    let sumTotal = await transaksi.sum('total', {
        where: {
            id_user: id_user,
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
    });
});

// SEARCH transaksi by date
app.post("/date", auth, async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)
    let result = await transaksi.findAll({
        where: {
            status: "Lunas",
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
            status: "Lunas",
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