using Microsoft.EntityFrameworkCore;
using ClinicaAPI.Models;

namespace ClinicaAPI.Data;

public class ClinicaDbContext : DbContext
{
    public ClinicaDbContext(DbContextOptions<ClinicaDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Especialidad> Especialidades { get; set; }
    public DbSet<Sede> Sedes { get; set; }
    public DbSet<Medico> Medicos { get; set; }
    public DbSet<MedicoSede> MedicosSedes { get; set; }
    public DbSet<HorarioDisponible> HorariosDisponibles { get; set; }
    public DbSet<Cita> Citas { get; set; }
    public DbSet<Notificacion> Notificaciones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuarios");
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.TipoUsuario);
        });

        modelBuilder.Entity<Especialidad>(entity =>
        {
            entity.ToTable("Especialidades");
            entity.HasIndex(e => e.Nombre).IsUnique();
        });

        modelBuilder.Entity<Sede>(entity =>
        {
            entity.ToTable("Sedes");
        });

        modelBuilder.Entity<Medico>(entity =>
        {
            entity.ToTable("Medicos");
            entity.HasIndex(e => e.NumeroLicencia).IsUnique();
            entity.HasIndex(e => e.EspecialidadID);

            entity.HasOne(m => m.Usuario)
                .WithOne(u => u.DatosMedico)
                .HasForeignKey<Medico>(m => m.UsuarioID)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Especialidad)
                .WithMany(e => e.Medicos)
                .HasForeignKey(m => m.EspecialidadID)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MedicoSede>(entity =>
        {
            entity.ToTable("MedicosSedes");
            entity.HasIndex(e => new { e.MedicoID, e.SedeID }).IsUnique();

            entity.HasOne(ms => ms.Medico)
                .WithMany(m => m.MedicosSedes)
                .HasForeignKey(ms => ms.MedicoID)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(ms => ms.Sede)
                .WithMany(s => s.MedicosSedes)
                .HasForeignKey(ms => ms.SedeID)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<HorarioDisponible>(entity =>
        {
            entity.ToTable("HorariosDisponibles");

            entity.HasOne(h => h.Medico)
                .WithMany(m => m.Horarios)
                .HasForeignKey(h => h.MedicoID)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Cita>(entity =>
        {
            entity.ToTable("Citas");
            entity.HasIndex(e => e.PacienteID);
            entity.HasIndex(e => e.MedicoID);
            entity.HasIndex(e => e.FechaCita);
            entity.HasIndex(e => e.Estado);

            entity.HasOne(c => c.Paciente)
                .WithMany(u => u.CitasComoPaciente)
                .HasForeignKey(c => c.PacienteID)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Medico)
                .WithMany(m => m.Citas)
                .HasForeignKey(c => c.MedicoID)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Sede)
                .WithMany(s => s.Citas)
                .HasForeignKey(c => c.SedeID)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Notificacion>(entity =>
        {
            entity.ToTable("Notificaciones");
            entity.HasIndex(e => new { e.UsuarioID, e.Leida });

            entity.HasOne(n => n.Usuario)
                .WithMany(u => u.Notificaciones)
                .HasForeignKey(n => n.UsuarioID)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
