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
  currentDate: Date = new Date();
  weightLabel = '';
  lengthLabel = '';
  sampleLabel = '';
  validFishLabel = '';

	constructor(public dialogRef: MatDialogRef<EditFishDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data, public request: Requests, @Inject('BASE_URL') private baseUrl: string, private pipe: DatePipe, private authenticationService: AuthenticationService) {
		this.fishInEdit = data;
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.initializeEditFishRequest();
	}

	ngOnInit() {
		this.setUpDialog();
	}

  //Gets all information for the request class to edit a fish.
  //Establishes values that the fish currently has so that the values before edit can be restored easily
	async initializeEditFishRequest() {
		await this.request.getBoats(this.fishInEdit.TournamentId);
		await this.request.filterCheckedInBoats();
		await this.request.getStations(this.fishInEdit.TournamentId);
		await this.request.getMembers(this.fishInEdit.TournamentId);
		await this.request.filterMembers(this.fishInEdit.BoatId, false);
    this.baseTournament = await this.request.getTournament(this.fishInEdit.TournamentId).Name;
    this.baseBoat = await this.request.getBoat(this.fishInEdit.BoatId).Name;
		this.baseMember = await this.request.getMember(this.fishInEdit.MemberId).Name;
		const station = await this.request.getStation(this.fishInEdit.StationNumber);
		this.baseStation = station.Id + " : " + station.Port;
	}

  //Initializes a few values within the edited fish that need formating
	async setUpDialog() {
		this.dateCaught = new Date(this.fishInEdit.Date);
		this.imageAvailable = (this.fishInEdit.Image != '');
	}

  //When the dialogue is clicked out of bounds or on the cancel button
  //Does not save any changes to the fish
	onNoClick() {
		this.dialogRef.close();
	}

  //When a fish is invalid and is requested that it be deleted
	deleteFish() {
		const link = this.baseUrl + 'api/database/fish/fishId/' + this.fishInEdit.Id;
		this.request.delete(link);
    this.request.fishes = this.request.fishes.filter(fish => fish.Id != this.fishInEdit.Id);
		this.dialogRef.close();
	}

  //Opens the camera so that the fishes image can be updated
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

  //Called when the boat selected for a fish is changed, and the members need to be updated in the select drop down
	filterBoat(boatId) {
		this.request.filterMembers(boatId, false);
	}

	async filterTournament(tournamentId) {
		await this.request.getBoats(tournamentId);
		await this.request.filterCheckedInBoats();
		await this.request.getStations(tournamentId);
		await this.request.getMembers(tournamentId);
		await this.request.filterMembers(this.request.boats[0].Id, false);
		this.fishInEdit.BoatId = this.request.boats[0].Id;
		this.fishInEdit.MemberId = this.request.members[0].Id;
		this.fishInEdit.StationNumber = this.request.stations[0].Id;
	}

  //Saves the changes made to the fish, verifies that all values are valid
  saveChanges(date) {
    const validSampleNumber = this.checkSampleNumber(this.fishInEdit.HasTag, this.fishInEdit.SampleNumber);
    const validLength = this.checkLength(this.fishInEdit.Species, this.fishInEdit.Length);
    const validWeight = this.checkWeight(this.fishInEdit.Species, this.fishInEdit.Weight);
    const validStation = this.request.checkDropdownStation(this.fishInEdit.StationNumber);
    const validSpecies = this.request.checkDropdownSpecies(this.fishInEdit.Species);
    const validTournament = this.request.checkDropdownTournament(this.fishInEdit.TournamentId);
    const validBoat = this.request.checkDropdownBoat(this.fishInEdit.BoatId);
	  const validMember = this.request.checkDropdownMember(this.fishInEdit.MemberId);
	  if (validLength && validWeight && validSampleNumber && validSpecies && validBoat && validStation && validTournament && validMember) {
		  this.fishInEdit.Date = this.pipe.transform(date, 'MM/dd/yyyy');
		  if (this.fishInEdit.NoClips == false && this.fishInEdit.FinsClipped == "") {
			  this.fishInEdit.FinsClipped = "Unspecified";
		  } else if (this.fishInEdit.NoClips == true) {
			  this.fishInEdit.FinsClipped = "";
		  }
		  this.dialogRef.close(this.fishInEdit);
	  }
  }

  //Validates that a sample number is 300 characters or less
  private checkSampleNumber(hasTag, sampleNumber) {
    if (hasTag) {
      if (sampleNumber.length > this.request.MAX_STRING_LENGTH) {
        this.sampleLabel = this.request.MAX_STRING_LENGTH + ' characters max';
        return false;
      }
    }
    this.sampleLabel = '';
    return true;
  }

  //Validates length to make sure it is numeric, and within realistic bounds
  private checkLength(species, length) {
    const lengthNum = parseFloat(length);
    if (length == '') {
      this.lengthLabel = 'Enter length';
      return false;
    } else if (isNaN(lengthNum)) {
      this.lengthLabel = 'Invalid length';
      return false;
    } else if (lengthNum < 0 || lengthNum > Fish.maxLengths[species]) {
      this.lengthLabel = 'Out of bounds';
      return false;
    }
    this.lengthLabel = '';
    return true;
  }

  //Validates weight to make sure its numeric, and it is within realistic bounds
  private checkWeight(species, weight) {
    const weightNum = parseFloat(weight);
    if (weight == '') {
      this.weightLabel = 'Enter weight';
      return false;
    } else if (isNaN(weightNum)) {
      this.weightLabel = 'Invalid weight';
      return false;
    } else if (weightNum < 0 || weightNum > Fish.maxWeights[species]) {
      this.weightLabel = 'Out of bounds';
      return false;
    }
    this.weightLabel = '';
    return true;
  }

  //Removes image so that it doesn't exist
	removeImage() {
		this.fishInEdit.Image = '';
		this.imageAvailable = false;
	}

  //Displays image after one is chosen or taken
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
