import React, { useEffect, useState, useRef } from 'react'
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
import { ResponseData } from '../../interfaces/response-data';
import Loader from 'react-loader-spinner'
import { ConnectionSocket } from '../../services/connection-socket.services';
import { generateId } from '../../utils/identifier.utils';
import { SocketEvent, SocketResponse } from '../../interfaces/socket-data';
import { State } from '../state-machine/state-machine';

export const Meeting = () => {
  const location = useLocation();
  const [url, setUrl] = useState<string>(location.pathname.split('/meeting/')[1]);
  const [state, setState] = useState<State>(State.INVALID);
  const [title, setTitle] = useState<string>('');
  const localVideo = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<string>('')
  const [audio, setAudio] = useState<boolean>(false);
  const [video, setVideo] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>(false);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>(false);
  const [connection, setConnection] = useState<ConnectionSocket>();
  const [users, setUsers] = useState<string[]>([]);
  const [userId, setUserId] = useState<number>(generateId());

  useEffect(() => {
    let unmounted = false;
    const getValidity = async () => {
      try {
        await verifySocket(url);
        if (!unmounted) {
          setState(State.VALID_URL);
        }
      } catch (error) {
        console.log(error.message);
        console.error('Invalid URL');
        window.location.href = '/';
      }
    }
    getValidity();
    return () => {
      unmounted = true;
    };
  }, [url])

  const connect = (host: string, password: string) => {
    connectSession(host, password, url).then((response: Response & ResponseData) => {
      setTitle(response.data.title);
      setSocket(response.data.socket);
      setState(State.LOGGED);
    }).catch((error) => {
      setState(State.INVALID);
    });
  }

  const joinMeeting = () => {
    switch (state) {
      case State.LOGGED:
        setState(State.JOINED);
        break;
      case State.JOINED:
        setState(State.LOGGED);
        break;
    }
  }

  useEffect(() => {
    if (state >= 3) {
      if (!localVideo.current.srcObject) {
        navigator.getUserMedia(
          { audio: true, video: true },
          stream => {
            setAudioTrack(stream.getAudioTracks()[0]);
            setVideoTrack(stream.getVideoTracks()[0]);
            localVideo.current.srcObject = stream;
          },
          error => console.warn(error.message)
        );
      }
    }
  }, [state]);

  useEffect(() => {
    if (state >= 3) {
      const media: MediaStream = localVideo.current.srcObject;
      
      if (!audio) {
        media.removeTrack(audioTrack);
      } else {
        media.addTrack(audioTrack);
      }
    }
  }, [audio]);

  useEffect(() => {
    if (state >= 3) {
      const media: MediaStream = localVideo.current.srcObject;
      
      if (!video) {
        media.removeTrack(videoTrack);
      } else {
        media.addTrack(videoTrack);
      }
    }
  }, [video]);

  useEffect(() => {
    if (state === 3 && connection) {
      connection.send('leave', 'disconnect', userId);
      setConnection(false);
    }
  }, [state]);

  useEffect(() => {
    if (state > 3) {
      const socketConnection = new ConnectionSocket('ws://localhost:9000/ws');
      const onConnectionReady = () => {
        socketConnection.send('join', 'connect', userId);
        setTimeout(() => {
          socketConnection.send('join', 'connect', 'kkio1982bb');
        }, 200)
      }

      const onMessage = (event: Event & SocketEvent) => {
        const data: SocketResponse = JSON.parse(event.data);
        if (data.type === 'connect') {
          setUsers((prevState) => {
            return prevState.concat(data.userID)
          });
        }
      }
      
      socketConnection.onMessage(onMessage);
      socketConnection.onOpen(onConnectionReady);
      setConnection(socketConnection);
    }
  }, [state])

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
        {state <= 2 && <SessionCredentials error={state === State.INVALID} connect={connect}></SessionCredentials>}
        {state === State.LOGGED &&
          (
            <div className="meeting__body__info">Join the meeting to communicate with others.</div>
          )
        }
        {state === State.JOINED && (
          <div className="meeting__body__users">
            {
              users.map((user, index) => {
                return (
                  <video
                    key={index}
                    id={`${user}-${index}-video`}
                    autoPlay
                    muted
                    className="meeting__body__users__remote-video"></video>
                )
              })
            }
          </div>
        )}
        {state > 2 &&
          (
            <div className="meeting__body__bar">
              <div className="meeting__body__bar__video-container">
                <video hidden={!video} ref={localVideo} autoPlay muted className="meeting__body__bar__video-container__local-video" id="local-video">
                </video>
              </div>
              <div className="meeting__body__bar__left-bar">
                <div onClick={joinMeeting} className={`meeting__body__bar__left-bar__status ${state === State.JOINED ? 'meeting__body__bar__left-bar__status-inactive' : 'meeting__body__bar__left-bar__status-active'}`}>
                  {state === State.JOINED ? 'Leave' : 'Join'}
                </div>
                <span className="meeting__body__bar__left-bar__title">{title}</span>
              </div>
              <div className="meeting__body__bar__right-bar">
                {
                  state === State.JOINED &&
                  <span className="meeting__body__bar__right-bar__count">{users.length} online users</span>
                }
                <img className="meeting__body__bar__right-bar__icon" src={audio ? micOn : micOff} alt="Mic" onClick={() => setAudio(!audio)} />
                <img className="meeting__body__bar__right-bar__icon" src={video ? camOn : camOff} alt="Webcam" onClick={() => setVideo(!video)} />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}