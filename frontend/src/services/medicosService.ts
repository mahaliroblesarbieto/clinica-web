import api from './api'
import { Medico, Especialidad, Sede, BuscarMedicosRequest, HorarioDisponible } from '../types'

export const medicosService = {
  async buscarMedicos(filtros: BuscarMedicosRequest): Promise<Medico[]> {
    const response = await api.post('/Medicos/buscar', filtros)
    return response.data
  },

  async getMedico(medicoId: number): Promise<Medico> {
    const response = await api.get(`/Medicos/${medicoId}`)
    return response.data
  },

  async getEspecialidades(): Promise<Especialidad[]> {
    const response = await api.get('/Medicos/especialidades')
    return response.data
  },

  async getSedes(): Promise<Sede[]> {
    const response = await api.get('/Medicos/sedes')
    return response.data
  },

  async getHorarios(medicoId: number, sedeId: number, fecha: string): Promise<HorarioDisponible[]> {
    const response = await api.get(`/Medicos/${medicoId}/horarios`, {
      params: { sedeId, fecha }
    })
    return response.data
  },
}
