import { Component, Inject, OnInit } from '@angular/core';
import { Fish } from '../models/dataSchemas';
import { DatePipe } from '@angular/common';
import { CameraDialog } from './camera';
import { MatDialog } from '@angular/material';
import { Requests } from '../http/Requests';
import * as tf from '../../assets/tfjs.js';


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
	idLabel = '';
	weight = '';
	length = '';
	hasTag = false;
	validFish = true;
	validFishLabel = '';
	sampleNumber = '';
	port = '';
	base64 = '';
	imageAvailable = false;
	subStyle = "normal";
	currentDate: Date = new Date();
	fishes = Fish.fishes;
	model: any;
	modelLocation = "../assets/FishModel/FishClassifier/model.json";

	constructor(private request: Requests, private dialog: MatDialog, private pipe: DatePipe, @Inject('BASE_URL') private baseUrl: string) {}

	ngOnInit() {
		this.loadModel();
		this.request.initialize()
	}

	private async loadModel() {
		this.model = await tf.loadModel(this.modelLocation);
	}

	async filterTournament(tournament, isJunior) {
		try {
			tournament = JSON.parse(tournament);
			this.request.filterStations(tournament.Id);
			await this.request.filterBoats(tournament.Id);
			await this.request.filterMembers(tournament.Id, this.request.boats[0].Id, isJunior);
		} catch (e) {}
	}

	filterBoat(boat, isJunior) {
		try {
			boat = JSON.parse(boat);
			this.request.filterMembers(boat.TournamentId, boat.Id, isJunior);
		} catch (e) {}
	}

	async openDialog() {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result != undefined) {
				this.validFishLabel = '';
				this.base64 = result;
				this.imageAvailable = true;
				this.validFish = await this.predict();				
			}
		});
	}

	preview(image) {
		if (image.length !== 0) {
			const reader = new FileReader();
			reader.readAsDataURL(image[0]);
			reader.onload = async () => {
				this.validFishLabel = '';
				this.base64 = reader.result.toString();
				this.imageAvailable = true;
				this.validFish = await this.predict();
			};
		}
	}

	//Makes the image 300*300 so its smaller for storage.
  //Returns the base64 string of the 300x300 image
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

	async createFish(species, date, station, tournament, boat, member) {
		let validItems = true;
		let validSampleNumber = true;
		try {
			station = JSON.parse(station);
			tournament = JSON.parse(tournament);
			boat = JSON.parse(boat);
			member = JSON.parse(member);
			if (this.port == '') {
				this.port = station.Name;
			}
			this.idLabel = '';
		} catch (e) {
			validItems = false;
			this.idLabel = 'Must have valid tournament, boat, station, and species';
		}
		if (this.hasTag) {
			validSampleNumber = this.checkSampleNumber();
		} else {
			this.sampleNumber = '';
		}
		const validLength = this.checkLength(species);
		const validWeight = this.checkWeight(species);

		if (validLength && validWeight && validSampleNumber && validItems) {
			const validStation = this.request.checkDropdownStation(station);
			const validSpecies = this.request.checkDropdownSpecies(species);
			const validTournament = this.request.checkDropdownTournament(tournament);
			const validBoat = this.request.checkDropdownBoat(boat);
			const validMember = this.request.checkDropdownMember(member);
			if (validSpecies && validBoat && validStation && validTournament && validMember) {
				this.idLabel = '';
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
					StationNumber: parseFloat(station.Id),
					MemberId: parseFloat(member.Id),
					Id: null, //This value is auto incremented in the DB
					TournamentId: parseFloat(tournament.Id),
					BoatId: parseFloat(boat.Id),
				};
				this.sendRequest(fish);
				this.reload();
			} else {
				this.idLabel = 'Error occured in checking dropdowns, invalid values';
				this.port = '';
			}
		} else {
			this.port = '';
		}
	}

	private checkSampleNumber() {
		if (this.hasTag) {
			if (this.sampleNumber.length > 300) {
				this.sampleLabel = 'Too long';
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
	  this.hasTag = false;
	  this.port = '';
  }

  private async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


	private async predict() {
		let canvas = <HTMLCanvasElement>document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		let image = new Image();
    image.src = this.base64;
		let totalTime = 0;
		while (image.width == 0 && totalTime < 1000) {
			console.log("sleeping");
			await this.sleep(100);
			totalTime += 100;
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
			return true;
		} else {
			this.validFishLabel = 'Try another picture';
			return false;
		}
  }
}
