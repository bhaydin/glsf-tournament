import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Tournament, Boat, Station, Fish, Member } from "../models/dataSchemas";
import { Inject, Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root',
})

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

	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	async initialize() {
		const tournamentId = await this.getTournaments();
		await this.getBoats(tournamentId);
		this.getStations(tournamentId);
		await this.getMembers(tournamentId);
		this.filterMembers(this.boats[0].Id, false);
	}

	releaseData() {
		this.stations = [];
		this.boats = [];
		this.allMembers = [];
		this.members = [];
	}

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

	async getFish(tournamentId) {
		const link = this.baseUrl + 'api/database/fish/tournamentId/' + tournamentId;
		this.fishes = await this.http.get<Fish[]>(link).toPromise();
		return true;
	}

	async getBoats(tournamentId) {
		const link = this.baseUrl + 'api/database/boat/' + tournamentId;
		this.boats = await this.http.get<Boat[]>(link).toPromise();
		if (this.boats.length == 0) {
			const boat: Boat = {
				Name: 'No boats for tournament',
				Length: -1,
				Id: -1,
				TournamentId: -1
			};
			this.boats.push(boat);
		}
		this.noBoatsAvailable = (this.boats[0].Id == -1);
		return true;
	}

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

	async getMembers(tournamentId) {
		const link = this.baseUrl + 'api/database/member/' + tournamentId;
		this.allMembers = await this.http.get<Member[]>(link).toPromise();
		return true;
	}

	getTournament(tournamentId) {
		for (let i = 0; i < this.tournaments.length; i++) {
			if (this.tournaments[i].Id == tournamentId) {
				return this.tournaments[i];
			}
		}
		return null;
	}

	getBoat(boatId) {
		for (let i = 0; i < this.boats.length; i++) {
			if (this.boats[i].Id == boatId) {
				return this.boats[i];
			}
		}
		return null;
	}

	getStation(stationId) {
		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].Id == stationId) {
				return this.stations[i];
			}
		}
		return null;
	}

	getMember(memberId) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].Id == memberId) {
				return this.members[i];
			}
		}
		return null;
	}

	wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

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
		return this.noMembersAvailable;
	}

  //Database modification methods
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

	async delete(link) {
		return await this.http.delete(link).toPromise();
	}

  //Dropdown check methods, making sure elements dont get changed via inspect element
	checkDropdownSpecies(species) {
		for (let i = 0; i < Fish.fishes.length; i++) {
			if (Fish.fishes[i] == species) {
				return true;
			}
		}
		return false;
}

	checkDropdownStation(stationId) {
		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].Id == stationId) {
				return true;
			}
		}
		return false;
	}

	checkDropdownBoat(boatId) {
		for (let i = 0; i < this.boats.length; i++) {
			if (this.boats[i].Id == boatId) {
				return true;
			}
		}
		return false;
	}

	checkDropdownTournament(tournamentId) {
		for (let i = 0; i < this.tournaments.length; i++) {
			if (this.tournaments[i].Id == tournamentId) {
				return true;
			}
		}
		return false;
	}

	checkDropdownMember(memberId) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].Id == memberId) {
				return true;
			}
		}
		return false;
	}
}
