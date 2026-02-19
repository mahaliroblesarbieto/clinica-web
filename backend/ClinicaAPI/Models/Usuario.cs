using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class Usuario
{
    [Key]
    public int UsuarioID { get; set; }

    [Required]
    [MaxLength(200)]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public DateTime FechaNacimiento { get; set; }

    [MaxLength(20)]
    public string? Telefono { get; set; }

    [MaxLength(300)]
    public string? Direccion { get; set; }

    [Required]
    [MaxLength(20)]
    public string TipoUsuario { get; set; } = "Paciente";

    public DateTime FechaRegistro { get; set; } = DateTime.Now;

    public DateTime? UltimoAcceso { get; set; }

    public bool Activo { get; set; } = true;

    public virtual ICollection<Cita>? CitasComoPaciente { get; set; }
    public virtual ICollection<Notificacion>? Notificaciones { get; set; }
    public virtual Medico? DatosMedico { get; set; }
}
