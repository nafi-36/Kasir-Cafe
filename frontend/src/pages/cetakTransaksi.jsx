import React from 'react'
import axios from 'axios'

export default class CetakTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            id_transaksi: "",
            id_user: "",
            nama_user: "",
            total: 0,
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("id_transaksi") !== null) {
                if (localStorage.getItem("role") === "Kasir") {
                    this.state.token = localStorage.getItem('token')
                    this.state.id_transaksi = localStorage.getItem('id_transaksi')
                    this.state.id_user = localStorage.getItem('id_user')
                    this.state.nama_user = localStorage.getItem('nama_user')
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Klik button Detail kemudian Cetak Transaksi untuk mencetak transaksi")
                window.location = '/transaksi'
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

    getTransaksiId = () => {
        let url = "http://localhost:9090/transaksi/" + this.state.id_transaksi

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                })
                console.log(this.state.transaksi)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.harga) * Number(it.qty)
        })
        return total
    }

    componentDidMount = () => {
        this.getTransaksiId()

        setTimeout(() => {
            window.print()
        }, 500)
    }

    render() {
        return (
            <div className="col-5 mx-auto">
                <div className="card border mt-5 mb-5">
                    <div className="d-flex align-items-center justify-content-center mt-4">
                        <img src="../../images/logo.png" alt="logo" width="300" />
                    </div>
                    <hr />
                    {/* <h3 className="text-center mb-3">WIKUSAMA CAFE</h3> */}
                    <h4 className="text-center mb-2">Nota Transaksi</h4>
                    <hr />
                    <div className="ml-4">
                        <p>ID Transaksi : {this.state.id_transaksi}</p>
                        <p>Tanggal Transaksi : {this.state.transaksi.map((item, index) => {
                            return (
                                item.tgl_transaksi
                            )
                        })}</p>
                        <p>Kasir : {this.state.transaksi.map((item, index) => {
                            return (
                                item.user.nama_user
                            )
                        })}</p>
                        <p>Meja : {this.state.transaksi.map((item, index) => {
                            return (
                                item.meja.nomor_meja
                            )
                        })}</p>
                        <p>Pelanggan : {this.state.transaksi.map((item, index) => {
                            return (
                                item.nama_pelanggan
                            )
                        })}</p>
                        <p>Status Pembayaran : {this.state.transaksi.map((item, index) => {
                            return (
                                item.status
                            )
                        })}</p>
                    </div>
                    <hr />
                    <h4 className="text-center">Detail Pesanan</h4>
                    <table className="table table-bordered mb-3 mt-3">
                        <thead>
                            <tr>
                                <th>Menu</th>
                                {/* <th>Harga</th> */}
                                <th>Jumlah</th>
                                <th>Total</th>
                            </tr> 
                        </thead>
                        <tbody>
                            {this.state.transaksi.map((item, index) => (
                                item.detail_transaksi.map((it, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{it.menu.nama_menu}</td>
                                            {/* <td>Rp {it.menu.harga}</td> */}
                                            <td>{it.menu.harga} x {it.qty}</td>
                                            <td>Rp {it.subtotal}</td>
                                        </tr>
                                    )
                                })
                            ))}
                            {/* {this.state.transaksi.map((item, index) => ( */}
                            <tr>
                                <td colSpan="2"><b>Total</b></td>
                                <td>Rp {this.state.total}</td>
                            </tr>
                            {/* ))} */}
                        </tbody>
                    </table>
                    <p className="text-center mt-3 mb-5">### Terima kasih atas kunjungan Anda ###</p>
                </div>
            </div>
        )
    }

}