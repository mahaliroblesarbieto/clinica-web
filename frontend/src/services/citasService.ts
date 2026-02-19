import api from './api'
import { Cita, CrearCitaRequest } from '../types'

export const citasService = {
  async getCitasPaciente(pacienteId: number): Promise<Cita[]> {
    const response = await api.get(`/Citas/paciente/${pacienteId}`)
    return response.data
  },

  async getCitasProximas(pacienteId: number): Promise<Cita[]> {
    const response = await api.get(`/Citas/proximas/${pacienteId}`)
    return response.data
  },

  async getHistorialCitas(pacienteId: number): Promise<Cita[]> {
    const response = await api.get(`/Citas/historial/${pacienteId}`)
    return response.data
  },

  async getCita(citaId: number): Promise<Cita> {
    const response = await api.get(`/Citas/${citaId}`)
    return response.data
  },

  async crearCita(data: CrearCitaRequest): Promise<Cita> {
    const response = await api.post('/Citas', data)
    return response.data
  },

  async actualizarEstado(citaId: number, nuevoEstado: string): Promise<void> {
    await api.put(`/Citas/${citaId}/estado`, { nuevoEstado })
  },

  async cancelarCita(citaId: number): Promise<void> {
    await api.delete(`/Citas/${citaId}`)
  },
}
