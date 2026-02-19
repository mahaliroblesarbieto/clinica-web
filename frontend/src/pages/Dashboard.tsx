import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { citasService } from '../services/citasService'
import { Cita } from '../types'
import { Calendar, Clock, MapPin, Eye, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [citasProximas, setCitasProximas] = useState<Cita[]>([])
  const [historialCitas, setHistorialCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCitas()
  }, [user])

  const loadCitas = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [proximas, historial] = await Promise.all([
        citasService.getCitasProximas(user.usuarioID),
        citasService.getHistorialCitas(user.usuarioID),
      ])
      setCitasProximas(proximas)
      setHistorialCitas(historial)
    } catch (error) {
      console.error('Error al cargar citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarCita = async (citaId: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return

    try {
      await citasService.cancelarCita(citaId)
      loadCitas()
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      alert('Error al cancelar la cita')
    }
  }

  const handleConfirmarCita = async (citaId: number) => {
    try {
      await citasService.actualizarEstado(citaId, 'Confirmada')
      loadCitas()
    } catch (error) {
      console.error('Error al confirmar cita:', error)
      alert('Error al confirmar la cita')
    }
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completada':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Need a check-up?</h1>
            <p className="text-lg mb-6 text-blue-100">
              Book your next appointment with our top specialists today and<br />
              keep your health in check.
            </p>
            <button
              onClick={() => navigate('/agendamiento')}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Book Now
            </button>
          </div>
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="currentColor">
              <path d="M150 50 L200 150 L150 250 L100 150 Z" />
              <circle cx="150" cy="150" r="80" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
        <button
          onClick={() => navigate('/agendamiento')}
          className="text-primary-600 font-medium hover:text-primary-700"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : citasProximas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {citasProximas.slice(0, 3).map((cita) => (
            <div key={cita.citaID} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`px-4 py-2 text-sm font-medium ${cita.estado === 'Confirmada' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                {cita.estado}
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={cita.medicoFoto || 'https://via.placeholder.com/64'}
                    alt={cita.medicoNombre}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{cita.medicoNombre}</h3>
                    <p className="text-gray-600 text-sm">{cita.especialidadNombre}</p>
                  </div>
                  <button
                    onClick={() => handleCancelarCita(cita.citaID)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(parseISO(cita.fechaCita), "PPP 'at' h:mm a", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{cita.sedeNombre}</span>
                  </div>
                </div>

                {cita.estado === 'Pendiente' && (
                  <button
                    onClick={() => handleConfirmarCita(cita.citaID)}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">New Appointment</h3>
              <p className="text-gray-600 text-sm mb-4">Schedule your next medical checkup<br />with a specialist.</p>
              <button
                onClick={() => navigate('/agendamiento')}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center mb-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
          <p className="text-gray-600 mb-4">Schedule your first appointment with our specialists</p>
          <button
            onClick={() => navigate('/agendamiento')}
            className="btn-primary"
          >
            Book Appointment
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Appointment History</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historialCitas.map((cita) => (
              <tr key={cita.citaID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {format(parseISO(cita.fechaCita), 'MMM dd, yyyy', { locale: es })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(parseISO(cita.fechaCita), 'h:mm a')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={cita.medicoFoto || 'https://via.placeholder.com/40'}
                      alt=""
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{cita.medicoNombre}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cita.tipoServicio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cita.estado === 'Completada' ? 'Routine Checkup' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(cita.estado)}`}>
                    {cita.estado.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {historialCitas.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointment history yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
