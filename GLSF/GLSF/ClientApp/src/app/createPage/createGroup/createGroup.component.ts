import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BoatGroup, Tournament } from '../../models/dataSchemas';
import { Router } from "@angular/router"


@Component({
	selector: 'app-createGroup',
	templateUrl: './createGroup.html',
	styleUrls: ['./createGroup.css'],
})

export class CreateGroupComponent implements OnInit {
	private tournaments: Array<Tournament> = [];
  nameLabel = '';
	idLabel = '';
	subStyle = "normal";
	subText = "Create Group";

	constructor(private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	ngOnInit() {
		this.getTournaments();
	}

	private getTournaments() {
		const link = this.baseUrl + 'api/database/tournament';
		this.http.get<Tournament[]>(link).subscribe(body =>
			body.forEach((entity) => {
				this.tournaments.push(entity);
			})
		);
		if (this.tournaments.length) {
			const tournament: Tournament = {
				StartDate: 'N/A',
				EndDate: 'N/A',
				Name: 'No tournaments created',
				Location: 'N/A',
				Id: -1,
			}
			this.tournaments.push(tournament)
		}
	}

	createGroup(name, id, tournament, group) {
    const validName = this.checkName(name);
		const validId = this.checkId(id);
		if (validName && validId && tournament != -1) {
			var boatGroup = {
				Name: name,
				AgeGroup: group,
				Id: parseFloat(id),
				TournamentId: parseFloat(tournament),
			};
			this.sendRequest(boatGroup);
      this.reload();
    }
  }

	private checkName(groupName) {
		if (groupName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (groupName.length > 300) {
			this.nameLabel = '300 characters max';
			return false;
		}
		this.nameLabel = '';
		return true;
	}

	private checkId(boatId) {
		const idNum = parseFloat(boatId);
		if (boatId == '') {
			this.idLabel = 'Enter number';
			return false;
		} else if (isNaN(boatId)) {
			this.idLabel = 'Invalid number';
			return false;
		} else if (idNum < 0) {
			this.idLabel = 'Must be postivie';
			return false;
		}
		this.idLabel = '';
		return true;
//Need a check to make sure boat isnt registered already for tournament
	}

  private sendRequest(values) {
	  const link = this.baseUrl + 'api/database/group';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
	  }
	  this.http.post<BoatGroup>(link, values, httpOptions).subscribe();
  }

  private async reload() {
	  this.subStyle = "success";
	  this.subText = "Created!";
    await this.wait(300);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/create']);
    });
  }

  private wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}





