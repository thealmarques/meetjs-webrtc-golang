import React, { useState } from 'react';
import './home.scss';
import logo from '../../assets/images/logo.svg';
import { createSession } from '../../services/api-request.services';

export const Home = () => {
  const [host, setHost] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createSession(host, title, password).then((response: Response) => {
      alert(response.status);
    }).catch((error: Error) => {
      console.error(error.message)
    });
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header__left">
          <img src={logo} alt="Logo" className="header__left__logo" />
          <span className="header__left__text">MeetJS</span>
        </div>
        <div className="header__right">
          <span className="header__right__margin">Github</span>
          <span>About</span>
        </div>
      </div>
      <div className="body">
        <span className="body__title">Do you want free video communications?</span>
        <span className="body__sub-title">Get you own URL and share it with others to join you.</span>
        <form onSubmit={onSubmit} className="body__form">
          <div className="body__form__inputs">
            <input placeholder="Host" className="body__form__inputs__input" type="text" value={host} onChange={(event)=> setHost(event.target.value)} required />
            <input placeholder="Title" className="body__form__inputs__input" type="text" value={title} onChange={(event)=> setTitle(event.target.value)} required />
            <input placeholder="Password" className="body__form__inputs__input" type="password" value={password} onChange={(event)=> setPassword(event.target.value)} required />
          </div>
          <div className="body__form__create">
            <button className="body__form__create__btn" type="submit">Create</button>
            <span className="body__form__create__small-text">Secure and simple</span>
          </div>
        </form>
      </div>
    </div>
  )
}
