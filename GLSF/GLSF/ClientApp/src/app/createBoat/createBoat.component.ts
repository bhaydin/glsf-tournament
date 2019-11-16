import { Component, Inject, OnInit } from '@angular/core';
import { Boat } from '../models/dataSchemas';
import { Requests } from '../http/Requests';


@Component({
	selector: 'app-createBoat',
	templateUrl: './createBoat.html',
	styleUrls: ['../componentStyle.css'],
})

export class CreateBoatComponent implements OnInit {
	noAvailableTournaments = false;
  nameLabel = '';
	idLabel = '';
	lengthLabel = '';
	boatLength = '';
	boatId = '';
	members = '';
	boatName = '';
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
		this.request.filterBoats(value)
	}

	async createBoat(tournamentId) {
		const validName = this.checkName();
		const validLength = this.checkLength();
		const validId = this.checkId();
		if (validName && validId && validLength && tournamentId != -1) {
			const boat: Boat = {
				Name: this.boatName,
				Members: this.members,
				Id: parseFloat(this.boatId),
				TournamentId: parseFloat(tournamentId),
				Length: parseFloat(this.boatLength),
			};
			await this.sendRequest(boat);
			await this.reload();
			await this.request.getBoats();
			await this.filter(tournamentId);
    }
  }

	private checkName() {
		if (this.boatName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.boatName.length > 300) {
			this.nameLabel = '300 characters max';
			return false;
		}
		this.nameLabel = '';
		return true;
	}

	private checkLength() {
		const lengthNum = parseFloat(this.boatLength);
		if (this.boatLength == '') {
			this.lengthLabel = 'Enter number';
			return false;
		} else if (isNaN(lengthNum)) {
			this.lengthLabel = 'Invalid number';
			return false;
		} else if (lengthNum < 0) {
			this.lengthLabel = 'Must be postivie';
			return false;
		}
		this.lengthLabel = '';
		return true;
	}

	private checkId() {
		const idNum = parseFloat(this.boatId);
		if (this.boatId == '') {
			this.idLabel = 'Enter number';
			return false;
		} else if (isNaN(idNum)) {
			this.idLabel = 'Invalid number';
			return false;
		} else if (idNum < 0) {
			this.idLabel = 'Must be postivie';
			return false;
		}
		for (let i = 0; i < this.request.boats.length; i++) {
			if (this.request.boats[i].Id == idNum) {
				this.idLabel = 'Boat ID ' + this.request.boats[i].Id +
            					' already registered as ' + this.request.boats[i].Name;
				return false;
			}
		}
		this.idLabel = '';
		return true;
	}

	private sendRequest(values) {
		const link = this.baseUrl + 'api/database/boat';
		this.request.post(values, link);
	}

  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Submitted!";
    await this.request.wait(200);
	  this.subStyle = "normal";
	  this.subText = "Submit";
	  this.boatId = '';
	  this.boatLength = '';
	  this.boatName = '';
	  this.members = '';
  }
}





