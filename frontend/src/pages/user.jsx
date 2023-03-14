import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class User extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            // outletID: "",
            users: [],
            id_user: "",
            nama_user: "",
            username: "",
            password: "",
            role: "",
            image: null,
            // outlet_id: "",
            // outlet: [],
            // outlet_name: "",
            // fillPassword: true,
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

    getUser = () => {
        let url = "http://localhost:9090/user"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    users: res.data.user
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9090/user/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        users: res.data.user
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    Add = () => {
        this.setState({
            // id_user: 0,
            nama_user: "",
            username: "",
            password: "",
            role: "",
            image: null,
            // outlet_id: "",
            // fillPassword: true,
            action: "insert",
            isModalOpen: true
        })
    }

    Edit = (item) => {
        this.setState({
            id_user: item.id_user,
            nama_user: item.nama_user,
            username: item.username,
            password: "",  // untuk edit password bisa dibuat end-point sendiri 
            role: item.role,
            image: item.image,
            // outlet_id: item.outlet_id,
            // outlet_name: item.outlet.name,
            // fillPassword: false,
            action: "update",
            isModalOpen: true
        })
    }

    editPassword = (item) => {
        this.setState({
            id_user: item.id_user,
            password: "",
            action: "editPassword",
            isModalOpen: true
        })
    }

    saveUser = (e) => {
        e.preventDefault()
        // let form = {
        //     admin_id: this.state.admin_id,
        //     name: this.state.name,
        //     username: this.state.username,
        //     password: this.state.password,
        //     role: this.state.role,
        //     outlet_id: this.state.outlet_id
        // }
        // if (this.state.fillPassword) {
        //     form.password = this.state.password
        // }

        let url = ""
        if (this.state.action === "insert") {
            let form = new FormData()
            form.append("nama_user", this.state.nama_user)
            form.append("role", this.state.role)
            form.append("image", this.state.image)
            form.append("username", this.state.username)
            form.append("password", this.state.password)

            url = "http://localhost:9090/user"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getUser()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "update") {
            let form = new FormData()
            form.append("nama_user", this.state.nama_user)
            form.append("username", this.state.username)
            // form.append("password", this.state.password)
            form.append("role", this.state.role)
            form.append("image", this.state.image)

            url = "http://localhost:9090/user/" + this.state.id_user
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getUser()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "editPassword") {
            let form = {
                id_user: this.state.id_user,
                password: this.state.password,
            }
            url = "http://localhost:9090/user/password/" + this.state.id_user
            // axios.put(url, form, this.headerConfig())
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getUser()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    dropUser = (id) => {
        let url = "http://localhost:9090/user/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getUser()
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
        this.getUser()
        // this.getOutlet()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Admin</h3>
                            <hr />
                            <p>Cari data admin : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter admin's id / name / role"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.Add()}>
                                Add Admin
                            </button>
                            <div className="card bg-light p-3">
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Image</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Option</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.users.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><img src={"http://localhost:9090/image/user/" + item.image} alt="User Image" /></td>
                                                <td>{item.id_user}</td>
                                                <td>{item.nama_user}</td>
                                                <td>{item.username}</td>
                                                <td>{item.role}</td>
                                                {/* <td>{item.outlet.name}</td> */}
                                                <td>{JSON.stringify(item.id_user) === localStorage.getItem("id_user") ? (
                                                    <a className="btn btn-sm btn-success m-1" href="/profile">
                                                        <span><Edit /> </span>
                                                    </a>
                                                ) : (
                                                    <button className="btn btn-sm btn-primary m-1"
                                                        onClick={() => this.Edit(item)}>
                                                        <span><Edit /> </span>
                                                    </button>
                                                )}
                                                    <button className="btn btn-sm btn-danger m-1"
                                                        onClick={() => this.dropUser(item.id_user)}>
                                                        <span><Delete /> </span>
                                                    </button>
                                                    <button className="btn btn-secondary m-1"
                                                        onClick={() => this.editPassword(item)}>
                                                        Edit Password
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
                                    <Modal.Title>Form Admin</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.saveUser(e)}>
                                    <Modal.Body>
                                        {this.state.action === "editPassword" ? (
                                            <Form.Group className="mb-2" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                    value={this.state.password} onChange={this.handleChange} required />
                                            </Form.Group>
                                        ) : (<div></div>) && this.state.action !== "editPassword" ? (
                                            <div>
                                                <Form.Group className="mb-2" controlId="nama_user">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="nama_user" placeholder="Masukkan nama"
                                                        value={this.state.nama_user} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="email" name="username" placeholder="Masukkan username"
                                                        value={this.state.username} onChange={this.handleChange} required />
                                                </Form.Group>
                                                {this.state.action === "insert" ? (
                                                    <Form.Group className="mb-2" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                            value={this.state.password} onChange={this.handleChange} required />
                                                    </Form.Group>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Form.Group className="mb-2" controlId="role" >
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender" placeholder="Pilih role"
                                                        onChange={this.handleChange} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Kasir">Kasir</option>
                                                        <option value="Manajer">Manajer</option>
                                                    </select>
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="image">
                                                    <Form.Label>Image</Form.Label>
                                                    {this.state.action === "insert" ? (
                                                        <Form.Control type="file" name="image" placeholder="Enter the image"
                                                            onChange={this.handleFile} required />
                                                    ) : (
                                                        <Form.Control type="file" name="image" placeholder="Enter the image"
                                                            onChange={this.handleFile} />
                                                    )}
                                                </Form.Group>
                                            </div>) : (<div></div>)}
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
            </div >

        )
    }
}