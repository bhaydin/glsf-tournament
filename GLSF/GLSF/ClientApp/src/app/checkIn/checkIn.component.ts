import { Component, Inject, OnInit } from '@angular/core';
import { Requests } from '../http/Requests';

@Component({
	selector: 'app-checkin',
	templateUrl: './checkIn.html',
	styleUrls: ['../componentStyle.css'],
})

export class CheckInComponent implements OnInit{
	submissionInProcess = false;
	noAvailableTournaments = false;
	boatName = '';
	subStyle = "normal";
	subText = "Submit";

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) {
		this.setUpCheckIn();
	}

	ngOnInit() {}

	async setUpCheckIn() {
		const tournamentId = await this.request.getTournaments();
		await this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

	checkInMember(i) {
		if (this.request.members[i].CheckedIn) {
			this.request.members[i].CheckedIn = false;
		} else {
			this.request.members[i].CheckedIn = true;
		}
	}

	checkInMembers(boatId) {
		const memberLink = this.baseUrl + "api/database/checkin";
		const boatLink = this.baseUrl + "api/database/boat";
		let numberCheckedIn = 0;
		for (let i = 0; i < this.request.members.length; i++) {
			if (this.request.members[i].CheckedIn) {
				numberCheckedIn++;
			}
		}
		const boat = this.request.getBoat(boatId);
		boat.PercentCheckedIn = numberCheckedIn / this.request.members.length;
		this.request.update(this.request.members, memberLink);
		this.request.update(boat, boatLink);
		this.reload();
	}

	async filterTournament(tournamentId) {
		this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Submitted!";
    await this.request.wait(200);
	  this.subStyle = "normal";
	  this.subText = "Submit";
	  this.submissionInProcess = false;
  }
}





