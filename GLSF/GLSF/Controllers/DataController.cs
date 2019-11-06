using GLSF.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServerDatabase.Controllers
{
	[Route("api/fishes")]
	public class DataController : Controller
	{		

		private readonly fishDBContext _context;
		public DataController(fishDBContext fishes){
			_context = fishes;
		}

		[HttpPost]
		public async Task<Fish> InsertFish([FromBody]Fish fish)
		{
			await _context.Fishes.AddAsync(fish);
			await _context.SaveChangesAsync();
			return fish;
		}


		[HttpGet]
		public async Task<string> GetFish()
		{
			List<Fish> allFishes = await _context.Fishes.ToListAsync();
			return JsonConvert.SerializeObject(allFishes);
		}
	}
}