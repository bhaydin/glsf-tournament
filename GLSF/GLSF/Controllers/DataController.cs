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
			await _context.Fish.AddAsync(fish);
			await _context.SaveChangesAsync();
			return fish;
		}

		[Route("fish")]
		[HttpGet]
		public async Task<string> GetFish()
		{
			List<Fish> allFishes = await _context.Fish.ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}

		[Route("fish")]
		[HttpGet("{queryBy}")]
		public async Task<string> GetFishQueryBy(string queryBy)
		{
			List<Fish> allFishes = await _context.Fish.ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}

		//Boats
		[Route("group")]
		[HttpPost]
		public async Task<BoatGroup> InsertGroup([FromBody]BoatGroup group)
		{
			await _context.BoatGroup.AddAsync(group);
			await _context.SaveChangesAsync();
			return group;
		}

		[Route("group")]
		[HttpGet]
		public async Task<string> GetGroups()
		{
			List<BoatGroup> allGroups = await _context.BoatGroup.ToListAsync();
			return JsonConvert.SerializeObject(allGroups);
		}

		//Tournaments
		[Route("tournament")]
		[HttpPost]
		public async Task<Tournament> InsertTournament([FromBody]Tournament tournament)
		{
			await _context.Tournament.AddAsync(tournament);
			await _context.SaveChangesAsync();
			return tournament;
		}

		[Route("tournament")]
		[HttpGet]
		public async Task<string> GetTournaments()
		{
			List<Tournament> allTournaments = await _context.Tournament.ToListAsync();
			return JsonConvert.SerializeObject(allTournaments);
		}
	}
}