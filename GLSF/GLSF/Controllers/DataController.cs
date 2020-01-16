using GLSF.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
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

		[Route("fish")]
		[HttpGet]
		public async Task<string> GetFish()
		{
			List<Fish> allFishes = await _context.Fishes.ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}

		[Route("fish")]
		[HttpPut]
		public async Task<Fish> UpdateFish([FromBody]Fish fish)
		{
			if (fish != null)
			{
				_context.Fishes.Update(fish);
				await _context.SaveChangesAsync();
			}
			return fish;
		}

		[Route("fish/{id}")]
		[HttpDelete]
		public async Task<int> DeleteFish(int id)
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

		[Route("boat")]
		[HttpGet]
		public async Task<string> GetBoats()
		{
			List<Boat> allBoats = await _context.Boats.ToListAsync();
			return JsonConvert.SerializeObject(allBoats);
		}

		[Route("member")]
		[HttpGet]
		public async Task<string> GetMembers()
		{
			List<Member> allMembers = await _context.Members.ToListAsync();
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

		[Route("tournament")]
		[HttpGet]
		public async Task<string> GetTournaments()
		{
			List<Tournament> allTournaments = await _context.Tournaments.ToListAsync();
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

		[Route("station")]
		[HttpGet]
		public async Task<string> GetStations()
		{
			List<Station> allStations = await _context.Stations.ToListAsync();
			return JsonConvert.SerializeObject(allStations);
		}
	}
}