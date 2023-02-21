import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'

export default class CartList extends React.Component {
    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <p>This is Cart List page</p>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
} 