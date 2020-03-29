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

    [Route("error/{str}")]
    [HttpPost]
    public Task<string> LogError([FromBody]String str)
    {
      System.Diagnostics.Trace.TraceError("Frontend error occurred");
      System.Diagnostics.Trace.TraceError(str);
      return null;
    }

    //Fishes
    [Route("fish")]
		[HttpPost]
		public async Task<Fish> InsertFish([FromBody]Fish fish)
		{
      try
      {
        await _context.Fishes.AddAsync(fish);
        await _context.SaveChangesAsync();
        return fish;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Object " + fish + " can not be cast to a fish");
        return null;
      }
		}

		[Route("fish/tournamentId/{id}")]
		[HttpGet]
		public async Task<string> GetFishByTournamentId(Guid id)
		{
      try
      {
        List<Fish> allFishes = await _context.Fishes.Where(fish => fish.TournamentId == id).ToListAsync();
        return JsonConvert.SerializeObject(allFishes);
      }
      catch(Exception e) 
      {
        System.Diagnostics.Trace.TraceError("Cannot get the fish with tournament id " + id);
        return null;
      }
		}

		[Route("fish/fishId/{id}")]
		[HttpGet]
		public async Task<string> GetFishById(Guid id)
		{
      try
      {
        Fish fish = await _context.Fishes.FindAsync(id);
        return JsonConvert.SerializeObject(fish);
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot get the fish with the fish id " + id);
        return null;
      }
		}

		[Route("fish")]
		[HttpPut]
		public async Task<Fish> UpdateFish([FromBody]Fish fish)
		{
      try
      {
        _context.Fishes.Update(fish);
        await _context.SaveChangesAsync();
        return fish;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot update fish " + fish);
        return null;
      }
		}

		[Route("fish/fishId/{id}")]
		[HttpDelete]
		public async Task<Guid> DeleteFish(Guid id)
		{
      try
      {
        Fish fish = new Fish() { Id = id };
        _context.Fishes.Attach(fish);
        _context.Fishes.Remove(fish);
        await _context.SaveChangesAsync();
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot delete fish with the fish id " + id);
      }

      return id;
    }

		//Boats
		[Route("boat")]
		[HttpPost]
		public async Task<Group> InsertGroup([FromBody]Group group)
		{
      try
      {
        await _context.Members.AddRangeAsync(group.Members);
        await _context.Boats.AddAsync(group.Boat);
        await _context.SaveChangesAsync();
        return group;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot insert group " + group);
        return null;
      }
		}

		//ID is tournament ID
		[Route("boat/{id}")]
		[HttpGet]
		public async Task<string> GetBoatsByTournamentId(Guid id)
		{
      try
      {
        List<Boat> allBoats = await _context.Boats.Where(boat => boat.TournamentId == id).ToListAsync();
        return JsonConvert.SerializeObject(allBoats);
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot get boats with the tournament id " + id);
        return null;
      }
		}

		[Route("member/{id}")]
		[HttpGet]
		public async Task<string> GetMembersByBoatId(Guid id)
		{
      try
      {
        List<Member> allMembers = await _context.Members.Where(member => member.TournamentId == id).ToListAsync();
        return JsonConvert.SerializeObject(allMembers);
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot get boat members with the boat id " + id);
        return null;
      }
		}

		//Tournaments
		[Route("tournament")]
		[HttpPost]
		public async Task<Tournament> InsertTournament([FromBody]Tournament tournament)
		{
      try
      {
        await _context.Tournaments.AddAsync(tournament);
        await _context.SaveChangesAsync();
        return tournament;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot insert the tournament " + tournament);
        return null;
      }
		}

    private DateTime ConvertToDate(string date)
    {
      try
      {
        DateTime myDate = DateTime.ParseExact(date, "g", new CultureInfo("en-US"), DateTimeStyles.None);
        return myDate;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot convert " + date + " to a valid date");
        return new DateTime();
      }
    }

		[Route("tournament")]
		[HttpGet]
		public async Task<string> GetTournaments()
		{
      try
      {
        List<Tournament> allTournaments = await _context.Tournaments.ToListAsync();
        allTournaments.Sort((x, y) => ConvertToDate(x.StartDate).CompareTo(ConvertToDate(y.StartDate)));
        allTournaments.Reverse();
        return JsonConvert.SerializeObject(allTournaments);
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot get tournaments from the db");
        return null;
      }
		}

		//Stations
		[Route("station")]
		[HttpPost]
		public async Task<Station> InsertStation([FromBody]Station station)
		{
      try
      {
        await _context.Stations.AddAsync(station);
        await _context.SaveChangesAsync();
        return station;
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot insert the station " + station);
        return null;
      }
		}

		[Route("station/{id}")]
		[HttpGet]
		public async Task<string> GetStationsByTournamentId(Guid id)
		{
      try
      {
        List<Station> allStations = await _context.Stations.Where(station => station.TournamentId == id).ToListAsync();
        return JsonConvert.SerializeObject(allStations);
      }
      catch(Exception e)
      {
        System.Diagnostics.Trace.TraceError("Cannot get stations for the tournament id " + id);
        return null;
      }
		}
	}
}