import React, { useState } from 'react'
import './modal.scss';

interface Props {
  connect: (host: string, password: string) => void;
  error: boolean;
}

export const SessionCredentials = (props: Props) => {
  const [host, setHost] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.connect(host, password);
    setSubmitted(true);
  }

  return (
    <div className="modal">
      <div className="modal__wrapper">
        <div className="modal__wrapper__body">
          <form onSubmit={onSubmit} className="modal__wrapper__body__form" action="submit">
            <span className="modal__wrapper__body__form__small-text">Connect with your friends</span>
            <span className="modal__wrapper__body__form__big-text">Enter your session credentials</span>
            <input placeholder="Host" className="modal__wrapper__body__form__input" type="text" value={host} onChange={(event) => setHost(event.target.value)} required autoComplete={"on"} />
            <input placeholder="Password" className="modal__wrapper__body__form__input" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete={"on"} />
            <button className="modal__wrapper__body__form__connect" type="submit">Connect</button>
            {props.error && submitted && <span className="modal__wrapper__body__form-error">Invalid credentials</span>}
          </form>
        </div>
      </div>
    </div>
  )
}
