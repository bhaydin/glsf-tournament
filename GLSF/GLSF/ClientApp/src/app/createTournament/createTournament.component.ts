import { Component, Inject, OnInit } from '@angular/core';
import { Tournament, Time } from '../models/dataSchemas';
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
	tournamentName = '';
	tournamentLocation = '';
	subStyle = "normal";
	subText = "Submit";
	submissionInProcess = false;
	currentDate: Date = new Date();
	startTime = '12:00 AM';
	endTime = '12:00 AM';

	constructor(private request: Requests, private pipe: DatePipe, @Inject('BASE_URL') private baseUrl: string) {
		this.request.getTournaments();
	}

	ngOnInit() {	}

	createTournament(startDate, endDate) {
		this.submissionInProcess = true;
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		const startTimeStruct = this.splitTime(this.startTime);
		const endTimeStruct = this.splitTime(this.endTime);
		startDate.setHours(startTimeStruct.Hours, startTimeStruct.Minutes, 0);
		endDate.setHours(endTimeStruct.Hours, endTimeStruct.Minutes, 0);
		const validName = this.checkName();
		const validDateRange = this.checkDates(startDate, endDate);
		if (validName && validDateRange) {
			const formattedStartDate = this.pipe.transform(startDate, 'MM/dd/yyyy hh:mm aa');
			const formattedEndDate = this.pipe.transform(endDate, 'MM/dd/yyyy hh:mm aa');
			const tournament: Tournament = {
				StartDate: formattedStartDate,
				EndDate: formattedEndDate,
				Name: this.tournamentName,
				Location: this.tournamentLocation,
				Id: null,
			};
			this.sendRequest(tournament).then(() => {
				this.reload();
				this.request.getTournaments();
			});
		} else {
			this.submissionInProcess = false;
		}
  }

	private splitTime(time) {
		const timeArrayWithMeridiem = time.split(' ');
		const timeArray = timeArrayWithMeridiem[0].split(':');
		return this.formatHours(parseFloat(timeArray[0]), parseFloat(timeArray[1]), timeArrayWithMeridiem[1]);
	}

	private formatHours(hour, minutes, meridiem) {
		hour %= 12;
		if (meridiem == "PM") {
			hour += 12;
		}
		const time: Time = {
			Hours: hour,
			Minutes: minutes,
		};
		return time;
	}

	private checkName() {
		if (this.tournamentName == '') {
			this.nameLabel = 'Enter name';
			return false;
		} else if (this.tournamentName.length > this.request.MAX_STRING_LENGTH) {
			this.nameLabel = this.request.MAX_STRING_LENGTH + ' character max';
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
	  this.tournamentName = '';
	  this.tournamentLocation = '';
	  this.currentDate = new Date();
	  this.submissionInProcess = false;
	  this.startTime = '12:00 AM';
	  this.endTime = '12:00 AM';
  }

}
