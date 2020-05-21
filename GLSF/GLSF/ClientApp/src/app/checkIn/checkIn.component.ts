import { Component, Inject, OnInit } from '@angular/core';
import { Requests } from '../http/Requests';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
	selector: 'app-checkin',
	templateUrl: './checkIn.html',
	styleUrls: ['../componentStyle.css'],
})

export class CheckInComponent implements OnInit{
	submissionInProcess = false;
	noAvailableTournaments = false;
	currentUser: any;
	boatName = '';
	subStyle = "checkInSubmit";
	subText = "Submit";
	checkInLabel = "";

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) {
		this.setUpCheckIn();
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}

	ngOnInit() {}

  //Sets up check in values in the request service
	async setUpCheckIn() {
		const tournamentId = await this.request.getTournaments();
		await this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

  //Checks in boat selected by tournament administrator
	async checkInBoat(i) {
		if (this.currentUser.AccessLevel == 1) {
			this.checkInLabel = "";
			const boatLink = this.baseUrl + "api/database/boat";
			const boat = this.request.boats[i];
			if (boat.CheckedIn) {
				boat.CheckedIn = false;
				this.checkInLabel = boat.Id + " checked out"
			} else {
				boat.CheckedIn = true;
				this.checkInLabel = boat.Id + " checked in"
			}
			await this.request.update(boat, boatLink);
      this.request.filterCheckedInBoats();
		}
	}

  //Gets the boats for the selected tournament
	async filterTournament(tournamentId) {
		this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}
}





