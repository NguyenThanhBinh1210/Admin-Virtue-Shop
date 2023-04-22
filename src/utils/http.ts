import axios, { type AxiosInstance } from 'axios'
import omit from 'lodash/omit'
import { clearLS, getAccessTokenFromLS, setAccesTokenToLS, setProfileFromLS } from './auth'
class Http {
  instance: AxiosInstance
  private accessToken?: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      // baseURL: 'http://localhost:5000/api/',
      baseURL: 'https://api-virtue-shop.onrender.com/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        if (this.accessToken) {
          config.headers['token'] = `Beare ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      async (response) => {
        const { url } = response.config
        if (url === '/user/sign-in' || url === '/user/sign-up') {
          const dataProfile = response.data.data
          const newUser = omit(dataProfile, ['password', 'isAdmin'])
          this.accessToken = response.data?.access_token
          if (response.data.status !== 'ERR') {
            setProfileFromLS(newUser)
            setAccesTokenToLS(this.accessToken as string)
          }
        } else if (url === '/user/log-out') {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
