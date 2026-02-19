using System.ComponentModel.DataAnnotations;

namespace ClinicaAPI.Models;

public class Sede
{
    [Key]
    public int SedeID { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Direccion { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Ciudad { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Telefono { get; set; }

    [MaxLength(150)]
    public string? Email { get; set; }

    public bool Activo { get; set; } = true;

    public virtual ICollection<MedicoSede>? MedicosSedes { get; set; }
    public virtual ICollection<Cita>? Citas { get; set; }
}
