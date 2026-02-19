using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class MedicoSede
{
    [Key]
    public int MedicoSedeID { get; set; }

    [Required]
    public int MedicoID { get; set; }

    [Required]
    public int SedeID { get; set; }

    public bool Activo { get; set; } = true;

    [ForeignKey("MedicoID")]
    public virtual Medico? Medico { get; set; }

    [ForeignKey("SedeID")]
    public virtual Sede? Sede { get; set; }
}
