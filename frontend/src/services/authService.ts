import api from './api'
import { LoginRequest, RegisterRequest, Usuario } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<Usuario> {
    const response = await api.post('/Auth/login', credentials)
    return response.data
  },

  async register(data: RegisterRequest): Promise<Usuario> {
    const response = await api.post('/Auth/register', data)
    return response.data
  },

  async getUsuario(id: number): Promise<Usuario> {
    const response = await api.get(`/Auth/usuario/${id}`)
    return response.data
  },
}
