import Axios from "axios";

export function createSession(host: string, title: string, password: string): Promise<Response> {
  return Axios.post('http://localhost:9000/session', JSON.stringify({
    title,
    host,
    password
  })
  );
}