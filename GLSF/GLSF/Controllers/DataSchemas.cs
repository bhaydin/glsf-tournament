using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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

			builder.Entity<Member>().HasKey(table => new
			{
				table.Id,
				table.BoatId,
				table.TournamentId
			});

			builder.Entity<Member>().HasOne<Boat>().WithOne().HasForeignKey<Member>(x => new { x.BoatId, x.TournamentId});
			builder.Entity<Fish>().HasOne<Member>().WithOne().HasForeignKey<Fish>(x => new { x.MemberId, x.TournamentId, x.BoatId });
			builder.Entity<Fish>().HasOne<Station>().WithOne().HasForeignKey<Fish>(x => new { x.StationNumber, x.TournamentId });
			builder.Entity<Fish>().HasOne<Boat>().WithOne().HasForeignKey<Fish>(x => new { x.BoatId, x.TournamentId });
			builder.Entity<Member>().HasOne<Tournament>().WithOne().HasForeignKey<Member>(x => x.TournamentId);
			builder.Entity<Fish>().HasOne<Tournament>().WithOne().HasForeignKey<Fish>(x => x.TournamentId );
			builder.Entity<Boat>().HasOne<Tournament>().WithOne().HasForeignKey<Boat>(x => x.TournamentId);
			builder.Entity<Station>().HasOne<Tournament>().WithOne().HasForeignKey<Station>(x => x.TournamentId);

		}
		public DbSet<Fish> Fishes { get; set; }
		public DbSet<Tournament> Tournaments { get; set; }
		public DbSet<Boat> Boats { get; set; }
		public DbSet<Member> Members { get; set; }
		public DbSet<Station> Stations { get; set; }
	}

	public class Fish
	{
		public double Weight { set; get; }
		public double Length { set; get; }
		public string Species { set; get; }
		public string? Image { set; get; }
		public string Date { set; get; }
		public string? SampleNumber { set; get; }
		public bool HasTag { set; get; }
		public string? Port { set; get; }
		public bool IsValid { set; get; }
		public int StationNumber{ get; set; }
		public int MemberId { get; set; }
		public int TournamentId { get; set; }
		public int BoatId { get; set; }
		[Key]
		public int? Id { get; set; }
	}

	public class Tournament
	{
		public string StartDate { get; set; }
		public string EndDate { get; set; }
		public string Name { get; set; }
		public string Location { get; set; }
		[Key]
		public int? Id { get; set; }
	}

	public class Boat
	{
		public string Name { get; set; }
		public double Length { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]
		public int TournamentId { get; set; }

	}

	public class Member
	{
		public string Name { get; set; }
		public int Age { get; set; }
		public bool IsCaptain { get; set; }
		public bool IsJunior { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]
		public int BoatId { get; set; }
		[Key, Column(Order = 2)]
		public int TournamentId { get; set; }
	}

	public class Group
	{
		public Boat Boat { get; set; }
		public List<Member> Members { get; set; }
	}

	public class Station
	{
		public string Port { get; set; }
		[Key, Column(Order = 0)]
		public int Id { get; set; }
		[Key, Column(Order = 1)]
		public int TournamentId { get; set; }

	}
}
