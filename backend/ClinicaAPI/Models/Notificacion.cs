using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class Notificacion
{
    [Key]
    public int NotificacionID { get; set; }

    [Required]
    public int UsuarioID { get; set; }

    [Required]
    [MaxLength(50)]
    public string Tipo { get; set; } = "Información";

    [Required]
    public string Mensaje { get; set; } = string.Empty;

    public bool Leida { get; set; } = false;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    [ForeignKey("UsuarioID")]
    public virtual Usuario? Usuario { get; set; }
}
