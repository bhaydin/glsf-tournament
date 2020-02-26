using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GLSF.Controllers
{
	public class fishDBContext : DbContext
	{
		public fishDBContext(DbContextOptions<fishDBContext> options) : base(options)
		{

		}

		protected override void OnModelCreating(ModelBuilder builder) {
			builder.Entity<Boat>().HasKey(table => new
			{
				table.Id,
				table.TournamentId
			});

			builder.Entity<Station>().HasKey(table => new
			{
				table.Id,
				table.TournamentId
			});

		}
		public DbSet<Fish> Fishes { get; set; }
		public DbSet<Tournament> Tournaments { get; set; }
		public DbSet<Boat> Boats { get; set; }
		public DbSet<Station> Stations { get; set; }
	}

	public class Fish
	{
		public double Weight { set; get; }
		public double Length { set; get; }
		public string Species { set; get; }
		public string? Image { set; get; }
		public string Date { set; get; }
		public int? SampleNumber { set; get; }
		public bool HasTag { set; get; }
		public string? Port { set; get; }
		public bool isValid { set; get; }
		public int StationNumber{ get; set; }
		public int TournamentId { get; set; }
		public int BoatId { get; set; }
		[Key]
		public int? Id { set; get; }
		[ForeignKey("BoatId, TournamentId")]
		public virtual Boat Boat { get; set; }
		[ForeignKey("StationNumber, TournamentId")]
		public virtual Station Station { get; set; }
	}

	public class Tournament
	{
		public string StartDate { get; set; }
		public string EndDate { get; set; }
		public string Name { get; set; }
		public string Location { get; set; }
		[Key]
		public int Id { get; set; }
	}

	public class Boat
	{
		public string Name { get; set; }
		public string Members { get; set; }
		public double Length { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]

		public int TournamentId { get; set; }
		[ForeignKey("TournamentId")]
		public Tournament Tournament { get; set; }
	}

	public class Station
	{
		public string Port { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]
		public int TournamentId { get; set; }
		[ForeignKey("TournamentId")]
		public Tournament Tournament { get; set; }
	}
}
