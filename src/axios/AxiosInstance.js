import axios from "axios";

const url = "https://chatapp-server-nodejs.herokuapp.com";
// const url = 'http://localhost:9000'

export const AxiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

export const userImages = (img) => {
  return `${url}/user_images/${img}`;
};
