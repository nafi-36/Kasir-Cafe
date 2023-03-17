import React from 'react'
import axios from 'axios'

export default class PrintLaporan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            id_transaksi: "",
            // id_user: "",
            // id_meja: "",
            nomor_meja: "",
            nama_user: "",
            tgl_transaksi: "",
            status: "",
            detail_transaksi: [],
            isModalOpen: false,
            start: "",
            end: "",
            total: 0
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("role") === "Manajer") {
                this.state.token = localStorage.getItem('token')
                this.state.start = localStorage.getItem('start')
                this.state.end = localStorage.getItem('end')
                this.state.nama_user = localStorage.getItem('nama_user')
            } else {
                window.alert("Anda bukan Manajer")
                window.location = "/"
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

    getTransaksi = () => {
        let url = "http://localhost:9090/transaksi/trans/lunas"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                })
                window.print()
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    betweenDate = () => {
        // e.preventDefault()
        if (this.state.start === "" && this.state.end === "") {
            this.getTransaksi()
        } else {
            let url = "http://localhost:9090/transaksi/date"
            let data = {
                start: this.state.start,
                end: this.state.end
            }
            axios.post(url, data, this.headerConfig())
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi,
                        total: res.data.sumTotal
                    })
                    window.print()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.subtotal)
        })
        return total
    }

    componentDidMount = () => {
        this.betweenDate()
        // this.getTransaksi()
    }

    render() {
        return (
            <div className="container p-1 mt-5">
                <h2 className="text-center mb-3">WIKUSAMA CAFE</h2>
                {this.state.start === "" && this.state.end === "" ? (
                    <h3 className="text-center mb-5">Data Transaksi</h3>
                ) : (
                    <h3 className="text-center mb-5">Data Transaksi {this.state.start} sd. {this.state.end}</h3>
                )}
                <h6>Manajer : {this.state.nama_user}</h6>
                <br />
                {/* <div className="table-responsive"> */}
                <table className="table table-bordered mb-5">
                    <thead>
                        <tr>
                            <th>No.</th>
                            {/* <th>ID</th> */}
                            <th>Kasir</th>
                            <th>Pelanggan</th>
                            <th>Tanggal Transaksi</th>
                            {/* <th>Batas Waktu</th> */}
                            {/* <th>Tgl Bayar</th> */}
                            <th>Status</th>
                            {/* <th>Bayar</th> */}
                            <th>Menu</th>
                            <th>Harga</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {this.state.transaksi.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    {/* <td>{item.id_transaksi}</td> */}
                                    <td>{item.user.nama_user}</td>
                                    <td>{item.nama_pelanggan}</td>
                                    <td>{item.tgl_transaksi}</td>
                                    <td>{item.status}</td>
                                    <td><ol>{item.detail_transaksi.map((item, index) => (
                                        <li>{item.menu.nama_menu}</li>
                                    ))}</ol>
                                    </td>
                                    <td>{item.detail_transaksi.map((item, index) => (
                                        <p>{item.menu.harga}</p>
                                    ))}
                                    </td>
                                    <td>{item.detail_transaksi.map((item, index) => (
                                        <p>{item.qty}</p>
                                    ))}
                                    </td>
                                    <td>{item.detail_transaksi.map((item, index) => (
                                        <p>{item.subtotal}</p>
                                    ))}
                                    </td>
                                    <td>{this.getAmount(item.detail_transaksi)}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td colSpan="9">Total Pendapatan</td>
                            <td>{this.state.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}