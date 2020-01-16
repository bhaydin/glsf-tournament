import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Fish, Tournament, Boat, Station } from '../models/dataSchemas';
import { Requests } from '../http/Requests';
import { CameraDialog } from '../dataEntry/camera'
import { DatePipe } from '@angular/common';

export interface DialogData {
	base64: string;
}

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
	fishTournament: Tournament;
	fishBoat: Boat;
	fishStation: Station;
	currentDate: Date = new Date();

	constructor(public dialogRef: MatDialogRef<EditFishDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data, public request: Requests, @Inject('BASE_URL') private baseUrl: string, private pipe: DatePipe) {
		this.fishInEdit = data;
	}

	ngOnInit() {
		this.dateCaught = new Date(this.fishInEdit.Date);
		this.imageAvailable = (this.fishInEdit.Image != '');
	}



	onNoClick() {
		this.dialogRef.close();
	}

	deleteFish() {
		const link = this.baseUrl + 'api/database/fish/' + this.fishInEdit.Id;
		this.request.delete(link);
		this.request.allFishes = this.request.allFishes.filter(fish => fish.Id != this.fishInEdit.Id)
		this.request.fishes = this.request.allFishes;
		this.dialogRef.close();
	}

	openCameraDialog() {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result != undefined) {
				this.fishInEdit.Image = result;
				this.imageAvailable = true;
			}
		});
	}

	saveChanges(species, date, tournamentId, boatId, memberId, stationId) {
		this.fishInEdit.Species = species;
		this.fishInEdit.TournamentId = parseFloat(tournamentId);
		this.fishInEdit.BoatId = parseFloat(boatId);
		this.fishInEdit.StationNumber = parseFloat(stationId);
		this.fishInEdit.MemberId = parseFloat(memberId);
		this.fishInEdit.Date = this.pipe.transform(date, 'MM/dd/yyyy');
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
