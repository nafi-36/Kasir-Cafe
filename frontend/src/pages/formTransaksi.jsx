import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import axios from 'axios'

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            nama_user: "",
            id_meja: "",
            nomor_meja: "",
            nama_pelanggan: "",
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
            // tgl_transaksi: null,
            status: "Belum bayar",
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("id_meja") !== null && localStorage.getItem("cart") !== null) {
                if (localStorage.getItem("role") === "Kasir") {
                    this.state.token = localStorage.getItem("token")
                    this.state.id_user = localStorage.getItem("id_user")
                    this.state.id_meja = localStorage.getItem("id_meja")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Belum memilih meja / Cart kosong")
                window.location = '/selectTable'
            }
        }
        else {
            window.location = '/login'
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getUserId = () => {
        let url = "http://localhost:9090/user/" + this.state.id_user

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    nama_user: res.data.user.nama_user,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMejaId = () => {
        let url = "http://localhost:9090/meja/" + this.state.id_meja

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    nomor_meja: res.data.meja.nomor_meja
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        // kalkulasi total harga
        let totalHarga = 0
        tempCart.map(item => {
            totalHarga += (item.harga * item.qty)
        })

        // memasukkan data cart, user, dan total harga pada state
        this.setState({
            cart: tempCart,
            total: totalHarga
        })
    }

    checkOut = (e) => {
        e.preventDefault()
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }
        let data = {
            id_user: this.state.id_user,
            id_meja: this.state.id_meja,
            nama_pelanggan: this.state.nama_pelanggan,
            // status: this.state.status,
            detail_transaksi: tempCart
        }
        let url = "http://localhost:9090/transaksi"
        axios.post(url, data, this.headerConfig())
            .then(res => {
                // clear cart
                window.alert(res.data.message)
                localStorage.removeItem("cart")
                localStorage.removeItem("id_meja")
                // localStorage.removeItem("customer")
                window.location = "/transaksi"
            })
            .catch(error => {
                if (error.res) {
                    if (error.res.status) {
                        window.alert(error.res.data.message)
                        // this.props.history.push("/login")
                    }
                } else {
                    console.log(error);
                }
            })
    }

    date = () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    componentDidMount = () => {
        this.initCart()
        this.getUserId()
        this.getMejaId()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h3 className="text-center mb-4">From Transaksi Laundry</h3><hr />
                                    <form className="forms-sample mt-4" onSubmit={e => this.checkOut(e)}>
                                        {/* <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Outlet</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="admin_id" className="form-control" value={this.state.outlet_name} disabled />
                                            </div>
                                        </div> */}
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nama pelanggan</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="nama_pelanggan" className="form-control mb-2" onChange={e => this.setState({ nama_pelanggan: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kasir</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="nama_user" className="form-control" value={this.state.nama_user} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Meja</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="id_meja" className="form-control" value={this.state.nomor_meja} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl" className="form-control" value={this.date()} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status pembayaran</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="status" className="form-control mb-2" value={this.state.status} disabled />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <a className="btn btn-dark mr-2" href="/cart">Back</a>
                                            <button className="btn btn-primary" type="submit">Continue</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4 className="text-center">Detail Transaksi</h4>
                                    <table className="table table-bordered mb-3 mt-4">
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.nama_menu}</td>
                                                    <td>{item.qty}</td>
                                                    <td>Rp {item.harga}</td>
                                                    <td className="text-right">Rp {item.harga * item.qty}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}