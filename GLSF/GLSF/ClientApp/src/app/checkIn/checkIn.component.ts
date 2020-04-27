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

	async setUpCheckIn() {
		const tournamentId = await this.request.getTournaments();
		await this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

	async checkInBoat(i) {
		this.checkInLabel = "";
		if (this.currentUser.AccessLevel == 1) {
			const boatLink = this.baseUrl + "api/database/boat";
			const boat = this.request.boats[i];
			if (boat.CheckedIn) {
				boat.CheckedIn = false;
			} else {
				boat.CheckedIn = true;
			}
			await this.request.update(boat, boatLink);
      this.checkInLabel = boat.Name + " checked in"
      this.request.filterCheckedInBoats();
		}
	}

	async filterTournament(tournamentId) {
		this.request.getBoats(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}
}





