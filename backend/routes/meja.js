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

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL MEJA, METHOD: GET, FUNCTION: findAll
app.get("/",  async (req, res) => {
    let result = await meja.findAll()
    res.json({
        count: result.length,
        meja: result
    })
})

// GET MEJA by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", async (req, res) => {
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
app.post("/", (req, res) => {
    let data = {
        nomor_meja: req.body.nomor_meja,
        available: req.body.available
    }
    meja.create(data)
        .then(result => {
            res.json({
                message: "Data has ben inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// UPDATE MEJA, METHOD: PUT, FUNCTION: update
app.put("/:id", (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    let data = {
        nomor_meja: req.body.nomor_meja,
        available: req.body.available
    }
    meja.update(data, { where: param })
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

// DELETE MEJA, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    meja.destroy({ where: param })
        .then(result => {
            res.json({
                message: "Data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// SEARCH MEJA, METHOD: POST, FUNCTION: findAll
app.post("/search", async (req, res) => {
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
app.post("/search/table", async (req, res) => {
    let keyword = req.body.keyword
    let result = await meja.findAll({
        where: {
            [Op.or]: [
                {
                    available: {
                        [Op.like]: "Yes"
                    }
                }
            ]
        }, 
    })
    res.json({
        meja: result
    })
})

module.exports = app;