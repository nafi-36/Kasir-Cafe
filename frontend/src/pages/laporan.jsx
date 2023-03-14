import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import Print from '@mui/icons-material/Print'
import axios from 'axios'

export default class Laporan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            // outlet_id: "",
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
            total: 0,
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("role") === "Manajer") {
                this.state.token = localStorage.getItem('token')
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
        let url = "http://localhost:9090/transaksi"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9090/transaksi/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi,
                        total: res.data.sumTotal,
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    betweenDate = (e) => {
        e.preventDefault()
        if (this.state.start === "" && this.state.end === "") {
            this.getTransaksi()
        } else {
            let url = "http://localhost:9090/transaksi/date"
            let data = {
                start: this.state.start,
                end: this.state.end
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi,
                        total: res.data.sumTotal
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    Print = () => {
        // let id = item.transaksi_id
        localStorage.setItem("start", this.state.start)
        localStorage.setItem("end", this.state.end)
        window.open('/printLaporan', '_blank')
        // window.location = '/printLaporan'
    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.subtotal)
        })
        return total
    }

    componentDidMount = () => {
        this.getTransaksi()
        // this.betweenDate()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Transaksi</h3>
                            <hr />
                            <h6>Cari data transaksi : </h6>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Masukkan keyword pencarian"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <h6 className="mb-3">Filter transaksi berdasarkan tanggal :</h6>
                            <form onSubmit={(e) => this.betweenDate(e)}>
                                <div className="row mb-5">
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">Start</label>
                                            <input type="date" name="start" className="form-control mx-3"
                                                value={this.state.start}
                                                onChange={e => this.setState({ start: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">End</label>
                                            <input type="date" name="end" className="form-control mx-3"
                                                value={this.state.end}
                                                onChange={e => this.setState({ end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" type="submit">Set</button>
                                            <button className="btn btn-sm btn-primary"
                                                onClick={() => this.Print()}>
                                                <span className="mx-1"><Print /> </span>Cetak Laporan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="table-responsive">
                                <table className="table table-bordered">
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
                                                    {/* <td>{item.batas_waktu}</td> */}
                                                    {/* <td>{item.tgl_bayar}</td> */}
                                                    <td>{item.status}</td>
                                                    {/* <td>{item.dibayar}</td> */}
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
                                        <tr  >
                                            <td colSpan="9">Total Pendapatan</td>
                                            <td>{this.state.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}