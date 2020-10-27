import Axios from "axios";
import { ResponseData } from "../interfaces/response-data";

export function createSession(host: string, title: string, password: string): Promise<Response & ResponseData> {
  return Axios.post(`${process.env.REACT_APP_SERVER}/session`, JSON.stringify({
    title,
    host,
    password
  })
  );
}

export function connectSession(host: string, password: string, socket: string): Promise<Response & ResponseData> {
  return Axios.post(`${process.env.REACT_APP_SERVER}/connect/${socket}`, JSON.stringify({
    host,
    password
  })
  );
}

export function verifySocket(url: string): Promise<Response> {
  return Axios.get(`${process.env.REACT_APP_SERVER}/connect`, {
    params: {
      url
    }
  });
}