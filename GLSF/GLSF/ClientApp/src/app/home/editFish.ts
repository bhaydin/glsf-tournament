import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Fish } from '../models/dataSchemas';
import { Requests } from '../http/Requests';
import { CameraDialog } from '../dataEntry/camera'
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-editFish',
	templateUrl: './editFish.html',
	styleUrls: ['./editFish.css']
})


export class EditFishDialog implements OnInit {
	fishInEdit: Fish;
	fishes = Fish.fishes;
	imageAvailable: boolean = false;
	dateCaught: Date;

	constructor(public dialogRef: MatDialogRef<EditFishDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data, public request: Requests, @Inject('BASE_URL') private baseUrl: string, private pipe: DatePipe) {
		this.fishInEdit = data;
		this.initializeEditFishRequest();
	}

	ngOnInit() {
		this.setUpDialog();
	}

	async initializeEditFishRequest() {
		this.request.getBoats(this.fishInEdit.TournamentId)
		this.request.getStations(this.fishInEdit.TournamentId);
		await this.request.getMembers(this.fishInEdit.TournamentId);
		this.request.filterMembers(this.fishInEdit.BoatId, false);
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

	filterBoat(boatId) {
		this.request.filterMembers(boatId, false);
	}

	async filterTournament(tournamentId) {
		this.request.getBoats(tournamentId)
		this.request.getStations(tournamentId);
		await this.request.getMembers(tournamentId);
		this.request.filterMembers(this.request.boats[0].Id, false);
	}

	saveChanges(species, date, tournamentId, boatId, memberId, stationId) {
		this.fishInEdit.Species = species;
		this.fishInEdit.TournamentId = tournamentId;
		this.fishInEdit.BoatId = parseFloat(boatId);
		this.fishInEdit.StationNumber = parseFloat(stationId);
		this.fishInEdit.MemberId = parseFloat(memberId);
		this.fishInEdit.Date = this.pipe.transform(date, 'MM/dd/yyyy');
		if (!this.fishInEdit.HasTag) {
			this.fishInEdit.SampleNumber = '';
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
