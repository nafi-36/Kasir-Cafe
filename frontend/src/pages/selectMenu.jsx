import React from 'react'
import axios from 'axios'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import Confirm from '@mui/icons-material/CheckOutlined'
// import MenuList from '../components/menuList'

export default class SelectMenu extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            menus: [],
        }
        
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("id_meja") !== null) {
                if (localStorage.getItem("role") === "Kasir") {
                    this.state.token = localStorage.getItem("token")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Pilih meja terlebih dahulu")
                window.location = '/selectTable'
            }
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

    // confirm = (item) => {
    //     // localStorage.setItem("customer", JSON.stringify(item))
    //     localStorage.setItem("id_meja", JSON.stringify(item.id_meja))
    //     window.location = '/selectMenu'
    // }

    // alert = () => {
    //     window.alert("This table is not available")
    // }

    addToCart = (selectedItem) => {
        // membuat sebuah variabel untuk menampung cart sementara
        let tempCart = []

        // cek elsistensi dari data cart pada localstorage
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
            // JSON.parse() digunakan untuk mengonversi dari string -> array object
        }

        // cek data yang dipilih user ke keranjang belanja
        let existItem = tempCart.find(item => item.id_menu === selectedItem.id_menu)
        if (existItem) {
            // jika item yang dipilih ada pada keranjang belanja
            window.alert(`Anda telah memilih menu ${selectedItem.nama_menu}`)
        }
        else {
            // user diminta memasukkan jumlah item yang dibeli
            let promptJumlah = window.prompt(`Masukkan jumlah ${selectedItem.nama_menu} yang ingin dibeli`, "")
            if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
                window.alert("Tidak boleh kosong")
            } else {
                // jika user memasukkan jumlah item yang dibeli
                // menambahkan properti "jumlahBeli" pada item yang dipilih
                selectedItem.qty = promptJumlah
                selectedItem.subtotal = selectedItem.harga * promptJumlah
                // masukkan item yang dipilih ke dalam cart
                tempCart.push(selectedItem)
                // simpan array tempCart ke localStorage
                localStorage.setItem("cart", JSON.stringify(tempCart))
            }
        }
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
                            <h3 className="mt-0 ">Pilih Menu</h3>
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
                            <div className="row mt-2">
                                {this.state.menus.map((item, index) => {
                                    return (
                                        <div className="col-3 my-2" key={index}>
                                            <div className="card h-100">
                                                <img src={"http://localhost:9090/image/menu/" + item.image} className="card-img-top" alt={item.nama_menu} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.nama_menu}</h5><hr />
                                                    <p className="card-text text-color-danger">{item.jenis}</p>
                                                    <p className="card-text">{item.deskripsi}</p>
                                                    <h6>Price: Rp {item.harga}</h6>
                                                    <div className="row d-flex justify-content-center mt-4">
                                                        <button className="btn btn-sm btn-primary w-100 mx-3" onClick={() => this.addToCart(item)}><span><Confirm /> </span>Confirm</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}