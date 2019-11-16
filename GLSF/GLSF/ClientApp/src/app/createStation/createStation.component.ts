import { Component, Inject, OnInit } from '@angular/core';
import { Station } from '../models/dataSchemas';
import { Requests } from '../http/Requests';


@Component({
	selector: 'app-createStation',
	templateUrl: './createStation.html',
	styleUrls: ['../componentStyle.css'],
})

export class CreateStationComponent implements OnInit {
	noAvailableTournaments = false;
  nameLabel = '';
	idLabel = '';
	stationNumber = '';
	portName = '';
	subStyle = "normal";
	subText = "Submit";

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) {}

	ngOnInit() {
		this.hasTournaments();
	}

	private async hasTournaments() {
		this.noAvailableTournaments = await this.request.noTournamentsAvailable;
	}

	filter(value) {
		this.request.filterStations(value);
	}

	async createStation(tournamentId) {
		const validId = this.checkNumber();
		if (validId && tournamentId != -1) {
			const station: Station = {
				TournamentId: parseFloat(tournamentId),
				Id: parseFloat(this.stationNumber),
				Port: this.portName,
			};
			await this.sendRequest(station);
			await this.reload();
			await this.request.getStations();
			await this.filter(tournamentId);
    }
  }

	private checkNumber() {
		const stationNum = parseFloat(this.stationNumber);
		if (this.stationNumber == '') {
			this.idLabel = 'Enter number';
			return false;
		} else if (isNaN(stationNum)) {
			this.idLabel = 'Invalid number';
			return false;
		} else if (stationNum < 0) {
			this.idLabel = 'Must be postivie';
			return false;
		}
		for (let i = 0; i < this.request.stations.length; i++) {
			if (this.request.stations[i].Id == stationNum) {
				this.idLabel = 'Station ' + this.request.stations[i].Id
					+ ' already registered for the selected tournament as ' + this.request.stations[i].Port;
				return false;
			}
		}
		this.idLabel = '';
		return true;
	}

	private sendRequest(values) {
		const link = this.baseUrl + 'api/database/station';
		this.request.post(values, link);
	}

  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Submitted!";
	  await this.request.wait(200);
	  this.subStyle = "normal";
	  this.subText = "Submit";
	  this.stationNumber = null;
	  this.portName = null;
  }
}





