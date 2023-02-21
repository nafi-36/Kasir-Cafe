import React from 'react'
import axios from 'axios'

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = (e) => {
        e.preventDefault()
        let data = {
            username: this.state.username,
            password: this.state.password
        }
        let url = "http://localhost:9090/user/auth"
        axios.post(url, data)
            .then(res => {
                if (res.data.logged) {
                    let id_user = res.data.data.id_user
                    let nama_user = res.data.data.nama_user
                    let role = res.data.data.role
                    let image = res.data.data.image
                    // let outlet_id = res.data.data.outlet_id
                    // let admin = res.data.data
                    let token = res.data.token
                    localStorage.setItem("id_user", id_user)
                    localStorage.setItem("nama_user", nama_user)
                    localStorage.setItem("role", role)
                    localStorage.setItem("image", image)
                    // localStorage.setItem("outlet_id", outlet_id)
                    // localStorage.setItem("admin", JSON.stringify(admin))
                    localStorage.setItem("token", token)
                    window.location = '/'
                }
                else {
                    window.alert(res.data.message)
                }
            })
    }

    render() {
        return (
            <div class="container-scroller">
                <div class="container-fluid page-body-wrapper full-page-wrapper">
                    <div class="content-wrapper d-flex align-items-center auth px-0">
                        <div class="row w-100 mx-0">
                            <div class="col-lg-4 mx-auto">
                                <div class="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div class="brand-logo">
                                        <img src="../../images/logo.svg" alt="logo" />
                                    </div>
                                    <h4>Hello! let's get started</h4>
                                    <h6 class="font-weight-light">Sign in to continue.</h6>
                                    <form class="pt-3" onSubmit={(e) => this.handleLogin(e)}>
                                        <div class="form-group">
                                            <input type="email" name="username" class="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username"
                                                value={this.state.username} onChange={this.handleChange} required/>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" name="password" class="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password"
                                                value={this.state.password} onChange={this.handleChange} required/>
                                        </div>
                                        <div class="mt-3">
                                            <button class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" type="submit">SIGN IN</button>
                                        </div>
                                        {/* <div class="my-2 d-flex justify-content-between align-items-center">
                                            <div class="form-check">
                                                <label class="form-check-label text-muted">
                                                    <input type="checkbox" class="form-check-input" />
                                                    Keep me signed in
                                                </label>
                                            </div>
                                            <a href="#" class="auth-link text-black">Forgot password?</a>
                                        </div> */}
                                        {/* <div class="mb-2">
                                            <button type="button" class="btn btn-block btn-facebook auth-form-btn">
                                                <i class="ti-facebook mr-2"></i>Connect using facebook
                                            </button>
                                        </div> */}
                                        <div class="text-center mt-4 font-weight-light">
                                            Don't have an account? <a href="#" class="text-primary">Create</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}