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
	tournaments: Array<Tournament> = [];
	allFishes: Array<Fish> = [];
	fishes: Array<Fish> = [];
	allBoats: Array<Boat> = [];
	boats: Array<Boat> = [];
	allStations: Array<Station> = [];
	stations: Array<Station> = [];
	allMembers: Array<Member> = [];
	members: Array<Member> = [];

	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	async initialize() {
		this.getTournaments().then(() => {
			this.getBoats().then(() => {
				this.getMembers().then(() => {
					this.filterBoats(this.tournaments[0].Id).then(() => {
						if (!this.noBoatsAvailable) {
							this.filterMembers(this.tournaments[0].Id, this.boats[0].Id, false);
						} else {
							this.filterMembers(this.tournaments[0].Id, -1, false);
						}
					});
				});
			});
			this.getStations().then(() => {
				this.filterStations(this.tournaments[0].Id);
			});
		});
		return true;
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
				Id: null,
			}
      this.tournaments.push(tournament);
		}
		this.noTournamentsAvailable = (this.tournaments[0].Id == null);
		this.filterStations(this.tournaments[0].Id);
		this.filterBoats(this.tournaments[0].Id);
		return true;
	}

	async getFish() {
		const link = this.baseUrl + 'api/database/fish';
		this.allFishes = await this.http.get<Fish[]>(link).toPromise();
		this.fishes = this.allFishes;
		return true;
	}

	async getBoats() {
		const link = this.baseUrl + 'api/database/boat';
		this.allBoats = await this.http.get<Boat[]>(link).toPromise();
		return true;
	}

	async getStations() {
		const link = this.baseUrl + 'api/database/station';
		this.allStations = await this.http.get<Station[]>(link).toPromise();
		return true;
	}

	async getMembers() {
		const link = this.baseUrl + 'api/database/member';
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
		for (let i = 0; i < this.allBoats.length; i++) {
			if (this.allBoats[i].Id == boatId) {
				return this.allBoats[i];
			}
		}
		return null;
	}

	getStation(stationId) {
		for (let i = 0; i < this.allStations.length; i++) {
			if (this.allStations[i].Id == stationId) {
				return this.allStations[i];
			}
		}
		return null;
	}

	getMember(member) {
		for (let i = 0; i < this.allMembers.length; i++) {
			if (this.allMembers[i].Id == member.Id && this.allMembers[i].TournamentId == member.TournamentId && this.allMembers[i].BoatId == member.BoatId) {
				return this.allMembers[i];
			}
		}
		return null;
	}

	wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async filterStations(value) {
		this.stations = await this.allStations.filter(station =>
			station.TournamentId == value
		);
		if (this.stations.length == 0) {
			const station: Station = {
				Port: 'No stations registered for tournament',
				Id: -1,
				TournamentId: -1,
			}
			this.stations.push(station)
		}
		this.noStationsAvailable = (this.stations[0].Id == -1);
		return this.noStationsAvailable;
  }

	async filterBoats(value) {
		this.boats = await this.allBoats.filter(boat =>
			boat.TournamentId == value
		);
		if (this.boats.length == 0) {
			const boat: Boat = {
				Name: 'No boats registered for tournament',
				Id: -1,
				TournamentId: -1,
				Length: -1,
			}
			this.boats.push(boat);
		}
		this.noBoatsAvailable = (this.boats[0].Id == -1);
		return this.noBoatsAvailable;
	}

	async filterMembers(tournamentId, boatId, isJunior) {
		if (isJunior) {
			this.members = await this.allMembers.filter(member =>
				member.TournamentId == tournamentId && member.BoatId == boatId && member.IsJunior
			);
		} else {
			this.members = await this.allMembers.filter(member =>
				member.TournamentId == tournamentId && member.BoatId == boatId
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

	async filterFish(value) {
		this.fishes = await this.allFishes.filter(fish =>
			fish.TournamentId == value
		);
		if (this.boats.length == 0) {
			const fish: Fish = {
				Weight: -1,
				Length: -1,
				Image: Fish.defaultImage,
				StationNumber: -1,
				Species: "No invalid fish for tournament",
				SampleNumber: -1,
				Date: "N\A",
				Port: "N\A",
				IsValid: true,
				HasTag: true,
				MemberId: -1, 
				BoatId: -1,
				TournamentId: -1,
				Id: -1,
			}
			this.fishes.push(fish)
		}
		return true;
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

	checkDropdownStation(station) {
		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].Id == station.Id && this.stations[i].Port == station.Name) {
				return true;
			}
		}
		return false;
	}

	checkDropdownBoat(boat) {
		for (let i = 0; i < this.boats.length; i++) {
			if (this.boats[i].Id == boat.Id && this.boats[i].Name == boat.Name) {
				return true;
			}
		}
		return false;
	}

	checkDropdownTournament(tournament) {
		for (let i = 0; i < this.tournaments.length; i++) {
			if (this.tournaments[i].Id == tournament.Id && this.tournaments[i].Name == tournament.Name) {
				return true;
			}
		}
		return false;
	}

	checkDropdownMember(member) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].Id == member.Id && this.members[i].Name == member.Name) {
				return true;
			}
		}
		return false;
	}
}
