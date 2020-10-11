import React from 'react'
import './modal.scss';
import closeBtn from '../../assets/images/close.svg';
import man from '../../assets/images/man.svg';

interface Props {
  close: () => void
}

export const SessionCredentials = (props: Props) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.close();
  }

  return (
    <div className="modal">
      <div className="modal__opacity">
      </div>
      <div className="modal__wrapper">
        <div className="modal__wrapper__body">
          <img onClick={props.close} className="modal__wrapper__body__close" src={closeBtn} alt="Close" />
          <img className="modal__wrapper__body__man" src={man} alt="Friend" />
          <form onSubmit={onSubmit} className="modal__wrapper__body__form" action="submit">
            <span className="modal__wrapper__body__form__small-text">Connect with your friends</span>
            <span className="modal__wrapper__body__form__big-text">Enter your session credentials</span>
            <input placeholder="Host" className="modal__wrapper__body__form__input" type="text" required />
            <input placeholder="Password" className="modal__wrapper__body__form__input" type="password" required />
            <button className="modal__wrapper__body__form__connect" type="submit">Connect</button>
          </form>
        </div>
      </div>
    </div>
  )
}
