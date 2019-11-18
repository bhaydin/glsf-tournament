import { Component, Inject, OnInit } from '@angular/core';
import { Tournament } from '../models/dataSchemas';
import { DatePipe } from '@angular/common';
import { Requests } from '../http/Requests';


@Component({
	selector: 'app-createTournament',
	templateUrl: '/createTournament.html',
	styleUrls: ['../componentStyle.css'],
	providers: [DatePipe]
})

export class CreateTournamentComponent implements OnInit {
	nameLabel = '';
	dateLabel = '';
	idLabel = '';
	tournamentName = '';
	tournamentId = '';
	tournamentLocation = '';
	subStyle = "normal";
	subText = "Submit";
	currentDate: Date = new Date();

	constructor(private request: Requests, private pipe: DatePipe, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
		this.request.initialize();
	}

	createTournament(startDate, endDate) {
    const validName = this.checkName();
		const validId = this.checkId();
		const validDateRange = this.checkDates(startDate, endDate);
		if (validName && validId && validDateRange) {
			const formattedStartDate = this.pipe.transform(startDate, 'MM/dd/yyyy');
			const formattedEndDate = this.pipe.transform(endDate, 'MM/dd/yyyy');
			const tournament:Tournament = {
				StartDate: formattedStartDate,
				EndDate: formattedEndDate,
				Name: this.tournamentName,
				Location: this.tournamentLocation,
				Id: parseFloat(this.tournamentId),
			};
			this.sendRequest(tournament).then(() => {
				this.reload();
				this.request.getTournaments();
			});
    }
  }
  

	private checkName() {
		if (this.tournamentName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.tournamentName.length > 300) {
			this.nameLabel = '300 character max';
			return false;
		}
		this.nameLabel = '';
		return true;
  }

	private checkDates(startDate, endDate) {
		if (startDate <= endDate) {
			this.dateLabel = '';
			return true;
		}
		this.dateLabel = 'Start date must be before end date';
		return false;
	}

	private checkId() {
		const idNum = parseFloat(this.tournamentId);
		if (this.tournamentId == '') {
			this.idLabel = 'Enter Id';
			return false;
		} else if (isNaN(idNum)) {
			this.idLabel = 'Enter a number';
			return false;
		} else if (idNum < 0) {
			this.idLabel = 'Must be positive';
			return false;
		}
		for (let i = 0; i < this.request.tournaments.length; i++) {
			if (this.request.tournaments[i].Id == idNum) {
				this.idLabel = 'Tournament with id ' + this.request.tournaments[i].Id +
					' and name ' + this.request.tournaments[i].Name + ' already created.'
				return false;
			}
		}
		this.idLabel = '';
		return true;
  }

	private async sendRequest(values) {
		const link = this.baseUrl + 'api/database/tournament';
		return this.request.post(values, link);
  }

  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Submitted!";
    await this.request.wait(200);
	  this.subStyle = "normal";
	  this.subText = "Submit";
	  this.tournamentId = null;
	  this.tournamentName = null;
	  this.tournamentLocation = null;
	  this.currentDate = new Date();
  }

}
