import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    userName: '',
    userPassword: '',
    submitError: false,
    errorMsg: '',
  }

  setUsername = event => {
    this.setState({userName: event.target.value})
  }

  setUserPassword = event => {
    this.setState({userPassword: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userName, userPassword} = this.state
    const userDetails = {username: userName, password: userPassword}
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({submitError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {submitError, errorMsg} = this.state

    return (
      <div className="login-page-container">
        <div className="login-input-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="login-form" onSubmit={this.submitForm}>
            <div className="name-input-container">
              <label className="label" htmlFor="nameInput">
                USERNAME
              </label>
              <input
                type="text"
                className="input-element"
                id="nameInput"
                onChange={this.setUsername}
                placeholder="Username"
              />
            </div>
            <div className="name-input-container">
              <label className="label" htmlFor="passwordInput">
                PASSWORD
              </label>
              <input
                type="password"
                className="input-element"
                id="passwordInput"
                onChange={this.setUserPassword}
                placeholder="Password"
              />
            </div>
            <div className="button-container">
              <button className="login-button" type="submit">
                Login
              </button>
            </div>
            {submitError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
