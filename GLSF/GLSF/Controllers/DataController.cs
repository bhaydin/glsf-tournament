using GLSF.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
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
		[HttpGet("{queryBy}")]
		public async Task<string> GetFishQueryBy(string queryBy)
		{
			List<Fish> allFishes = await _context.Fishes.ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}

		//Boats
		[Route("boat")]
		[HttpPost]
		public async Task<Boat> InsertBoat([FromBody]Boat group)
		{
			await _context.Boats.AddAsync(group);
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
      DateTime myDate = DateTime.ParseExact(date, "MM/dd/yyyy", System.Globalization.CultureInfo.InvariantCulture);
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

		[Route("station")]
		[HttpGet]
		public async Task<string> GetStations()
		{
			List<Station> allStations = await _context.Stations.ToListAsync();
			return JsonConvert.SerializeObject(allStations);
		}
	}
}