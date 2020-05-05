import { Component, Inject, OnInit } from '@angular/core';
import { Fish } from '../models/dataSchemas';
import { DatePipe } from '@angular/common';
import { CameraDialog } from './camera';
import { MatDialog } from '@angular/material';
import { Requests } from '../http/Requests';
import * as tf from '../../assets/tfjs.js';
import * as $ from 'jquery';


@Component({
	selector: 'app-dataEntry',
	templateUrl: './dataEntry.html',
	styleUrls: ['../componentStyle.css'],
	providers: [DatePipe]
})

export class DataEntryComponent implements OnInit {
  weightLabel = '';
	lengthLabel = '';
	sampleLabel = '';
	weight = '';
	length = '';
	hasTag = false;
	validFish = true;
	noClips = false;
	submissionInProcess = false;
	validFishLabel = '';
  sampleNumber = '';
  finOption = 'Unspecified';
  finClip = 'Unspecified';
	port = '';
	base64 = '';
	finClips = '';
	imageAvailable = false;
	subStyle = "normal";
	fishLabelStyle = "greenText";
	currentDate: Date = new Date();
	fishes = Fish.fishes;
	valueSelected = true;
	model: any;
	modelLocation = "../assets/FishModel/FishClassifier/model.json";

	constructor(private request: Requests, private dialog: MatDialog, private pipe: DatePipe, @Inject('BASE_URL') private baseUrl: string) {
		this.request.initialize();
    this.loadModel();
	}

  ngOnInit() {}

	private async loadModel() {
		this.model = await tf.loadModel(this.modelLocation);
  }

	async filterMembers(boatId, isJunior) {
		await this.request.filterMembers(boatId, isJunior);
	}

	async filterTournament(tournamentId, isJunior) {
		await this.request.getBoats(tournamentId);
		this.request.getStations(tournamentId);
		await this.request.getMembers(tournamentId);
		await this.request.filterMembers(this.request.boats[0].Id, isJunior);
		await this.request.filterCheckedInBoats();
	}

	async openDialog() {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result != undefined) {
				this.setImage(result);			
			}
		});
	}

	preview(image) {
		if (image.length !== 0) {
			const reader = new FileReader();
			reader.readAsDataURL(image[0]);
			reader.onload = () => {
				this.setImage(reader.result.toString());
			};
		}
	}

	private async setImage(image) {
		this.validFishLabel = '';
		this.base64 = image;
		this.imageAvailable = true;
		this.validFish = await this.predict();
	}

	//Makes the image 250*250 so its smaller for storage.
  //Returns the base64 string of the 250x250 image
	resizeImage(imageString) {
		const dimension = 250;
		let image = new Image();
		image.src = imageString;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		let ratio = dimension/image.width;
		if (image.height >= image.width) {
			ratio = dimension / image.height;
			canvas.width = image.width * ratio
			canvas.height = dimension;
		} else {
			canvas.width = dimension;
			canvas.height = image.height * ratio
		}
		ctx.drawImage(image, 0, 0, image.width * ratio, image.height * ratio);
		return canvas.toDataURL().toString();
	}

	removeImage() {
		this.base64 = '';
		this.imageAvailable = false;
		this.validFishLabel = '';
		this.validFish = true;
	}

	selectedOption(boolValue) {
		this.valueSelected = boolValue;
	}

	async createFish(species, date, stationId, tournamentId, boatId, memberId) {
		this.submissionInProcess = true;
		if (this.port == '') {
			this.port = this.request.getStation(stationId).Port;
		}
		if (this.noClips == false && this.finClips == "") {
			this.finClips = "Unspecified";
		} else if (this.noClips == true) {
			this.finClips = "";
		}
		const validSampleNumber = this.checkSampleNumber();
		const validLength = this.checkLength(species);
		const validWeight = this.checkWeight(species);
		const validStation = this.request.checkDropdownStation(stationId);
		const validSpecies = this.request.checkDropdownSpecies(species);
		const validTournament = this.request.checkDropdownTournament(tournamentId);
		const validBoat = this.request.checkDropdownBoat(boatId);
		const validMember = this.request.checkDropdownMember(memberId);
		if (validLength && validWeight && validSampleNumber && validSpecies && validBoat && validStation && validTournament && validMember) {
				const formattedDate = this.pipe.transform(date, 'MM/dd/yyyy');
				const fish: Fish = {
					Weight: parseFloat(this.weight),
					Length: parseFloat(this.length),
					Species: species,
					Image: this.resizeImage(this.base64),
					Date: formattedDate,
					SampleNumber: this.sampleNumber,
					HasTag: this.hasTag,
					Port: this.port,
					IsValid: this.validFish,
					NoClips: this.noClips,
					FinsClipped: this.finClips,
					StationNumber: parseFloat(stationId),
					MemberId: parseFloat(memberId),
					Id: null, //This value is a GUID in the DB
					TournamentId: tournamentId,
					BoatId: parseFloat(boatId),
				};
				this.sendRequest(fish);
				this.reload();
	  }else {
			this.port = '';
			this.submissionInProcess = false;
		}
	}

	private checkSampleNumber() {
		if (this.hasTag) {
			if (this.sampleNumber.length > this.request.MAX_STRING_LENGTH) {
				this.sampleLabel = this.request.MAX_STRING_LENGTH + ' characters max';
				return false;
			}
		}
		this.sampleLabel = '';
    return true;
  }

	private checkLength(species) {
		const lengthNum = parseFloat(this.length);
		if (this.length == '') {
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

	private checkWeight(species) {
		const weightNum = parseFloat(this.weight);
		if (this.weight == '') {
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

	private sendRequest(values) {
		const link = this.baseUrl + 'api/database/fish';
		this.request.post(values, link);
	}

  private async reload() {
    this.subStyle = "success";
    await this.request.wait(200);
	  this.subStyle = "normal";
	  this.currentDate = new Date();
	  this.removeImage();
	  this.length = '';
	  this.weight = '';
    this.sampleNumber = '';
    this.noClips = false;
	  this.hasTag = false;
	  this.finClips = '';
	  this.submissionInProcess = false;
  }

	private async predict() {
		let canvas = <HTMLCanvasElement>document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		let image = new Image();
    image.src = this.base64;
		let totalTime = 0;
		while ((image.width == 0 || this.model == undefined) && totalTime <= 2) {
			await this.request.wait(200);
			totalTime += 0.2;
		}

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = data[i] / 255.0;   // Red
      data[i + 1] = data[i + 1] / 255.0; // Green
      data[i + 2] = data[i + 2] / 255.0; // Blue
      data[i + 3] = data[i + 3] / 255.0; // Alpha
    }

    let tensor = tf.fromPixels(imgData)
      .resizeNearestNeighbor([250, 250])
      .toFloat()
      .expandDims();

    let predictions = await this.model.predict(tensor).data();
    let prediction = 1 - predictions[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (prediction >= .8) {
			this.validFishLabel = 'Looks like a fish!';
			this.fishLabelStyle = 'greenText';
			return true;
		}
		this.fishLabelStyle = 'redText';
		this.validFishLabel = 'Try another picture';
		return false;
  }
}
