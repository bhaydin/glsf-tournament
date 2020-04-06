import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Fish, User } from '../models/dataSchemas';
import { Requests } from '../http/Requests';
import { CameraDialog } from '../dataEntry/camera'
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
	selector: 'app-editFish',
	templateUrl: './editFish.html',
	styleUrls: ['./editFish.css']
})


export class EditFishDialog implements OnInit {
	fishInEdit: Fish;
	baseTournament: string;
	baseStation: string
	baseMember: string;
	baseBoat: string;
	currentUser: User;
	fishes = Fish.fishes;
	imageAvailable: boolean = false;
	dateCaught: Date;
	valueSelected = false;

	constructor(public dialogRef: MatDialogRef<EditFishDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data, public request: Requests, @Inject('BASE_URL') private baseUrl: string, private pipe: DatePipe, private authenticationService: AuthenticationService) {
		this.fishInEdit = data;
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.initializeEditFishRequest();
	}

	ngOnInit() {
		this.setUpDialog();
	}

	async initializeEditFishRequest() {
		if (this.fishInEdit.FinClip != 'Fins Clipped') {
			this.valueSelected = true;
		}
		this.request.getBoats(this.fishInEdit.TournamentId);
		this.request.getStations(this.fishInEdit.TournamentId);
		await this.request.getMembers(this.fishInEdit.TournamentId);
		await this.request.filterMembers(this.fishInEdit.BoatId, false);
		this.baseTournament = this.request.getTournament(this.fishInEdit.TournamentId).Name;
		this.baseBoat = this.request.getBoat(this.fishInEdit.BoatId).Name;
		this.baseMember = this.request.getMember(this.fishInEdit.MemberId).Name;
		const station = this.request.getStation(this.fishInEdit.StationNumber);
		this.baseStation = station.Id + " : "+ station.Port
	}

	async setUpDialog() {
		this.dateCaught = new Date(this.fishInEdit.Date);
		this.imageAvailable = (this.fishInEdit.Image != '');
	}

	onNoClick() {
		this.dialogRef.close();
	}

	deleteFish() {
		const link = this.baseUrl + 'api/database/fish/fishId/' + this.fishInEdit.Id;
		this.request.delete(link);
		this.request.fishes = this.request.fishes.filter(fish => fish.Id != this.fishInEdit.Id)
		this.dialogRef.close();
	}

	openCameraDialog() {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != undefined) {
				this.fishInEdit.Image = result;
				this.imageAvailable = true;
			}
		});
	}

	selectedOption(boolean) {
		this.valueSelected = boolean;
	}

	filterBoat(boatId) {
		this.request.filterMembers(boatId, false);
	}

	async filterTournament(tournamentId) {
		this.request.getBoats(tournamentId)
		this.request.getStations(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

	saveChanges(date) {
		this.fishInEdit.Date = this.pipe.transform(date, 'MM/dd/yyyy');
		if (this.fishInEdit.FinClip != 'Fins Clipped') {
			this.fishInEdit.FinsClipped = this.fishInEdit.FinClip;
		}
		this.dialogRef.close(this.fishInEdit);
	}

	removeImage() {
		this.fishInEdit.Image = '';
		this.imageAvailable = false;
	}

	preview(image) {
		if (image.length !== 0) {
			const reader = new FileReader();
			reader.readAsDataURL(image[0]);
			reader.onload = async () => {
				this.fishInEdit.Image = reader.result.toString();
				this.imageAvailable = true;
			};
		}
	}

}
