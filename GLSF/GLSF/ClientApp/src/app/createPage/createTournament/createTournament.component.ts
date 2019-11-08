import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tournament } from '../../models/dataSchemas';
import { Router } from "@angular/router"
import { DatePipe } from '@angular/common';


@Component({
	selector: 'app-createTournament',
	templateUrl: './createTournament.html',
	styleUrls: ['./createTournament.css'],
	providers: [DatePipe]
})

export class CreateTournamentComponent {
	nameLabel = '';
	dateLabel = '';
  idLabel = '';
	subStyle = "normal";
	subText = "Create Tournament";
	currentDate: Date = new Date();

	constructor( private pipe: DatePipe, private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	createTournament(startDate, endDate, name, id, location) {
    const validName = this.checkName(name);
		const validId = this.checkId(id);
		const validDateRange = this.checkDates(startDate, endDate);
		if (validName && validId && validDateRange) {
			const formattedStartDate = this.pipe.transform(startDate, 'MM/dd/yyyy');
			const formattedEndDate = this.pipe.transform(endDate, 'MM/dd/yyyy');
			var tournament = {
				StartDate: formattedStartDate,
				EndDate: formattedEndDate,
				Name: name,
				Location: location,
				Id: parseFloat(id),
			};
			this.sendRequest(tournament);
      this.reload();
    }
  }

	private checkName(tournamentName) {
		if (tournamentName == '') {
			this.nameLabel = 'Must enter a tournament name';
			return false;
		} else if (tournamentName.length > 300) {
			this.nameLabel = 'Tournament name too long';
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

	private checkId(uniqueId) {
		const idNum = parseFloat(uniqueId);
		if (uniqueId == '') {
			this.idLabel = 'Must enter a tournament id';
			return false;
		} else if (isNaN(uniqueId)) {
			this.idLabel = 'Id must be a number';
			return false;
		} else if (idNum < 0) {
			this.idLabel = 'Tournament Id must be postivie';
			return false;
		}
		this.idLabel = '';
		return true;
  }

  private sendRequest(values) {
	  const link = this.baseUrl + 'api/database/tournament';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
	  }
	  this.http.post<Tournament>(link, values, httpOptions).subscribe();
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
