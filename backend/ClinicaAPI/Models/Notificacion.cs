using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class Notificacion
{
    [Key]
    public int NotificacionID { get; set; }

    [Required]
    public int UsuarioID { get; set; }

    public int? CitaID { get; set; }

    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Mensaje { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Tipo { get; set; } = "Información";

    public bool Leida { get; set; } = false;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    [ForeignKey("UsuarioID")]
    public virtual Usuario? Usuario { get; set; }

    [ForeignKey("CitaID")]
    public virtual Cita? Cita { get; set; }
}
