import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            user: [],
            nama_user: "",
            username: "",
            password: "",
            role: "",
            image: null,
            // imageUrl: "",
            // fillPassword: true,
            // action: "",
            isModalOpen: false
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
            this.state.id_user = localStorage.getItem("id_user")
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

    logout = () => {
        window.location = "/login"
        localStorage.clear()
    }

    getUserId = () => {
        let url = "http://localhost:9090/user/" + this.state.id_user

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    user: res.data.user, 
                    nama_user: res.data.user.nama_user,
                    username: res.data.user.username,
                    password: "",
                    role: res.data.user.role,
                    image: res.data.user.image
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

    // Edit = item => {
    //     this.setState({
    //         // action: "update",
    //         admin_id: item.admin_id,
    //         name: item.name,
    //         username: item.username,
    //         password: "",
    //         // fillPassword: false,
    //         isModalOpen: true
    //     })
    // }

    saveUser = e => {
        if (localStorage.getItem("role") !== "Admin") {
            e.preventDefault()
            window.alert("Anda bukan Admin, tidak dapat mengubah profile")
            this.getUserId()
        } else {
            e.preventDefault()
            let form = new FormData()
            form.append("nama_user", this.state.nama_user)
            form.append("username", this.state.username)
            form.append("password", this.state.password)
            form.append("role", this.state.role)
            form.append("image", this.state.image)

            let url = "http://localhost:9090/user/" + this.state.id_user
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getUserId()
                })
                .catch(error => console.log(error))

            localStorage.setItem("nama_user", this.state.user.nama_user)
            localStorage.setItem("role", this.state.user.role)
            localStorage.setItem("image", this.state.user.image)
        }
    }

    dropUser = id => {
        let url = "http://localhost:9090/user/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus akun ini ?")) {
            axios.delete(url, this.headerConfig())
                .then(res => {
                    console.log(res.data.message)
                    this.getUserId()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        window.location = "/login"
    }

    componentDidMount() {
        this.getUserId()
    }

    render() {
        return (
            <div className="container-scroller">
                {/* <Navbar /> */}
                <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                        <a className="navbar-brand brand-logo mr-5" href="/"><img src="images/logo.png" className="mr-2" alt="logo" /></a>
                        <a className="navbar-brand brand-logo-mini" href="/"><img src="images/logo-mini.png" alt="logo" /></a>
                    </div>
                    <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                            <span className="icon-menu"></span>
                        </button>
                        <ul className="navbar-nav mr-lg-2">
                            <li className="nav-item nav-search d-none d-lg-block">
                                <div className="input-group">
                                    <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                                        <span className="input-group-text" id="search">
                                            <i className="icon-search"></i>
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" id="navbar-search-input" placeholder="Search now" aria-label="search" aria-describedby="search" />
                                </div>
                            </li>
                        </ul>
                        <ul className="navbar-nav navbar-nav-right">
                            <li className="nav-item dropdown">
                                <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
                                    <i className="icon-bell mx-0"></i>
                                    <span className="count"></span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                                    <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <div className="preview-icon bg-success">
                                                <i className="ti-info-alt mx-0"></i>
                                            </div>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal">Application Error</h6>
                                            <p className="font-weight-light small-text mb-0 text-muted">
                                                Just now
                                            </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <div className="preview-icon bg-warning">
                                                <i className="ti-settings mx-0"></i>
                                            </div>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal">Settings</h6>
                                            <p className="font-weight-light small-text mb-0 text-muted">
                                                Private message
                                            </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <div className="preview-icon bg-info">
                                                <i className="ti-user mx-0"></i>
                                            </div>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal">New user registration</h6>
                                            <p className="font-weight-light small-text mb-0 text-muted">
                                                2 days ago
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            </li>
                            <li className="nav-item nav-profile dropdown">
                                <a className="nav-link dropdown-toggle" href="/" data-toggle="dropdown" id="profileDropdown">
                                    <img src={"http://localhost:9090/image/user/" + this.state.user.image} alt="User Image" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                                    <a className="dropdown-item" onClick={() => this.setting()}>
                                        <i className="ti-settings text-primary"></i>
                                        Profile Setting
                                    </a>
                                    <button className="dropdown-item" onClick={() => this.logout()}>
                                        <i className="ti-power-off text-primary"></i>
                                        Logout
                                    </button>
                                </div>
                            </li>
                            <li className="nav-item nav-settings d-none d-lg-flex">
                                <a className="nav-link" href="#">
                                    <i className="icon-ellipsis"></i>
                                </a>
                            </li>
                        </ul>
                        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                            <span className="icon-menu"></span>
                        </button>
                    </div>
                </nav>

                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Setting Profile</h3>
                            <hr />
                            <div class="container rounded bg-white">
                                <div class="row">
                                    <div class="col-md-4 border-right">
                                        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                                            <img class="rounded-circle mt-5" width="150" height="150" src={"http://localhost:9090/image/user/" + this.state.user.image} alt="User Image" />
                                            {/* <img class="rounded-circle mt-5" width="150" height="150" src={this.state.imageUrl} alt="User Image" /> */}
                                            <h5 class="mt-4">{this.state.user.nama_user}</h5>
                                            <span class="text-black-50 mt-1">{this.state.user.username}</span>
                                            <p class="text-black-50 mt-1">{this.state.user.role} | Wikusama Cafe</p>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="p-3 py-5">
                                            {/* <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h4 class="text-right">Profile Settings</h4>
                                            </div> */}
                                            <Form onSubmit={e => this.saveUser(e)}>
                                                <Form.Group className="mb-2" controlId="nama_user">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="nama_user" placeholder="Enter your name"
                                                        value={this.state.nama_user} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="email" name="username" placeholder="Enter your username"
                                                        value={this.state.username} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="password">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" name="password" placeholder="Enter your password"
                                                        value={this.state.password} onChange={this.handleChange} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="role">
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender"
                                                        onChange={this.handleChange} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Kasir">Kasir</option>
                                                        <option value="Manajer">Manajer</option>
                                                    </select>
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="image">
                                                    <Form.Label>Image</Form.Label>
                                                    <Form.Control type="file" name="image" placeholder="Enter the image"
                                                        onChange={this.handleFile} />
                                                </Form.Group>
                                                <Button variant="primary mt-3" type="submit">
                                                    Save Profile
                                                </Button>
                                            </Form>
                                        </div>
                                    </div>
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