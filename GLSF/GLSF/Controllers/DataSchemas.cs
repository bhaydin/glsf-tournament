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
			builder.Entity<BoatGroup>().HasKey(table => new
			{
				table.Id,
				table.TournamentId
			});

		}

		public DbSet<Fish> Fish { get; set; }
		public DbSet<Tournament> Tournament { get; set; }
		public DbSet<BoatGroup> BoatGroup { get; set; }
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
		public string? Location { set; get; }
		public int StationNumber { set; get; }
		public bool isValid { set; get; }
		[ForeignKey("TournamentId"), Column(Order = 1)]
		public int TournamentId { get; set; }
		[ForeignKey("BoatId"), Column(Order = 0)]
		public int BoatId { get; set; }
		[Key]
		public int Id { set; get; }
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

	public class BoatGroup
	{
		public string Name { get; set; }
		public string AgeGroup { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]
		public int TournamentId { get; set; }
		[ForeignKey("TournamentId")]
		public Tournament Tournament { get; set; }
	}
}
