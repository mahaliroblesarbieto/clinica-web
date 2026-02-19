import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { Eye, EyeOff, Shield, Lock } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      setError('Debes aceptar los términos de servicio')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await authService.register(formData)
      login(response)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-xl w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Clínica Médica</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro de Usuarios</h2>
            <p className="text-gray-600">Complete sus datos para crear su expediente digital.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                name="nombreCompleto"
                type="text"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <Lock className="absolute right-11 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  Acepto los <Link to="#" className="text-primary-600 underline">Términos de Servicio</Link> y la{' '}
                  <Link to="#" className="text-primary-600 underline">Política de Privacidad</Link> de la clínica.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Shield className="w-5 h-5" />
              <span>HIPAA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Lock className="w-5 h-5" />
              <span>SECURE DATA ENCRYPTION</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tiene una cuenta?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Inicie Sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-12">
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Gestione su salud de forma digital y segura
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Acceda a sus resultados, agende citas y consulte con especialistas desde la comodidad de su hogar.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Agendamiento rápido</h3>
                <p className="text-gray-600">Citas disponibles en menos de 24 horas.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Privacidad total</h3>
                <p className="text-gray-600">Sus datos médicos están cifrados de extremo a extremo.</p>
              </div>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600"
            alt="Hospital"
            className="mt-12 rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  )
}
