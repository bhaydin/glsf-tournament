import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Tournament, Boat, Station, Fish, Member } from "../models/dataSchemas";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root', })
export class Requests {
	noTournamentsAvailable = false;
	noBoatsAvailable = false;
	noStationsAvailable = false;
	noMembersAvailable = false;
	MAX_STRING_LENGTH = 300;
	tournaments: Array<Tournament> = [];
	fishes: Array<Fish> = [];
	boats: Array<Boat> = [];
	stations: Array<Station> = [];
	allMembers: Array<Member> = [];
  members: Array<Member> = [];
	checkedInBoats: Array<Boat> = [];

	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  //Initializes the request service with boats, stations, members of the default tournament
	async initialize() {
		const tournamentId = await this.getTournaments();
		await this.getBoats(tournamentId);
		await this.getStations(tournamentId);
		await this.getMembers(tournamentId);
		await this.filterCheckedInBoats();
		await this.filterMembers(this.checkedInBoats[0].Id, false);
	}

  //Sends an error to the server
  async sendError(errorMsg) {
	  const link = this.baseUrl + 'api/database/error/' + errorMsg;
    await this.http.get<String>(link).toPromise();
  }

  //Clears data that was previously stored, not in use right now
	releaseData() {
		this.stations = [];
		this.boats = [];
		this.allMembers = [];
		this.members = [];
	}

  //Gets all tournaments in database, if there are none then adds a invalid tournament that disables drop down selects
	async getTournaments() {
		const link = this.baseUrl + 'api/database/tournament';
		this.tournaments = await this.http.get<Tournament[]>(link).toPromise();
		if (this.tournaments.length == 0) {
			const tournament: Tournament = {
				StartDate: 'N/A',
				EndDate: 'N/A',
				Name: 'No tournaments created',
				Location: 'N/A',
				Id: -1,
			}
      this.tournaments.push(tournament);
		}
		this.noTournamentsAvailable = (this.tournaments[0].Id == -1);
		return this.tournaments[0].Id;
	}

  //Gets all fish for a tournament, it is by tournament because each fish has a image stored as well. Needed to limit requested objects
	async getFish(tournamentId) {
		const link = this.baseUrl + 'api/database/fish/tournamentId/' + tournamentId;
		this.fishes = await this.http.get<Fish[]>(link).toPromise();
		return true;
	}

  //Gets all boats for a tournament, if there are none then a invalid boat is generated that disabled all boat select drop downs
	async getBoats(tournamentId) {
		const link = this.baseUrl + 'api/database/boat/' + tournamentId;
		this.boats = await this.http.get<Boat[]>(link).toPromise();
		if (this.boats.length == 0) {
			const boat: Boat = {
				Name: 'No boats for tournament',
				Length: -1,
				CheckedIn: false,
				Id: -1,
				TournamentId: -1
			};
			this.boats.push(boat);
		}
		this.noBoatsAvailable = (this.boats[0].Id == -1);
		return true;
	}

  //Filters all boats for tournament for the boats that have been checked in by tournament administrator
	async filterCheckedInBoats() {
		this.checkedInBoats = await this.boats.filter(boat => boat.CheckedIn == true);
		if (this.checkedInBoats.length == 0) {
			const boat: Boat = {
				Name: 'No boats checked in yet',
				Length: -1,
				CheckedIn: false,
				Id: -1,
				TournamentId: -1
			};
			this.checkedInBoats.push(boat);
		}
		this.noBoatsAvailable = (this.checkedInBoats[0].Id == -1);
		return true;
	}

  //Gets all stations for a tournament, if there are no stations creates a invalid station that disabled all station select drop downs
	async getStations(tournamentId) {
		const link = this.baseUrl + 'api/database/station/' + tournamentId;
		this.stations = await this.http.get<Station[]>(link).toPromise();
		if (this.stations.length == 0) {
			const station: Station = {
				Port: 'No Stations for Tournament',
				Id: -1,
				TournamentId: -1
			};
			this.stations.push(station);
		}
		this.noStationsAvailable = (this.stations[0].Id == -1);
		return true;
	}

