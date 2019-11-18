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
	noAvailableTournaments = false;
	noAvailableBoats = false;
	noAvailableStations = false;
	hasTag = false;
	validFish = false;
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
		this.availability();
	}

	private async loadModel() {
		this.model = await tf.loadModel(this.modelLocation);
	}

	private async availability() {
		this.request.initialize().then(() => {
			this.noAvailableTournaments = this.request.noTournamentsAvailable;
			this.noAvailableBoats = this.request.noBoatsAvailable;
			this.noAvailableStations = this.request.noStationsAvailable;
		});
		return true;
	}

	async filter(value) {
		this.noAvailableBoats = await this.request.filterBoats(value);
		this.noAvailableStations = await this.request.filterStations(value);
	}

	async openDialog() {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result != undefined) {
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
		    this.base64 = await reader.result.toString();
		    this.imageAvailable = true;
		    this.validFish = await this.predict();

			};
		}
	}

	removeImage() {
		this.base64 = '';
		this.imageAvailable = false;
		this.validFishLabel = '';

	}

	async createFish(species, date, station, tournamentId, boatId) {
		station = JSON.parse(station);
		const validLength = this.checkLength(species);
		const validWeight = this.checkWeight(species);
		const validIds = this.checkIds(station[0], tournamentId, boatId);
		let validID = true;
		if (this.hasTag) {
			validID = this.checkSampleNumber();
		}
		if (this.port == '') {
			this.port = station.Name;
		}
		if (validLength && validWeight && validID && validIds) {
			const formattedDate = this.pipe.transform(date, 'MM/dd/yyyy');
			const fish: Fish = {
				Weight: parseFloat(this.weight),
				Length: parseFloat(this.length),
				Species: species,
				Image: this.base64,
				Date: formattedDate,
				SampleNumber: parseFloat(this.sampleNumber),
				HasTag: this.hasTag,
				Port: this.port,
				isValid: this.validFish,
				StationNumber: parseFloat(station.Id),
				Id: null, //This value is auto incremented in the DB
				TournamentId: parseFloat(tournamentId),
				BoatId: parseFloat(boatId),
			};
			console.log(fish);
			this.sendRequest(fish);
			this.reload();
		} else {
			this.port = '';
		}
	}

	private checkIds(stationId, tournamentId, boatId) {
		if (tournamentId == '' || stationId == '' || boatId == '') {
			this.idLabel = 'Must have valid tournament, boat, and station';
			return false;
		}
		this.idLabel = '';
    return true;
	}

	private checkSampleNumber() {
		const sampleNum = parseFloat(this.sampleNumber);
		if (this.sampleNumber == '') {
			this.sampleLabel = 'Enter number';
			return false;
		} else if (isNaN(sampleNum)) {
			this.sampleLabel = 'Must be a number';
			return false;
		} else if (sampleNum < 0) {
			this.sampleLabel = 'Must be positive';
			return false;
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






