// import library 
const express = require('express');
const bodyParser = require('body-parser');

// implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import model
const models = require('../models/index');
const meja = models.meja;
const transaksi = models.transaksi;

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL MEJA, METHOD: GET, FUNCTION: findAll
app.get("/", auth, async (req, res) => {
    let result = await meja.findAll()
    res.json({
        count: result.length,
        meja: result
    })
})

// GET MEJA by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", auth, async (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    let result = await meja.findOne({
        where: param
    })
    res.json({
        meja: result
    })
})

// ADD MEJA, METHOD: POST, FUNCTION: create
app.post("/", auth, async (req, res) => {
    try {
        let nomor_meja = req.body.nomor_meja;
        let existingMeja = await meja.findOne({ where: { nomor_meja: nomor_meja } });
        if (existingMeja) {
            return res.json({
                message: "Nomor meja already exists"
            })
        }
        let data = {
            nomor_meja: nomor_meja,
            available: req.body.available
        };
        let createdMeja = await meja.create(data);
        return res.json({
            message: "Data has been inserted"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    // let data = {
    //     nomor_meja: req.body.nomor_meja,
    //     available: req.body.available
    // }
    // meja.create(data)
    //     .then(result => {
    //         res.json({
    //             message: "Data has ben inserted"
    //         })
    //     })
    //     .catch(error => {
    //         res.json({
    //             message: error.message
    //         })
    //     })
})

// UPDATE MEJA, METHOD: PUT, FUNCTION: update
app.put("/:id", auth, async (req, res) => {
    // try {
        let id_meja = parseInt(req.params.id);
        let nomor_meja = req.body.nomor_meja;
        let existingMeja = await meja.findOne({ where: { nomor_meja: nomor_meja } });
        if (existingMeja && existingMeja.id_meja !== id_meja) {
            return res.json({
                message: "Nomor meja already exists"
            })
        }
        let data = {
            nomor_meja: nomor_meja,
            available: req.body.available
        };
        let options = {
            where: { id_meja: id_meja }
        };
        let updatedMeja = await meja.update(data, options);
        return res.json({
            message: "Data has been updated"
        });
    // } 
    // catch (error) {
    //     return res.status(500).json({
    //         message: error.message
    //     });
    // }

    // let param = {
    //     id_meja: req.params.id
    // }
    // let data = {
    //     nomor_meja: req.body.nomor_meja,
    //     available: req.body.available
    // }
    // meja.update(data, { where: param })
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

// DELETE MEJA, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", auth, async (req, res) => {
    try {
        let param = { id_meja: req.params.id }
        const row = await transaksi.findOne({ where: param })
        if (row !== null) {
            res.json({
                message: "Data can not be deleted",
            })
        }
        else {
            let result = await meja.findOne({ where: param })
            meja.destroy({ where: param })
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

// SEARCH MEJA, METHOD: POST, FUNCTION: findAll
app.post("/search", auth, async (req, res) => {
    let keyword = req.body.keyword
    let result = await meja.findAll({
        where: {
            [Op.or]: [
                {
                    id_meja: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nomor_meja: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    available: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
    })
    res.json({
        meja: result
    })
})

// SEARCH MEJA by AVAILABLE "Yes", METHOD: POST, FUNCTION: findAll
// app.post("/search/table", auth, async (req, res) => {
//     let keyword = req.body.keyword
//     let result = await meja.findAll({
//         where: {
//             [Op.or]: [
//                 {
//                     available: {
//                         [Op.like]: "Yes"
//                     }
//                 }
//             ]
//         },
//     })
//     res.json({
//         meja: result
//     })
// })

module.exports = app;