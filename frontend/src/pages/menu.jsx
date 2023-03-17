import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import MenuList from '../components/menuList'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Menu extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            menus: [],
            id_menu: "",
            nama_menu: "",
            jenis: "",
            deskripsi: "",
            harga: "",
            image: null,
            action: "",
            isModalOpen: false,
        }

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Admin") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Admin")
                window.location = "/"
            }
            // this.state.id_user = localStorage.getItem("id_user")
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

    getMenu = () => {
        let url = "http://localhost:9090/menu"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menus: res.data.menu
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenuMakanan = () => {
        let url = "http://localhost:9090/menu/search/makanan"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menus: res.data.menu
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenuMinuman = () => {
        let url = "http://localhost:9090/menu/search/minuman"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menus: res.data.menu
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9090/menu/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data, this.headerConfig())
                .then(res => {
                    this.setState({
                        menus: res.data.menu
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
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

    handleAdd = () => {
        this.setState({
            // id_menu: "",
            nama_menu: "",
            jenis: "",
            deskripsi: "",
            harga: "",
            image: null,
            action: "insert",
            isModalOpen: true,
        })
    }

    handleEdit = (item) => {
        this.setState({
            id_menu: item.id_menu,
            nama_menu: item.nama_menu,
            jenis: item.jenis,
            deskripsi: item.deskripsi,
            harga: item.harga,
            image: item.image,
            action: "update",
            isModalOpen: true,
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append("nama_menu", this.state.nama_menu)
        form.append("jenis", this.state.jenis)
        form.append("deskripsi", this.state.deskripsi)
        form.append("harga", this.state.harga)
        form.append("image", this.state.image)

        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9090/menu"
            axios.post(url, form, this.headerConfig())
                .then(res => {
                    window.alert(res.data.message)
                    this.getMenu()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "update") {
            url = "http://localhost:9090/menu/" + this.state.id_menu
            axios.put(url, form, this.headerConfig())
                .then(res => {
                    window.alert(res.data.message)
                    this.getMenu()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:9090/menu/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url, this.headerConfig())
                .then(res => {
                    console.log(res.data.message)
                    this.getMenu()
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
        this.getMenu()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0">Data Menu Makanan & Minuman</h3>
                            <hr />
                            <p>Cari data menu : </p>
                            <div className="row">
                                <div className="col-7">
                                    <input className="form-control mb-2" type="text" name="keyword"
                                        value={this.state.keyword}
                                        onChange={e => this.setState({ keyword: e.target.value })}
                                        onKeyUp={e => this.handleSearch(e)}
                                        placeholder="Masukkan keyword pencarian"
                                    />
                                </div>
                                <div className="col-5">
                                    <button className="btn btn-primary ml-2 mr-2" onClick={this.getMenu}>All</button>
                                    <button className="btn btn-primary ml-2 mr-2" onClick={this.getMenuMakanan}>Makanan</button>
                                    <button className="btn btn-primary ml-2" onClick={this.getMenuMinuman}>Minuman</button>
                                </div>
                            </div>
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                                Add Menu
                            </button>
                            <div className="row mt-2">
                                {this.state.menus.map((item, index) => {
                                    return (
                                        <MenuList key={index}
                                            nameImage={item.image}
                                            image={"http://localhost:9090/image/menu/" + item.image}
                                            nama_menu={item.nama_menu}
                                            jenis={item.jenis}
                                            deskripsi={item.deskripsi}
                                            harga={item.harga}
                                            onEdit={() => this.handleEdit(item)}
                                            onDrop={() => this.handleDrop(item.id_menu)}
                                        />
                                    )
                                })}
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Package</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="nama_menu">
                                            <Form.Label>Menu</Form.Label>
                                            <Form.Control type="text" name="nama_menu" placeholder="Enter the menu's name"
                                                value={this.state.nama_menu} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="jenis" >
                                            <label for="exampleSelectGender">Type</label><br />
                                            <select type="text" name="jenis" class="form-control" id="exampleSelectGender" placeholder="Choose the menu's type"
                                                onChange={this.handleChange} required >
                                                <option value={this.state.jenis}>{this.state.jenis}</option>
                                                <option value="Makanan">Makanan</option>
                                                <option value="Minuman">Minuman</option>
                                            </select>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="deskripsi">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control type="text" name="deskripsi" placeholder="Enter the menu's description"
                                                value={this.state.deskripsi} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="harga">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="number" name="harga" placeholder="Enter the price"
                                                value={this.state.harga} onChange={this.handleChange} />
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