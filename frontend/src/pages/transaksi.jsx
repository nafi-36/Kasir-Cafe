import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'

export default class Transaksi extends React.Component {
    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <p>This is Transaction page</p>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
} 