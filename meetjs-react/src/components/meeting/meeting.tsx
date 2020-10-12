import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { verifySocket, connectSession } from '../../services/api-request.services';
import logo from '../../assets/images/logo.svg';
import micOn from '../../assets/images/mic-on.svg';
import micOff from '../../assets/images/mic-off.svg';
import camOn from '../../assets/images/cam-on.svg';
import camOff from '../../assets/images/cam-off.svg';
import { SessionCredentials } from '../session-modal/modal';
import { useHistory } from "react-router";
import './meeting.scss';
import { ResponseData } from '../../interfaces/ResponseData';
import Loader from 'react-loader-spinner'

export const Meeting = () => {
  const location = useLocation();
  const history = useHistory();
  const socket = location.pathname.split('/meeting/')[1];
  const [exists, setExists] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [mic, setMic] = useState<boolean>(false);
  const [cam, setCam] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false)

  useEffect(() => {
    const getValidity = async () => {
      try {
        await verifySocket(socket);
        setExists(true);
      } catch (error) {
        console.log(error.message);
        console.error('Invalid URL');
        history.push('/');
      }
    }
    getValidity();
  }, [socket, history, exists])

  const connect = (host: string, password: string) => {
    connectSession(host, password, socket).then((response: Response & ResponseData) => {
      setTitle(response.data.title);
      setConnected(true);
    }).catch(() => {
      setConnected(false);
    });
  }

  return (
    <div className="meeting">
      <div className="meeting__header">
        <div className="meeting__header__left">
          <img src={logo} alt="Logo" className="meeting__header__left__logo" />
          <span className="meeting__header__left__text">MeetJS</span>
        </div>
        <div className="meeting__header__right">
          <span className="meeting__header__right__margin">Github</span>
          <span>About</span>
        </div>
      </div>
      <div className="meeting__body">
        {exists && !connected && <SessionCredentials error={!connected} connect={connect}></SessionCredentials>}
        {exists && connected && !joined &&
          (
            <div className="meeting__body__info">Join the meeting to communicate with others.</div>
          )
        }
        {exists && connected && waiting && joined &&
          (
            <div className="meeting__body__spinner">
              <Loader
                type="Grid"
                color="#ED7655"
                height={100}
                width={70}
                timeout={3000}
            />
            </div>
          )
        }
        {exists && connected &&
          (
            <div className="meeting__body__bar">
              <div className="meeting__body__bar__left-bar">
                <div onClick={() => {
                  if (!joined) {
                    setWaiting(true);
                  }
                  setJoined(!joined);
                }} className={`meeting__body__bar__left-bar__status ${joined ? 'meeting__body__bar__left-bar__status-inactive' : 'meeting__body__bar__left-bar__status-active'}`}>
                  {joined ? 'Leave' : 'Join'}
                </div>
                <span className="meeting__body__bar__left-bar__title">{title}</span>
              </div>
              <div className="meeting__body__bar__right-bar">
                <img className="meeting__body__bar__right-bar__icon" src={mic ? micOn : micOff} alt="Mic" onClick={() => setMic(!mic)} />
                <img className="meeting__body__bar__right-bar__icon" src={cam ? camOn : camOff} alt="Webcam" onClick={() => setCam(!cam)} />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
