using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class HorarioDisponible
{
    [Key]
    public int HorarioID { get; set; }

    [Required]
    public int MedicoID { get; set; }

    [Required]
    public int SedeID { get; set; }

    [Required]
    public int DiaSemana { get; set; }

    [Required]
    public TimeSpan HoraInicio { get; set; }

    [Required]
    public TimeSpan HoraFin { get; set; }

    public bool Activo { get; set; } = true;

    [ForeignKey("MedicoID")]
    public virtual Medico? Medico { get; set; }

    [ForeignKey("SedeID")]
    public virtual Sede? Sede { get; set; }
}
