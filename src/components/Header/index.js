import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const navigateToHome = () => {
    const {history} = props
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      history.replace('/')
    } else {
      history.replace('/login')
    }
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="home-website-logo"
          onClick={navigateToHome}
        />
      </Link>

      <ul className="navigate-container">
        <Link to="/" className="link">
          <li className="navigate-items">Home</li>
        </Link>
        <Link to="/jobs" className="link">
          <li className="navigate-items">Jobs</li>
        </Link>
      </ul>
      <li className="logout-li">
        <button className="logout-button" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </div>
  )
}

export default withRouter(Header)
