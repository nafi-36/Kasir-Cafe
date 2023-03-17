import React from 'react'
import axios from 'axios'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Meja extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            tables: [],
            id_meja: "",
            nomor_meja: "",
            available: "",
            action: "",
            isModalOpen: false,
            keyword: ""
        }
        
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Admin") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Admin")
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

    getTable = () => {
        let url = "http://localhost:9090/meja"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    tables: res.data.meja
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9090/meja/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data, this.headerConfig())
                .then(res => {
                    this.setState({
                        tables: res.data.meja
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    Add = () => {
        this.setState({
            id_meja: 0,
            nomor_meja: "",
            available: "Yes",
            action: "insert",
            isModalOpen: true
        })
    }

    Edit = item => {
        this.setState({
            id_meja: item.id_meja,
            nomor_meja: item.nomor_meja,
            available: item.available,
            action: "update",
            isModalOpen: true
        })
    }

    saveTable = e => {
        e.preventDefault()
        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9090/meja"
            let form = {
                // id_meja: this.state.id_meja,
                nomor_meja: this.state.nomor_meja,
                available: this.state.available,
            }
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTable()
                    this.handleClose()
                })
                .catch(error => console.log(error))
        }
        else if (this.state.action === "update") {
            let form = {
                id_meja: this.state.id_meja,
                nomor_meja: this.state.nomor_meja,
                available: this.state.available,
            }
            url = "http://localhost:9090/meja/" + this.state.id_meja
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTable()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    dropTable = id => {
        let url = "http://localhost:9090/meja/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url, this.headerConfig())
                .then(res => {
                    console.log(res.data.message)
                    this.getTable()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
        this.getTable()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Meja</h3>
                            <hr />
                            <p>Cari data meja : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Masukkan keyword pencarian"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.Add()}>
                                Add Table
                            </button>
                            <div className="card bg-light p-3">
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Id Meja</th>
                                            <th>Nomor Meja</th>
                                            <th>Available</th>
                                            <th>Option</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.tables.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.id_meja}</td>
                                                <td><button className="btn btn-primary" disabled>{item.nomor_meja}</button></td>
                                                <td>{
                                                    item.available === "Yes" ? (
                                                        <button className="btn btn-success text-dark" disabled>{item.available}</button>
                                                    ) : (
                                                        <button className="btn btn-danger" disabled>{item.available}</button>
                                                    )
                                                }</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary m-1"
                                                        onClick={() => this.Edit(item)}>
                                                        <span><Edit /> </span>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger m-1"
                                                        onClick={() => this.dropTable(item.id_meja)}>
                                                        <span><Delete /> </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Table</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.saveTable(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="nomor_meja">
                                            <Form.Label>Table Number</Form.Label>
                                            <Form.Control type="text" name="nomor_meja" placeholder="Masukkan nomor meja"
                                                value={this.state.nomor_meja} onChange={e => this.setState({ nomor_meja: e.target.value })} required />
                                        </Form.Group>
                                        {this.state.action === "insert" ? (
                                            <Form.Group className="mb-2" controlId="available" >
                                                <label for="exampleSelectGender">Available</label><br />
                                                <select type="text" name="available" class="form-control" id="exampleSelectGender" placeholder="Pilih available meja"
                                                    onChange={e => this.setState({ available: e.target.value })} disabled >
                                                    <option value={this.state.available}>{this.state.available}</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </Form.Group>
                                        ) : (
                                            <Form.Group className="mb-2" controlId="available" >
                                                <label for="exampleSelectGender">Role</label><br />
                                                <select type="text" name="available" class="form-control" id="exampleSelectGender" placeholder="Pilih role"
                                                    onChange={e => this.setState({ available: e.target.value })} required >
                                                    <option value={this.state.available}>{this.state.available}</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </Form.Group>
                                        )}
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