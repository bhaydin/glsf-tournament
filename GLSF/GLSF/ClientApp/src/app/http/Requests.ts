import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Tournament, Boat, Station } from "../models/dataSchemas";
import { Inject, Injectable } from "@angular/core";


@Injectable({
	providedIn: 'root',
})
export class Requests {
	noTournamentsAvailable = false;
	noBoatsAvailable = false;
	noStationsAvailable = false;
	tournaments: Array<Tournament> = [];
	allBoats: Array<Boat> = [];
	boats: Array<Boat> = [];
	stations: Array<Station> = [];
	allStations: Array<Station> = [];

	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	async initialize() {
		this.getTournaments().then(() => {
			this.getBoats().then(() => {
				this.filterBoats(this.tournaments[0].Id);
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
			this.tournaments.push(tournament)
		}
		this.noTournamentsAvailable = (this.tournaments[0].Id == null);
		this.filterStations(this.tournaments[0].Id);
		this.filterBoats(this.tournaments[0].Id);
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
				Id: null,
				TournamentId: -1,
			}
			this.stations.push(station)
		}
		this.noStationsAvailable = (this.stations[0].Id == null);
		return this.noStationsAvailable;
	}


	async filterBoats(value) {
		this.boats = await this.allBoats.filter(boat =>
			boat.TournamentId == value
		);
		if (this.boats.length == 0) {
			const boat: Boat = {
				Name: 'No boats registered for tournament',
				Members: 'N/A',
				Id: null,
				TournamentId: -1,
				Length: -1,
			}
			this.boats.push(boat)
		}
		this.noBoatsAvailable = (this.boats[0].Id == null);
		return this.noBoatsAvailable;
	}

	async post(values, link) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		}
		return await this.http.post(link, values, httpOptions).toPromise();
	}
}
