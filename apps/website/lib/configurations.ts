import axios from 'axios'

export const NODE_ENV = process.env.NODE_ENV

export const API_DEFAULT_PORT = 8080

export const API_URL =
  process.env['NEXT_PUBLIC_API_URL'] != null
    ? process.env['NEXT_PUBLIC_API_URL']
    : `http://127.0.0.1:${API_DEFAULT_PORT}`

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
