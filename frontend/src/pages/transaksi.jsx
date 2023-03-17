import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            id_transaksi: "",
            id_user: "",
            // id_meja: "",
            meja: "",
            user: "",
            nama_pelanggan: "",
            tgl_transaksi: "",
            status: "",
            detail_transaksi: [],
            isModalOpen: false,
            total: 0
        }
        if (localStorage.getItem('token')) {
            // if (localStorage.getItem("role") === "Kasir" || localStorage.getItem("role") === "Manajer") {
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem('token')
                this.state.id_user = localStorage.getItem('id_user')
            } else {
                window.alert("Anda bukan Kasir")
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
        let url = "http://localhost:9090/transaksi/user/" + this.state.id_user

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                    // id_meja: res.data.transaksi.id_meja,
                    // id_user: res.data.transaksi.id_user,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9090/transaksi/search/" + this.state.id_user
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data, this.headerConfig())
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

    Edit = item => {
        this.setState({
            id_transaksi: item.id_transaksi,
            // id_user: item.id_user,
            id_meja: item.id_meja,
            meja: item.meja.nomor_meja,
            user: item.user.nama_user,
            nama_pelanggan: item.nama_pelanggan,
            tgl_transaksi: item.tgl_transaksi,
            status: item.status,
            detail_transaksi: item.detail_transaksi,
            isModalOpen: true,
        })
        // localStorage.setItem("idmeja", this.state.id_meja);
    }

    Save = e => {
        e.preventDefault()
        let form = {
            status: this.state.status,
            id_meja: this.state.id_meja,
        }
        let url = "http://localhost:9090/transaksi/status/" + this.state.id_transaksi
        axios.post(url, form, this.headerConfig())
            .then(response => {
                // window.alert(response.data.message)
                this.getTransaksi()
                this.handleColse()
            })
            .catch(error => console.log(error))

        this.setState({
            isModalOpen: false,
        })
    }

    Delete = (id) => {
        let url = "http://localhost:9090/transaksi/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data transaksi ini ?")) {
            axios.delete(url, this.headerConfig())
                .then(res => {
                    console.log(res.data.message)
                    this.getTransaksi()
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

    detailTransaksi = item => {
        let id = item.id_transaksi
        localStorage.setItem("id_transaksi", id)
        window.location = '/detailTransaksi'
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
        this.getTransaksi()
        // this.getTransaksiId()
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
                            <p>Cari data transaksi : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Masukkan keyword pencarian"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            {/* <div className="card"> */}
                            {/* <div className="table-responsive"> */}
                            <table className="table table-transparent table-responsive">
                                <thead className="text-center">
                                    <tr>
                                        <th>No.</th>
                                        <th>ID Transaksi</th>
                                        <th>Kasir</th>
                                        <th>Pelanggan</th>
                                        <th>Tanggal Transaksi</th>
                                        <th>Status Pembayaran</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {this.state.transaksi.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.id_transaksi}</td>
                                                <td>{item.user.nama_user}</td>
                                                <td>{item.nama_pelanggan}</td>
                                                <td>{item.tgl_transaksi}</td>
                                                <td>{
                                                    item.status === "Belum bayar" ? (<div className="badge badge-danger">{item.status}</div>) : (<button></button>) &&
                                                        item.status === "Lunas" ? (<div className="badge badge-success">{item.status}</div>) : (<button></button>)
                                                }</td>
                                                <td>{item.status === "Lunas" ? (
                                                    <div>
                                                        <button className="btn btn-sm btn-primary m-1" onClick={() => this.Edit(item)} disabled>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary m-1" onClick={() => this.detailTransaksi(item)}>
                                                            Detail
                                                        </button>
                                                        {/* <button className="btn btn-sm btn-danger m-1" onClick={() => this.Delete(item.id_transaksi)}>
                                                            Hapus
                                                        </button> */}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button className="btn btn-sm btn-primary m-1" onClick={() => this.Edit(item)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary m-1" onClick={() => this.detailTransaksi(item)}>
                                                            Detail
                                                        </button>
                                                        {/* <button className="btn btn-sm btn-danger m-1" onClick={() => this.Delete(item.id_transaksi)}>
                                                            Hapus
                                                        </button> */}
                                                    </div>
                                                )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Transaksi</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.Save(e)}>
                                    <Modal.Body>
                                        <div className="row justify-content-between mx-1 mb-4 mt-0">
                                            <h5>ID Transaksi :  {this.state.id_transaksi}</h5>
                                            <h5>Kasir :  {this.state.user}</h5>
                                        </div>
                                        <hr />
                                        {/* <Form.Group className="mb-2" controlId="id_transaksi">
                                            <Form.Label>ID Transaksi</Form.Label>
                                            <Form.Control type="text" name="id_transaksi"
                                                value={this.state.id_transaksi} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="id_user">
                                            <Form.Label>Admin</Form.Label>
                                            <Form.Control type="text" name="id_user"
                                                value={this.state.user} disabled />
                                        </Form.Group> */}
                                        <Form.Group className="mb-2" controlId="id_meja">
                                            <Form.Label>Meja</Form.Label>
                                            <Form.Control type="text" name="id_meja"
                                                value={this.state.meja} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="nama_pelanggan">
                                            <Form.Label>Pelanggan</Form.Label>
                                            <Form.Control type="text" name="nama_pelanggan"
                                                value={this.state.nama_pelanggan} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="tgl">
                                            <Form.Label>Tanggal Transaksi</Form.Label>
                                            <Form.Control type="text" name="tgl"
                                                value={this.state.tgl_transaksi} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="status">
                                            <label for="exampleSelectGender">Status pembayaran</label><br />
                                            <select type="text" name="status" class="form-control" id="exampleSelectGender"
                                                onChange={e => this.setState({ status: e.target.value })} required >
                                                <option value={this.state.status}>{this.state.status}</option>
                                                <option value="Belum bayar">Belum bayar</option>
                                                <option value="Lunas">Lunas</option>
                                            </select>
                                        </Form.Group>
                                        <hr />
                                        <h5 className="text-center mt-3">Detail Pesanan</h5>
                                        <table className="table table-bordered mb-3 mt-4">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Menu</th>
                                                    <th>Price</th>
                                                    <th>Qty</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.detail_transaksi.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.menu.nama_menu}</td>
                                                        <td>Rp {item.menu.harga}</td>
                                                        <td>{item.qty}</td>
                                                        <td className="text-right">Rp {item.subtotal}</td>
                                                    </tr>
                                                ))}
                                                {/* {this.state.detail_transaksi.map((item, index) => ( */}
                                                <tr>
                                                    <td colSpan="4" className="text-bold">Total</td>
                                                    <td className="text-right">Rp {this.getAmount(this.state.detail_transaksi)}</td>
                                                </tr>
                                                {/* ))} */}
                                            </tbody>
                                        </table>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="dark" onClick={this.handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}