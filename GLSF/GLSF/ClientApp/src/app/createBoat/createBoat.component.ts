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

  //Gets all tournaments to set up boat request
	async setUpBoatRequest() {
		const tournamentId = await this.request.getTournaments();
		this.request.getBoats(tournamentId);
	}

  //Adds a default member to a boat, (all boats need at least 1 person on it)
	addMember() {
		const member: Member = { Name: "", Age: null, IsCaptain: false, IsJunior: false, Id: 0, BoatId: 0, TournamentId: 0};
		this.members.push(member);
	}

  //Removes specified member from list
	removeMember(i) {
    this.members.splice(i, 1);
    this.membersLabels.splice(i, 1);
    this.membersLabels.push(''); // to keep the array at the same size
	}

  //Selects the member as captain of the ship, it is possible that no captain can be selected
	selectedCaptain(index) {
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].IsCaptain = false;
			if (i == index) {
				this.members[i].IsCaptain = true;
			}			
		}
	}

  //Filters boats by selected tournament, prevents duplicates
	filter(tournamentId) {
		this.request.getBoats(tournamentId);
	}

  //Creates boat for tournament, validates boat values
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
        CheckedIn: false,
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

  //Makes sure one member is on a boat at least.
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

  //Makes sure each member has valid information (age, name, etc..)
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

  // Makes sure boat name is available and not taken
	private checkName() {
		if (this.boatName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.boatName.length > this.request.MAX_STRING_LENGTH) {
			this.nameLabel = this.request.MAX_STRING_LENGTH + ' characters max';
			return false;
		} else if (this.request.boats.find(boat => boat.Name == this.boatName) != undefined) {
			this.nameLabel = "Boat name already in use"
		}
		this.nameLabel = '';
		return true;
	}

  //Makes sure length is a valid number
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

  //Makes sure boat ID isn't already taken for tournament
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

  //Sends request for boat to be made in database
	private sendRequest(values) {
		const boatLink = this.baseUrl + 'api/database/boat';
		return this.request.post(values, boatLink);
	}

  //Reloads boat creation page
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





