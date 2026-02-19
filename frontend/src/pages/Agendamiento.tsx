import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { medicosService } from '../services/medicosService'
import { citasService } from '../services/citasService'
import { Medico, Especialidad, Sede, HorarioDisponible } from '../types'
import { Search, MapPin, Star, Calendar, ArrowRight, Clock } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Agendamiento() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [paso, setPaso] = useState(1)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [, setHorarios] = useState<HorarioDisponible[]>([])
  
  const [filtros, setFiltros] = useState({
    especialidadID: 0,
    nombreMedico: '',
    sedeID: 0,
  })
  
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<Medico | null>(null)
  const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('')
  
  const [resumen] = useState({
    valorConsulta: 180000,
    valorCobertura: 145000,
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (filtros.especialidadID || filtros.nombreMedico || filtros.sedeID) {
      buscarMedicos()
    }
  }, [filtros])

  useEffect(() => {
    if (medicoSeleccionado && sedeSeleccionada) {
      loadHorarios()
    }
  }, [medicoSeleccionado, sedeSeleccionada])

  const loadInitialData = async () => {
    try {
      const [especialidadesData, sedesData] = await Promise.all([
        medicosService.getEspecialidades(),
        medicosService.getSedes(),
      ])
      setEspecialidades(especialidadesData)
      setSedes(sedesData)
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
    }
  }

  const buscarMedicos = async () => {
    try {
      setLoading(true)
      const resultado = await medicosService.buscarMedicos({
        especialidadID: filtros.especialidadID || undefined,
        nombreMedico: filtros.nombreMedico || undefined,
        sedeID: filtros.sedeID || undefined,
        fecha: format(new Date(), 'yyyy-MM-dd'),
      })
      console.log('Médicos encontrados:', resultado)
      console.log('Cantidad de médicos:', resultado.length)
      setMedicos(resultado)
    } catch (error) {
      console.error('Error al buscar médicos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadHorarios = async () => {
    if (!medicoSeleccionado || !sedeSeleccionada) return

    try {
      const horariosData = await medicosService.getHorarios(
        medicoSeleccionado.medicoID,
        sedeSeleccionada.sedeID,
        format(new Date(), 'yyyy-MM-dd')
      )
      setHorarios(horariosData)
    } catch (error) {
      console.error('Error al cargar horarios:', error)
    }
  }

  const handleSeleccionarMedico = (medico: Medico) => {
    setMedicoSeleccionado(medico)
    if (medico.sedes && medico.sedes.length > 0) {
      setSedeSeleccionada(medico.sedes[0])
    }
    setPaso(3)
  }

  const handleConfirmarCita = async () => {
    if (!user || !medicoSeleccionado || !sedeSeleccionada || !fechaSeleccionada || !horaSeleccionada) {
      alert('Por favor complete todos los campos')
      return
    }

    try {
      setLoading(true)
      
      const fechaHora = new Date(fechaSeleccionada)
      const [hora, minuto] = horaSeleccionada.split(':')
      fechaHora.setHours(parseInt(hora), parseInt(minuto))

      await citasService.crearCita({
        pacienteID: user.usuarioID,
        medicoID: medicoSeleccionado.medicoID,
        sedeID: sedeSeleccionada.sedeID,
        fechaCita: fechaHora.toISOString(),
        tipoServicio: medicoSeleccionado.especialidadNombre,
        valorConsulta: resumen.valorConsulta,
        valorCobertura: resumen.valorCobertura,
      })

      alert('¡Cita agendada exitosamente!')
      navigate('/')
    } catch (error) {
      console.error('Error al crear cita:', error)
      alert('Error al agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  const limpiarFiltros = () => {
    setFiltros({
      especialidadID: 0,
      nombreMedico: '',
      sedeID: 0,
    })
    setMedicos([])
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Inicio
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Agendamiento de Citas</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paso >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Búsqueda</p>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paso >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Selección</p>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paso >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Horario</p>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paso >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              4
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Confirmación</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {paso === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros de Búsqueda</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  <select
                    value={filtros.especialidadID}
                    onChange={(e) => setFiltros({ ...filtros, especialidadID: parseInt(e.target.value) })}
                    className="input-field"
                  >
                    <option value="0">Todas las especialidades</option>
                    {especialidades.map((esp) => (
                      <option key={esp.especialidadID} value={esp.especialidadID}>
                        {esp.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Médico</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filtros.nombreMedico}
                      onChange={(e) => setFiltros({ ...filtros, nombreMedico: e.target.value })}
                      placeholder="Ej: Dr. Sánchez"
                      className="input-field pl-10"
                    />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación (Sede)</label>
                  <div className="space-y-2">
                    {sedes.map((sede) => (
                      <label key={sede.sedeID} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filtros.sedeID === sede.sedeID}
                          onChange={(e) => setFiltros({ ...filtros, sedeID: e.target.checked ? sede.sedeID : 0 })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{sede.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={limpiarFiltros}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>

              {/* Mostrar resultados de búsqueda */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Buscando médicos...</p>
                </div>
              ) : medicos.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Médicos Disponibles ({medicos.length})
                  </h3>
                  <div className="space-y-4">
                    {medicos.map((medico) => (
                      <div
                        key={medico.medicoID}
                        className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-colors cursor-pointer ${
                          medicoSeleccionado?.medicoID === medico.medicoID
                            ? 'border-primary-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => handleSeleccionarMedico(medico)}
                      >
                        <div className="flex items-start gap-6">
                          <img
                            src={medico.fotoURL || 'https://via.placeholder.com/96'}
                            alt={medico.nombreCompleto}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{medico.nombreCompleto}</h3>
                                <p className="text-primary-600 font-medium">{medico.especialidadNombre}</p>
                              </div>
                              {medicoSeleccionado?.medicoID === medico.medicoID && (
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                                  SELECCIONADO
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-semibold text-gray-900">
                                  {medico.calificacion.toFixed(1)}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">
                                  ({medico.numeroResenas} reseñas)
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-3">
                              {medico.biografia || 'Especialista altamente calificado con amplia experiencia.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setPaso(2)}
                    disabled={!medicoSeleccionado}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Continuar con {medicoSeleccionado?.nombreCompleto || 'médico seleccionado'}
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Médicos Disponibles ({medicos.length})
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : medicos.length > 0 ? (
                medicos.map((medico) => (
                  <div
                    key={medico.medicoID}
                    className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-colors cursor-pointer ${
                      medicoSeleccionado?.medicoID === medico.medicoID
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleSeleccionarMedico(medico)}
                  >
                    <div className="flex items-start gap-6">
                      <img
                        src={medico.fotoURL || 'https://via.placeholder.com/96'}
                        alt={medico.nombreCompleto}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{medico.nombreCompleto}</h3>
                            <p className="text-primary-600 font-medium">{medico.especialidadNombre}</p>
                          </div>
                          {medicoSeleccionado?.medicoID === medico.medicoID && (
                            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                              SELECCIONADO
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold text-gray-900">
                              {medico.calificacion.toFixed(1)}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                              ({medico.numeroResenas} reseñas)
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">
                          {medico.biografia || 'Especialista altamente calificado con amplia experiencia.'}
                        </p>

                        {medico.proximaCita && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-flex">
                            <Calendar className="w-4 h-4" />
                            <span>Próxima cita: {medico.proximaCita}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron médicos</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          )}

          {paso === 3 && medicoSeleccionado && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button
                onClick={() => setPaso(2)}
                className="text-primary-600 mb-4 hover:text-primary-700"
              >
                ← Cambiar médico
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seleccionar Fecha y Hora</h2>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Horarios disponibles para Miércoles 4 de Octubre</h3>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {[...Array(7)].map((_, i) => {
                    const fecha = addDays(new Date(), i)
                    const isSelected = fechaSeleccionada?.getDate() === fecha.getDate()
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setFechaSeleccionada(fecha)}
                        className={`p-3 rounded-lg text-center ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-xs">{format(fecha, 'EEE', { locale: es })}</div>
                        <div className="text-lg font-bold">{format(fecha, 'd')}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">MAÑANA</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['08:00 AM', '08:30 AM', '09:00 AM', '10:30 AM'].map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium ${
                        horaSeleccionada === hora
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">TARDE</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['02:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'].map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium ${
                        horaSeleccionada === hora
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPaso(4)}
                disabled={!fechaSeleccionada || !horaSeleccionada}
                className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {paso === 4 && medicoSeleccionado && sedeSeleccionada && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Confirmar Cita</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={medicoSeleccionado.fotoURL || 'https://via.placeholder.com/64'}
                    alt={medicoSeleccionado.nombreCompleto}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{medicoSeleccionado.nombreCompleto}</h3>
                    <p className="text-sm text-gray-600">{medicoSeleccionado.especialidadNombre}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{medicoSeleccionado.calificacion}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">
                      {fechaSeleccionada && format(fechaSeleccionada, "EEEE, d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">{horaSeleccionada}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">
                      {sedeSeleccionada.nombre} - {sedeSeleccionada.direccion}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={handleConfirmarCita}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : (
                    <>
                      Confirmar Cita
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary-600 rounded-xl shadow-lg p-6 text-white sticky top-4">
            <h3 className="text-xl font-bold mb-6">Resumen de Cita</h3>
            
            {medicoSeleccionado ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-primary-100 mb-1">MÉDICO</p>
                  <p className="font-semibold">{medicoSeleccionado.nombreCompleto}</p>
                  <p className="text-sm text-primary-100">{medicoSeleccionado.especialidadNombre}</p>
                </div>

                {fechaSeleccionada && horaSeleccionada && (
                  <>
                    <div className="border-t border-primary-500 pt-4">
                      <p className="text-sm text-primary-100 mb-1">FECHA Y HORA</p>
                      <p className="font-semibold">
                        {format(fechaSeleccionada, "EEEE, d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm">{horaSeleccionada}</p>
                    </div>

                    <div className="border-t border-primary-500 pt-4">
                      <p className="text-sm text-primary-100 mb-1">SEDE</p>
                      <p className="font-semibold">{sedeSeleccionada?.nombre}</p>
                      <p className="text-sm text-primary-100">{sedeSeleccionada?.direccion}</p>
                    </div>
                  </>
                )}

                <div className="border-t border-primary-500 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-primary-100">Valor Consulta</span>
                    <span className="font-semibold">${resumen.valorConsulta.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-primary-100">Cobertura Sanitas</span>
                    <span className="font-semibold text-green-300">-${resumen.valorCobertura.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-primary-500 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total a Pagar</span>
                      <span className="text-2xl font-bold">
                        ${(resumen.valorConsulta - resumen.valorCobertura).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-primary-100 mt-4">
                  Al confirmar, aceptas nuestras Políticas de cancelación y el tratamiento de datos personales.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                <p className="text-primary-100">Selecciona un médico para ver el resumen de tu cita</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">PROMO SD'2</h4>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
              <p className="text-sm mb-2">NUEVO SERVICIO</p>
              <p className="font-bold text-lg mb-2">Telemedicina disponible 24/7</p>
              <p className="text-xs">Consulta médica al instante desde tu hogar</p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">¿Necesitas ayuda?</p>
                <p className="text-xs text-gray-600">
                  Llámanos a la línea nacional <span className="font-semibold">01-8000-123-4567</span> para soporte inmediato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
