import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import axios from 'axios'

export default class Cart extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            nama_user: "",
            id_meja: "",
            meja: [],
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
        }

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem("token")
                this.state.id_user = localStorage.getItem('id_user')
                this.state.nama_user = localStorage.getItem('nama_user')
                this.state.id_meja = localStorage.getItem('id_meja')
            } else {
                window.alert("Anda bukan Kasir")
                window.location = "/"
            }
            // this.state.id = localStorage.getItem("id_user")
        } else {
            window.location = "/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getMeja = () => {
        let url = "http://localhost:9090/meja/" + this.state.id_meja

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    meja: res.data.meja
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

    editItem = selectedItem => {
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        let index = tempCart.findIndex(it => it.id_menu === selectedItem.id_menu)
        let promptJumlah = window.prompt(`Masukkan jumlah ${selectedItem.nama_menu} yang ingin dibeli`, selectedItem.qty)
        if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
            window.alert("Tidak boleh kosong")
        } else {
            tempCart[index].qty = promptJumlah
            tempCart[index].subtotal = selectedItem.harga * promptJumlah
        }
 
        // update localStorage
        localStorage.setItem("cart", JSON.stringify(tempCart))

        // refresh cart
        this.initCart()
    }

    dropItem = selectedItem => {
        if (window.confirm(`Apakah Anda yakin menghapus ${selectedItem.nama_menu} dari cart?`)) {
            let tempCart = []
            if (localStorage.getItem("cart") !== null) {
                tempCart = JSON.parse(localStorage.getItem("cart"))
            }

            let index = tempCart.findIndex(it => it.id_menu === selectedItem.id_menu)
            tempCart.splice(index, 1)

            // update localStorage
            localStorage.setItem("cart", JSON.stringify(tempCart))

            // refresh cart
            this.initCart()
        }
    }

    Checkout = () => {
        window.location = '/formTransaksi'
    }

    componentDidMount = () => {
        this.initCart()
        this.getMeja()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                        <h3 className="mt-0 ">Data Keranjang Transaksi</h3>
                            <hr />
                            <div className="card col-12 mt-4 mb-4">
                                <h3 className="text-center mt-3">Cart List</h3>
                                <hr />
                                {this.state.cart.length === 0 ? (
                                    <div className="mb-3">
                                        <h4 className="mb-4">Cart is empty !</h4>
                                        <a href="/selectTable" className="btn btn-primary">Add Cart</a>
                                    </div>
                                ) : (
                                <div className="card-body text-white mt-0">
                                    <div className="text-dark mb-4">
                                        <h6>Kasir: {this.state.nama_user}</h6>
                                        <h6>Meja: {this.state.meja.nomor_meja}</h6>
                                    </div>
                                    <table className="table table-bordered mb-3">
                                        <thead>
                                            <tr>
                                                <th>Paket</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.nama_menu}</td>
                                                    <td>{item.qty}</td>
                                                    <td>Rp {item.harga}</td>
                                                    <td className="text-right">Rp {item.harga * item.qty}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary m-1"
                                                            onClick={() => this.editItem(item)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-danger m-1"
                                                            onClick={() => this.dropItem(item)}>
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning btn-block m-1"
                                                        onClick={this.Checkout}
                                                        disabled={this.state.cart.length === 0}>
                                                        Checkout
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="/selectMenu" className="btn btn-primary">Add Cart</a>
                                </div>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
} 