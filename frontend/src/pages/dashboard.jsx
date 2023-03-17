import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import axios from 'axios'
import { PieChart, Pie, Tooltip, BarChart, XAxis, YAxis, Legend, CartesianGrid, Bar } from "recharts";

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            userName: "",
            userRole: "",
            userCount: 0,
            menuCount: 0,
            mejaCount: 0,
            transaksiCount: 0,
            menu_favorite: [],
            nama_menu_favorite: [],
            qty_favorite: [],
            menu_least: [],
            nama_menu_least: [],
            qty_least: [],
        }
        // cek di local storage apakah ada token (sudah login)
        if (localStorage.getItem('token')) {
            this.state.token = localStorage.getItem('token')
            this.state.userName = localStorage.getItem('nama_user')
            this.state.userRole = localStorage.getItem('role')
        }
        // jika tidak ada token (belum login)
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

    date = () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    getUser = () => {
        let url = "http://localhost:9090/user"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    userCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenu = () => {
        let url = "http://localhost:9090/menu"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menuCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMeja = () => {
        let url = "http://localhost:9090/meja"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    mejaCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getTransaksi = () => {
        let url = "http://localhost:9090/transaksi"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksiCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenuFavorite = () => {
        let url = "http://localhost:9090/menu/search/favorite"

        axios.get(url, this.headerConfig())
            .then(res => {
                const menu_favorite = res.data.menu;
                const nama_menu_favorite = menu_favorite.map((item) => ({ name: item.menu.nama_menu }));
                const qty_favorite = menu_favorite.map((item) => ({ Penjualan: item.total_penjualan }));

                this.setState({
                    menu_favorite,
                    nama_menu_favorite,
                    qty_favorite
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenuLeast = () => {
        let url = "http://localhost:9090/menu/search/least"

        axios.get(url, this.headerConfig())
            .then(res => {
                const menu_least = res.data.menu;
                const nama_menu_least = menu_least.map((item) => ({ name: item.menu.nama_menu }));
                const qty_least = menu_least.map((item) => ({ Penjualan: item.total_penjualan }));

                this.setState({
                    menu_least,
                    nama_menu_least,
                    qty_least
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    componentDidMount = () => {
        this.getUser()
        this.getMenu()
        this.getMeja()
        this.getTransaksi()
        this.getMenuFavorite()
        this.getMenuLeast()
    }

    render() {
        const data_favorite = [...this.state.nama_menu_favorite].map((item, index) => ({ ...item, ...this.state.qty_favorite[index] }));
        const data_least = [...this.state.nama_menu_least].map((item, index) => ({ ...item, ...this.state.qty_least[index] }));

        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="row">
                                <div className="col-md-12 grid-margin">
                                    <div className="row">
                                        <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                                            <h3 className="font-weight-bold">Hi! Welcome {this.state.userRole} {this.state.userName}.</h3>
                                            <h6 className="font-weight-normal mb-0">All systems are running smoothly!</h6>
                                        </div>
                                        <div className="col-12 col-xl-4">
                                            <div className="justify-content-end d-flex">
                                                <div className="dropdown flex-md-grow-1 flex-xl-grow-0">
                                                    <button className="btn btn-sm btn-light bg-white" type="button" id="dropdownMenuDate2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                        <i className="mdi mdi-calendar"></i>Date : {this.date()}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 grid-margin stretch-card">
                                    <div className="card tale-bg">
                                        <div className="card-people mt-auto">
                                            <img src="images/dashboard/people.svg" alt="people" />
                                            {/* <img src="https://www.nibble.id/uploads/cafe_di_jakarta_timur_01_5492f58044.jpg" alt="cafe" width="555" viewBox="0 0 555 289" fill="none" /> */}
                                            <div className="weather-info">
                                                <div className="d-flex">
                                                    <div>
                                                        <h2 className="mb-0 font-weight-normal"><i className="icon-sun mr-2"></i>28<sup>C</sup></h2>
                                                    </div>
                                                    <div className="ml-2">
                                                        <h4 className="location font-weight-normal">Wikusama Cafe</h4>
                                                        <h4 className="location font-weight-normal">Malang</h4>
                                                        <h6 className="font-weight-normal">Indonesia</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 grid-margin transparent">
                                    <div className="row">
                                        <div className="col-md-6 mb-4 stretch-card transparent">
                                            <div className="card card-tale">
                                                <div className="card-body">
                                                    <p className="mb-4">Admin Total</p>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <PersonRoundedIcon sx={{ fontSize: 30 }} className="text-white" />
                                                        </div>
                                                        <div className="col-9"><p className="fs-30 mb-3">{this.state.userCount}</p></div>
                                                        {/* <div className="col-9"><p className="fs-30 mb-3">-</p></div> */}
                                                    </div>
                                                    <p>100%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4 stretch-card transparent">
                                            <div className="card card-dark-blue">
                                                <div className="card-body">
                                                    <p className="mb-4">Menu Total</p>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <RestaurantRoundedIcon sx={{ fontSize: 30 }} className="text-white" />
                                                        </div>
                                                        <div className="col-9"><p className="fs-30 mb-3">{this.state.menuCount}</p></div>
                                                        {/* <div className="col-9"><p className="fs-30 mb-3">-</p></div> */}
                                                    </div>
                                                    <p>100%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                                            <div className="card card-light-blue">
                                                <div className="card-body">
                                                    <p className="mb-4">Table Total</p>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <TableBarRoundedIcon sx={{ fontSize: 30 }} className="text-white" />
                                                        </div>
                                                        <div className="col-9"><p className="fs-30 mb-3">{this.state.mejaCount}</p></div>
                                                        {/* <div className="col-9"><p className="fs-30 mb-3">-</p></div> */}
                                                    </div>
                                                    <p>100%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 stretch-card transparent">
                                            <div className="card card-light-danger">
                                                <div className="card-body">
                                                    <p className="mb-4">Transaction Total</p>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <AttachMoneyRoundedIcon sx={{ fontSize: 30 }} className="text-white" />
                                                        </div>
                                                        <div className="col-9"><p className="fs-30 mb-3">{this.state.transaksiCount}</p></div>
                                                        {/* <div className="col-9"><p className="fs-30 mb-3">-</p></div> */}
                                                    </div>
                                                    <p>100%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.userRole === "Manajer" ? (
                                <div>
                                    <div className="card justify-content-center align-items-center text-center">
                                        <h3 className="mt-4 mb-3">Favorite Menu Statistic</h3>
                                        <div className="mx-5 mt-4 mb-5">
                                            <BarChart
                                                width={800}
                                                height={300}
                                                data={data_favorite}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                                barSize={25}
                                            >
                                                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey="Penjualan" fill="#8884d8" background={{ fill: '#eee' }} />
                                            </BarChart>
                                        </div>
                                    </div>
                                    <div className="card justify-content-center align-items-center text-center mt-3">
                                        <h3 className="mt-4 mb-3">Least Menu Statistic</h3>
                                        <div className="mx-5 mt-4 mb-5">
                                            <BarChart
                                                width={800}
                                                height={300}
                                                data={data_least}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                                barSize={25}
                                            >
                                                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey="Penjualan" fill="#8884d8" background={{ fill: '#eee' }} />
                                            </BarChart>
                                        </div>
                                    </div>

                                    {/* <div className="card">
                                        <h3 className="mt-4 mb-3 text-center">Statistik Penjualan Menu</h3>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center text-center mx-5 mt-4 mb-5">
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={data_favorite}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                                barSize={20}
                                            >
                                                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey="value" fill="#8884d8" background={{ fill: '#eee' }} />
                                            </BarChart>

                                            <PieChart width={300} height={300}>
                                                <Pie
                                                    dataKey="value"
                                                    isAnimationActive={false}
                                                    data={data_favorite}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    label
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </div>
                                    </div>
                                    <div className="card mt-3">
                                        <h3 className="mt-4 mb-3 text-center">Statistik Penjualan Menu</h3>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center text-center mx-5 mt-4 mb-5">
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={data_least}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                                barSize={20}
                                            >
                                                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey="value" fill="#8884d8" background={{ fill: '#eee' }} />
                                            </BarChart>

                                            <PieChart width={300} height={300}>
                                                <Pie
                                                    dataKey="value"
                                                    isAnimationActive={false}
                                                    data={data_least}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    label
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </div>
                                    </div> */}
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}