import { Component, Inject, OnInit } from '@angular/core';
import { Boat, Member, Group } from '../models/dataSchemas';
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
	boatName = '';
	subStyle = "normal";
	subText = "Submit";
	membersLabel = '';
	members: Array<Member> = [];

	constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) {
		this.addMember();
	}

	ngOnInit() {
		this.request.initialize();
	}

	addMember() {
		const member: Member = { Name: "", Age: null, IsCaptain: false, IsJunior: false, Id: 0, BoatId: 0, TournamentId: 0};
		this.members.push(member);
	}


	removeMember(i) {
		this.members.splice(i, 1);
	}

	selectedCaptain(index) {
		for (let i = 0; i < this.members.length; i++) {
			if (i == index) {
				this.members[i].IsCaptain = true;
			} else {
				this.members[i].IsCaptain = false;
			}
		}
	}

	filter(tournament) {
		try {
			tournament = JSON.parse(tournament);
			this.request.filterBoats(tournament.Id)
		} catch (e) {}
	}

	async createBoat(tournament) {
		let validDropdowns = true;
		try {
			tournament = JSON.parse(tournament);
		} catch (e) {
			validDropdowns = false;
		}
		this.members = this.getValidMembers(tournament.Id);
		const validName = this.checkName();
		const validLength = this.checkLength();
		const validId = this.checkId();
		const validMembers = this.membersAvailable();
		if (validName && validId && validLength && validMembers && validDropdowns) {
			const validTournament = this.request.checkDropdownTournament(tournament);
			if (validTournament) {
				const boat: Boat = {
					Name: this.boatName,
					Length: parseFloat(this.boatLength),
					Id: parseFloat(this.boatId),
					TournamentId: parseFloat(tournament.Id),
				};
				const group: Group = {
					Boat: boat,
					Members: this.members,
				};
				this.sendRequest(group).then(() => {
					this.reload();
					this.request.getBoats().then(() => {
						this.request.filterBoats(tournament.Id);
					});
				});
			}
    }
  }

	private membersAvailable() {
		if (this.members.length == 0) {
			this.membersLabel = 'Must have at least one registered person on a boat.'
			this.addMember();
			return false;
		}
		this.membersLabel = '';
		return true;
	}

	private getValidMembers(tournamentId) {
		let i = 1;
		let validMembers: Array<Member> = [];
		this.members.forEach(member => {
			if (member.Age != null && member.Name != '') {
				member.IsJunior = false;
				if (member.Age < 16) {
					member.IsJunior = true;
				}
				member.Age = parseFloat(member.Age);
				member.TournamentId = parseFloat(tournamentId);
				member.BoatId = parseFloat(this.boatId);
				member.Id = i++;
				validMembers.push(member);
			}
		});
		return validMembers;
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
		const boatLink = this.baseUrl + 'api/database/boat';
		return this.request.post(values, boatLink);
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
	  this.members = [];
	  this.addMember();
  }
}





