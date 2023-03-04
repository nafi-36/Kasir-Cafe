import React from "react"
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'

export default class MenuList extends React.Component {
    render() {
        return (
            <div className="col-3 my-2">
                <div className="card h-100">
                    <img src={this.props.image} className="card-img-top" alt={this.props.nama_menu} />
                    <div className="card-body">
                        <h5 className="card-title">{this.props.nama_menu}</h5><hr />
                        <p className="card-text text-color-danger">{this.props.jenis}</p>
                        <p className="card-text">{this.props.deskripsi}</p>
                        <p className="card-title">Price: Rp {this.props.harga}</p>
                        <div className="row d-flex justify-content-center mt-4">
                            <button className="btn btn-sm btn-primary m-1" onClick={this.props.onEdit}><span><Edit /> </span>Edit</button>
                            <button className="btn btn-sm btn-danger m-1" onClick={this.props.onDrop}><span><Delete /> </span>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}