  //Gets all members from the server for the request service
	async getMembers(tournamentId) {
		const link = this.baseUrl + 'api/database/member/' + tournamentId;
		this.allMembers = await this.http.get<Member[]>(link).toPromise();
		return true;
	}

  //Gets a tournament from the request service
	getTournament(tournamentId) {
		for (let i = 0; i < this.tournaments.length; i++) {
			if (this.tournaments[i].Id == tournamentId) {
				return this.tournaments[i];
			}
		}
		return null;
	}

  //Gets a boat from the request service
	getBoat(boatId) {
		for (let i = 0; i < this.boats.length; i++) {
			if (this.boats[i].Id == boatId) {
				return this.boats[i];
			}
		}
		return null;
	}

  //Gets a station from the request service
	getStation(stationId) {
		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].Id == stationId) {
				return this.stations[i];
			}
		}
		return null;
	}

  //Gets a member from the request service
	getMember(memberId) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].Id == memberId) {
				return this.members[i];
			}
		}
		return null;
	}

  //Gets a fish from the request service
	getAFish(fishId) {
		for (let i = 0; i < this.fishes.length; i++) {
			if (this.fishes[i].Id == fishId) {
				return this.fishes[i];
			}
		}
		return null;
	}

  //Wait method in milliseconds
	wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  //Filters members based on boat id, also filters based on if the members are juniors or not
	async filterMembers(boatId, isJunior) {
		if (isJunior) {
			this.members = await this.allMembers.filter(member =>
			  member.BoatId == boatId && member.IsJunior
			);
		} else {
			this.members = await this.allMembers.filter(member =>
				member.BoatId == boatId
			);
		}
		if (this.members.length == 0 || this.boats.length == 0) {
			const member: Member = {
				Name: 'No valid members',
				Age: -1,
				IsCaptain: false,
				IsJunior: false,
				Id: -1,
				BoatId: -1,
				TournamentId: -1
			}
			this.members.push(member);
		}
		this.noMembersAvailable = (this.members[0].Id == -1);
		return true;
	}

  //Database modification method that posts the specified value to the specified link
	async post(values, link) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		}
		return await this.http.post(link, values, httpOptions).toPromise();
  }

  //Method to call when an update needs to be called
  async update(values, link) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
	  return await this.http.put(link, values, httpOptions).toPromise();
	}

  //Used to delete a row in the database 
	async delete(link) {
		return await this.http.delete(link).toPromise();
	}

  //Dropdown check methods, making sure elements dont get changed via inspect element
  //Checks if selected species is valid
	checkDropdownSpecies(species) {
		for (let i = 0; i < Fish.fishes.length; i++) {
			if (Fish.fishes[i] == species) {
				return true;
			}
		}
		return false;
  }

  //Checks if selected station is valid
	checkDropdownStation(stationId) {
		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].Id == stationId) {
				return true;
			}
		}
		return false;
	}

  //Checks if selected boat is valid
	checkDropdownBoat(boatId) {
		for (let i = 0; i < this.boats.length; i++) {
			if (this.boats[i].Id == boatId) {
				return true;
			}
		}
		return false;
	}

  //Checks if selected tournament is valid
	checkDropdownTournament(tournamentId) {
		for (let i = 0; i < this.tournaments.length; i++) {
			if (this.tournaments[i].Id == tournamentId) {
				return true;
			}
		}
		return false;
	}

  //Checks if selected member is valid
	checkDropdownMember(memberId) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].Id == memberId) {
				return true;
			}
		}
		return false;
  }
}

window.onerror = function (errorMessage, errorUrl, errorLine) {
  this.sendError(errorMessage + " on line " + errorLine);
  return true;
}
