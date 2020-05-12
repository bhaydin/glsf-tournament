import { Component, Inject, OnInit } from '@angular/core';
import { Station } from '../models/dataSchemas';
import { Requests } from '../http/Requests';


@Component({
	selector: 'app-createStation',
	templateUrl: './createStation.html',
	styleUrls: ['../componentStyle.css'],
})

export class CreateStationComponent implements OnInit{
	submissionInProcess = false;
	idLabel = '';
	stationNumber = '';
	portName = '';
	nameLabel = '';
	subStyle = "normal";
	subText = "Submit";

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) {
		this.setUpStationRequest();
}

	ngOnInit() {	}

  //Sets up request service for stations by getting all tournaments
	async setUpStationRequest() {
		const tournamentId = await this.request.getTournaments();
		this.request.getStations(tournamentId);
	}

  //Filters all made statiosn for a tournament, prevents duplicates
	filter(tournamentId) {
		this.request.getStations(tournamentId);
	}

  //Adds station to database linked to tournament
	async createStation(tournamentId) {
		this.submissionInProcess = true;
		const tournamentExists = this.request.checkDropdownTournament(tournamentId);
		const validId = this.checkNumber();
		const validName = this.checkName();
		if (validId && validName && tournamentExists) {
			const station: Station = {
				TournamentId: tournamentId,
				Id: parseFloat(this.stationNumber),
				Port: this.portName,
			};
			this.sendRequest(station).then(() => {
				this.reload();
				this.request.getStations(tournamentId);
			});
	  } else {
	    this.submissionInProcess = false;
    }
  }

  //Makes sure station number is a valid number
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

  //Checks station name, makes sure its less than 300 characters
	private checkName() {
		if (this.portName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.portName.length > this.request.MAX_STRING_LENGTH) {
			this.nameLabel = this.request.MAX_STRING_LENGTH + ' characters max';
			return false;
		}
		this.nameLabel = '';
		return true;
	}

  //Sends station to link for request class
	private sendRequest(values) {
		const link = this.baseUrl + 'api/database/station';
		return this.request.post(values, link);
	}

  //Reloads station page
  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Submitted!";
	  await this.request.wait(200);
	  this.subStyle = "normal";
	  this.subText = "Submit";
	  this.stationNumber = '';
	  this.portName = '';
	  this.submissionInProcess = false;
  }
}





