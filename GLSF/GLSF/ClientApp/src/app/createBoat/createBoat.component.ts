import { Component, Inject, OnInit } from '@angular/core';
import { Boat, Member, Group } from '../models/dataSchemas';
import { Requests } from '../http/Requests';

@Component({
	selector: 'app-createBoat',
	templateUrl: './createBoat.html',
	styleUrls: ['../componentStyle.css'],
})

export class CreateBoatComponent implements OnInit{
	submissionInProcess = false;
	noAvailableTournaments = false;
  nameLabel = '';
	idLabel = '';
	lengthLabel = '';
	membersLabel = '';
	boatLength = '';
	boatId = '';
	boatName = '';
	subStyle = "normal";
	subText = "Submit";
  members: Array<Member> = [];
  membersLabels: Array<String> = new Array(100);

  constructor(private request: Requests, @Inject('BASE_URL') private baseUrl: string) {
    for (let i = 0; i < 100; i++) {
      this.membersLabels[i] = '';
    }

		this.addMember();
		this.setUpBoatRequest();
	}

	ngOnInit() {}

	async setUpBoatRequest() {
		const tournamentId = await this.request.getTournaments();
		this.request.getBoats(tournamentId);
	}

	addMember() {
		const member: Member = { Name: "", Age: null, IsCaptain: false, IsJunior: false, Id: 0, BoatId: 0, TournamentId: 0};
		this.members.push(member);
	}

	removeMember(i) {
    this.members.splice(i, 1);
    this.membersLabels.splice(i, 1);
    this.membersLabels.push(''); // to keep the array at the same size
	}

	selectedCaptain(index) {
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].IsCaptain = false;
			if (i == index) {
				this.members[i].IsCaptain = true;
			}			
		}
	}

	filter(tournamentId) {
		this.request.getBoats(tournamentId);
	}

	async createBoat(tournamentId) {
		this.submissionInProcess = true;
		this.members = this.getValidMembers(tournamentId);
		const validName = this.checkName();
		const validLength = this.checkLength();
		const validId = this.checkId();
		const validMembers = this.membersAvailable();
		const validTournament = this.request.checkDropdownTournament(tournamentId);
		if (validName && validId && validLength && validMembers && validTournament) {
			const boat: Boat = {
				Name: this.boatName,
				Length: parseFloat(this.boatLength),
				Id: parseFloat(this.boatId),
				TournamentId: tournamentId,
			};
			const group: Group = {
				Boat: boat,
				Members: this.members,
			};
			this.sendRequest(group).then(() => {
				this.reload();
				this.request.getBoats(tournamentId);
			});
		} else {
			this.submissionInProcess = false;
		}
	}

	private membersAvailable() {
		if (this.members.length == 0) {
      this.membersLabel = 'Must have at least one registered person on a boat.';
			this.addMember();
			return false;
    }

    // Verify age of each member
    let foundError = false;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].Age < 0 || this.members[i].Age > 100) {
        this.membersLabels[i] = 'Invalid age. Must be from 0-100.';
        foundError = true;
      }
    }

    if (foundError) {
      return false;
    }

    this.membersLabel = '';
    for (let i = 0; i < 100; i++) {
      this.membersLabels[i] = ''
    }

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
				member.TournamentId = tournamentId;
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
		} else if (this.boatName.length > this.request.MAX_STRING_LENGTH) {
			this.nameLabel = this.request.MAX_STRING_LENGTH + ' characters max';
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
	  this.submissionInProcess = false;
  }
}





