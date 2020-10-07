import React from 'react'
import './home.scss';
import logo from '../../assets/images/logo.svg';

export const Home = () => {
  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" className="header__logo"/>
        <span className="header__text">MeetJS</span>
      </div>
      <div className="main">
        <div className="main__features">
          <span className="main__features__text">Instant, secure video meetings</span>
          <span className="main__features__text">No login required</span>
          <span className="main__features__text">Simple interface</span>
          <span className="main__features__text">Shareable URL</span>
          <span className="main__features__text">Free of costs</span>
        </div>
        <div className="main__start-btn">Start</div>
      </div>
      <div className="footer">
        <span className="footer__item">Github</span>
        <span className="footer__item">About</span>
      </div>
    </div>
  )
}
