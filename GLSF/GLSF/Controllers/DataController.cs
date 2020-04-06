using GLSF.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ServerDatabase.Controllers
{
	[Route("api/database")]
	public class FishController : Controller
	{
		private readonly fishDBContext _context;
		public FishController(fishDBContext fish, IConfiguration configuration)
		{
			_context = fish;
		}

		[Route("user/authenticate")]
		[HttpPost]
		public IActionResult AuthenticateUser([FromBody]UserModel user)
		{
			if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
				return null;

			if (user == null)
				return null;
			
			UserDatabaseModel userDBM = new UserDatabaseModel();
			userDBM.Username = user.Username;
			userDBM.PasswordHash = CreatePasswordHash(user.Password);
			UserDatabaseModel databaseUser = _context.Users.Where(userDB => userDBM.Username == userDB.Username && userDBM.PasswordHash == userDB.PasswordHash).FirstOrDefault();
			if (databaseUser == null)
				return BadRequest(new { message = "Username or password is incorrect" });
			user.AccessLevel = databaseUser.AccessLevel;
			user.Id = databaseUser.Id;

			if (!VerifyPasswordHash(user.Password, databaseUser.PasswordHash))
				return null;

			JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
			JObject settings = JObject.Parse(System.IO.File.ReadAllText("./appsettings.json"));
			byte[] key = Encoding.ASCII.GetBytes((string)settings.GetValue("Secret"));

			SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					new Claim(ClaimTypes.Name, user.Id.ToString())
				}),
				Expires = DateTime.UtcNow.AddDays(7),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};
			SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
			tokenHandler.WriteToken(token);
			user.Token = token.ToString();
			// return basic user info and authentication token
			return Ok(user);
		}

		[Route("user/register")]
		[HttpPost]
		public async Task<IActionResult> RegisterUser([FromBody]UserModel user)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(user.Username))
					throw new Exception("Username is required");

				if (string.IsNullOrWhiteSpace(user.Password))
					throw new Exception("Password is required");

				if (_context.Users.Any(x => x.Username == user.Username))
					throw new Exception("Username \"" + user.Username + "\" is already taken");

				UserDatabaseModel databaseUser = new UserDatabaseModel { Id = null, 
					FirstName = user.FirstName, 
					LastName = user.LastName, 
					Username = user.Username,
					PasswordHash = new byte[0],
					AccessLevel = 0,};
				databaseUser.PasswordHash = CreatePasswordHash(user.Password);
				await _context.Users.AddAsync(databaseUser);
				await _context.SaveChangesAsync();
				return Ok();
			}
			catch (Exception ex)
			{
				// return error message if there was an exception
				return BadRequest(new { message = ex.Message });
			}
		}

		[Route("user")]
		[HttpGet]
		public async Task<string> GetAllUsers()
		{
			List<UserDatabaseModel> user = await _context.Users.ToListAsync();
			return JsonConvert.SerializeObject(user);
		}

		[Route("user")]
		[HttpGet("{id}")]
		public async Task<string> GetUserById(int id)
		{
			UserDatabaseModel user = await _context.Users.FindAsync(id);
			return JsonConvert.SerializeObject(user);
		}

		[Route("user")]
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateUser(int id, UserModel user)
		{
			try
			{
				UserDatabaseModel OldUser = _context.Users.Where(userDB => userDB.Id == user.Id).FirstOrDefault();
				if (OldUser == null)
					throw new Exception("User not found");
				OldUser.PasswordHash = CreatePasswordHash(user.Password);
				_context.Users.Update(OldUser);
				await _context.SaveChangesAsync();
				return Ok();
			}
			catch (Exception ex)
			{
				// return error message if there was an exception
				return BadRequest(new { message = ex.Message });
			}
		}

		[Route("user")]
		[HttpDelete("{id}")]
		public IActionResult DeleteUser(int id)
		{
			var user = _context.Users.Find(id);
			if (user != null)
			{
				_context.Users.Remove(user);
				_context.SaveChanges();
			}
			return Ok();
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

		[Route("boat")]
		[HttpPut]
		public async Task<Boat> UpdateBoat([FromBody]Boat boat)
		{
			_context.Boats.Update(boat);
			await _context.SaveChangesAsync();
			return boat;
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

		[Route("checkin")]
		[HttpPut]
		public async Task<List<Member>> UpdateFish([FromBody]List<Member> members)
		{
			_context.Members.UpdateRange(members);
			await _context.SaveChangesAsync();
			return members;
		}

		private byte[] CreatePasswordHash(string password)
		{
			using (var crypt = new SHA256Managed())
			{
				return crypt.ComputeHash(Encoding.UTF8.GetBytes(password));
			}
		}

		private bool VerifyPasswordHash(string password, byte[] storedHash)
		{
			var computedHash = CreatePasswordHash(password);
			for (int i = 0; i < computedHash.Length; i++)
			{
				if (computedHash[i] != storedHash[i])
					return false;
			}
			return true;
		}
	}
}