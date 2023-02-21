// import library
const express = require('express');
const cors = require('cors');

// implementasi library
const app = express();
app.use(cors());

// import end-point user
const user = require('./routes/user')
app.use("/user", user)

// import end-point menu
const menu = require('./routes/menu')
app.use("/menu", menu)

// import end-point meja
const meja = require('./routes/meja')
app.use("/meja", meja)

// import end-point transaksi
const transaksi = require('./routes/transaksi')
app.use("/transaksi", transaksi)

app.use(express.static(__dirname))

app.listen(9090, () => {
    console.log('server run on port 9090')
})