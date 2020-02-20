using GLSF.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ServerDatabase.Controllers
{
	[Route("api/database")]
	public class FishController : Controller
	{		

		private readonly fishDBContext _context;
		public FishController(fishDBContext fish){
			_context = fish;
		}

		//Fishes
		[Route("fish")]
		[HttpPost]
		public async Task<Fish> InsertFish([FromBody]Fish fish)
		{
			await _context.Fishes.AddAsync(fish);
			await _context.SaveChangesAsync();
			return fish;
		}

		[Route("fish/tournamentId/{id}")]
		[HttpGet]
		public async Task<string> GetFishByTournamentId(Guid id)
		{
			List<Fish> allFishes = await _context.Fishes.Where(fish => fish.TournamentId == id).ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}

		[Route("fish/fishId/{id}")]
		[HttpGet]
		public async Task<string> GetFishById(Guid id)
		{
			Fish fish = await _context.Fishes.FindAsync(id);
			return JsonConvert.SerializeObject(fish);
		}

		[Route("fish")]
		[HttpPut]
		public async Task<Fish> UpdateFish([FromBody]Fish fish)
		{
			_context.Fishes.Update(fish);
			await _context.SaveChangesAsync();
			return fish;
		}

		[Route("fish/fishId/{id}")]
		[HttpDelete]
		public async Task<Guid> DeleteFish(Guid id)
		{
			Fish fish = new Fish () { Id = id };
			_context.Fishes.Attach(fish);
			_context.Fishes.Remove(fish);
			await _context.SaveChangesAsync();
			return id;
		}

		//Boats
		[Route("boat")]
		[HttpPost]
		public async Task<Group> InsertGroup([FromBody]Group group)
		{
			await _context.Members.AddRangeAsync(group.Members);
			await _context.Boats.AddAsync(group.Boat);
			await _context.SaveChangesAsync();
			return group;
		}

		//ID is tournament ID
		[Route("boat/{id}")]
		[HttpGet]
		public async Task<string> GetBoatsByTournamentId(Guid id)
		{
			List<Boat> allBoats = await _context.Boats.Where(boat => boat.TournamentId == id).ToListAsync();
			return JsonConvert.SerializeObject(allBoats);
		}

		[Route("member/{id}")]
		[HttpGet]
		public async Task<string> GetMembersByBoatId(Guid id)
		{
			List<Member> allMembers = await _context.Members.Where(member => member.TournamentId == id).ToListAsync();
			return JsonConvert.SerializeObject(allMembers);
		}

		//Tournaments
		[Route("tournament")]
		[HttpPost]
		public async Task<Tournament> InsertTournament([FromBody]Tournament tournament)
		{
			await _context.Tournaments.AddAsync(tournament);
			await _context.SaveChangesAsync();
			return tournament;
		}

    private DateTime ConvertToDate(string date)
    {
      DateTime myDate = DateTime.ParseExact(date, "g", new CultureInfo("en-US"), DateTimeStyles.None);
      //DateTime myDate = DateTime.ParseExact(date, "MM/dd/yyyy ", System.Globalization.CultureInfo.InvariantCulture);
      return myDate;
    }

		[Route("tournament")]
		[HttpGet]
		public async Task<string> GetTournaments()
		{
			List<Tournament> allTournaments = await _context.Tournaments.ToListAsync();
      allTournaments.Sort((x, y) => ConvertToDate(x.StartDate).CompareTo(ConvertToDate(y.StartDate)));
      allTournaments.Reverse();
      return JsonConvert.SerializeObject(allTournaments);
		}

		//Stations
		[Route("station")]
		[HttpPost]
		public async Task<Station> InsertStation([FromBody]Station station)
		{
			await _context.Stations.AddAsync(station);
			await _context.SaveChangesAsync();
			return station;
		}

		[Route("station/{id}")]
		[HttpGet]
		public async Task<string> GetStationsByTournamentId(Guid id)
		{
			List<Station> allStations = await _context.Stations.Where(station => station.TournamentId == id).ToListAsync();
			return JsonConvert.SerializeObject(allStations);
		}
	}
}