export interface Usuario {
  usuarioID: number
  nombreCompleto: string
  email: string
  tipoUsuario: string
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombreCompleto: string
  email: string
  password: string
  fechaNacimiento: string
  telefono?: string
  direccion?: string
}

export interface Medico {
  medicoID: number
  nombreCompleto: string
  email: string
  telefono?: string
  especialidadID: number
  especialidadNombre: string
  numeroLicencia: string
  biografia?: string
  fotoURL?: string
  calificacion: number
  numeroResenas: number
  anosExperiencia: number
  sedes?: Sede[]
  proximaCita?: string
}

export interface Sede {
  sedeID: number
  nombre: string
  direccion: string
  ciudad: string
}

export interface Especialidad {
  especialidadID: number
  nombre: string
  descripcion?: string
}

export interface Cita {
  citaID: number
  pacienteID: number
  pacienteNombre?: string
  medicoID: number
  medicoNombre?: string
  especialidadNombre?: string
  medicoFoto?: string
  sedeID: number
  sedeNombre?: string
  sedeDireccion?: string
  fechaCita: string
  duracion: number
  tipoServicio: string
  estado: string
  motivoConsulta?: string
  valorConsulta?: number
  valorCobertura?: number
  totalPagar?: number
  fechaCreacion: string
}

export interface CrearCitaRequest {
  pacienteID: number
  medicoID: number
  sedeID: number
  fechaCita: string
  tipoServicio: string
  motivoConsulta?: string
  valorConsulta?: number
  valorCobertura?: number
}

export interface BuscarMedicosRequest {
  especialidadID?: number
  nombreMedico?: string
  sedeID?: number
  fecha?: string
}

export interface HorarioDisponible {
  fecha: string
  horasDisponibles: string[]
}
