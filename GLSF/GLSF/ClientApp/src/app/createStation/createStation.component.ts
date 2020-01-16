import { Component, Inject, OnInit } from '@angular/core';
import { Station } from '../models/dataSchemas';
import { Requests } from '../http/Requests';


@Component({
	selector: 'app-createStation',
	templateUrl: './createStation.html',
	styleUrls: ['../componentStyle.css'],
})

export class CreateStationComponent implements OnInit {
	idLabel = '';
	stationNumber = '';
	portName = '';
	nameLabel = '';
	subStyle = "normal";
	subText = "Submit";

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
		this.request.initialize();
	}

	filter(tournament) {
		try {
			tournament = JSON.parse(tournament);
			this.request.filterStations(tournament.Id);
		} catch (e) {}
	}

	async createStation(tournament) {
		let validDropdowns = true;
		try {
			tournament = JSON.parse(tournament);
		} catch (e) {
			validDropdowns = false;
		}
		const validId = this.checkNumber();
		const validName = this.checkName();
		if (validId && validName && validDropdowns) {
			const validTournament = this.request.checkDropdownTournament(tournament);
			if (validTournament) {
				const station: Station = {
					TournamentId: parseFloat(tournament.Id),
					Id: parseFloat(this.stationNumber),
					Port: this.portName,
				};
				this.sendRequest(station).then(() => {
					this.reload();
					this.request.getStations().then(() => {
						this.request.filterStations(tournament.Id);
					});
				});
			}
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

	private checkName() {
		if (this.portName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.portName.length > 300) {
			this.nameLabel = '300 characters max';
			return false;
		}
		this.nameLabel = '';
		return true;
	}

	private sendRequest(values) {
		const link = this.baseUrl + 'api/database/station';
		return this.request.post(values, link);
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





