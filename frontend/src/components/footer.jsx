import React from 'react'

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <div className="d-sm-flex justify-content-center justify-content-sm-between">
                    <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Made with<i className="ti-heart text-danger ml-1"> </i> by Zia</span>
                    <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"><a href="#">Back to Top</a></span>
                </div>
            </footer>
        )
    }
}