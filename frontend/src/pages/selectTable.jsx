import React from 'react'
import axios from 'axios'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'

export default class SelectTable extends React.Component {
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
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Kasir")
                window.location = "/"
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

    getTable = () => {
        let url = "http://localhost:9090/meja"

        // axios.get(url, this.headerConfig())
        axios.get(url)
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
            axios.post(url, data)
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

    confirm = (item) => {
        // localStorage.setItem("customer", JSON.stringify(item))
        localStorage.setItem("id_meja", JSON.stringify(item.id_meja))
        window.location = '/selectMenu'
    }

    alert = () => {
        window.alert("This table is not available")
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
                            <h3 className="mt-0 ">Pilih Meja</h3>
                            <hr />
                            <p>Cari data meja : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter table's id / number / available"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <div className="row">
                                {this.state.tables.map((item, index) => (
                                    <div className="col-1 my-3 mx-1">
                                        {item.available === "Yes" ? (
                                            <button className="btn btn-warning" onClick={() => this.confirm(item)}>{item.nomor_meja}</button>
                                        ) : (
                                            <button className="btn btn-warning disabled" onClick={() => this.alert()}>{item.nomor_meja}</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Footer />
                    </div> ``
                </div>
            </div>
        )
    }
}