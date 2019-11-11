import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Fish, Tournament, BoatGroup } from '../models/dataSchemas';
import { Router } from "@angular/router"
import { DatePipe } from '@angular/common';
import { CameraDialog } from './camera';
import { MatDialog } from '@angular/material';
import * as tf from '../../assets/tfjs.js';


@Component({
	selector: 'app-dataEntry',
	templateUrl: './dataEntry.html',
	styleUrls: ['./dataStyling.css'],
	providers: [DatePipe]
})

export class DataEntryComponent implements OnInit {
  weightLabel = '';
  lengthLabel = '';
	sampleLabel = '';
	stationLabel = '';
	base64 = null;
	isTagged = false;
	imageAvailable = false;
	subStyle = "normal";
	currentDate: Date = new Date();
	fishes = Fish.fishes;
	model: any;
	modelLocation = "../assets/FishModel/FishClassifier/model.json";

	potato = '';
	private tournaments: Array<Tournament> = [];
	private groups: Array<BoatGroup> = [];

	constructor(private dialog: MatDialog, private pipe: DatePipe, private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	ngOnInit() {
		this.getGroups();
		this.getTournaments();
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadModel(this.modelLocation);
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

	private getGroups() {
		const link = this.baseUrl + 'api/database/group';
		this.http.get<BoatGroup[]>(link).subscribe(body =>
			body.forEach((entity) => {
				this.groups.push(entity);
			})
		);
		if (this.groups.length) {
			const group: BoatGroup = {
				Name: 'No groups registered',
				AgeGroup: 'N/A',
				Id: -1,
				TournamentId: -1,
			}
			this.groups.push(group)
		}
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != undefined) {
				this.base64 = result.toString();
				this.imageAvailable = true;
			}
		});
	}

	preview(image) {
		if (image.length !== 0) {
			const reader = new FileReader();
			reader.readAsDataURL(image[0]);
      reader.onload = () => {
        this.base64 = reader.result.toString();
        this.imageAvailable = true;
      };
		}
	}

	removeImage() {
		this.base64 = null;
		this.imageAvailable = false;
	}

	tagged(isTagged) {
		this.isTagged = isTagged;
	}

	async createFish(weight, length, species, date, sampleNumber, location, stationNumber, tournamentId, boatId) {
    const validLength = this.checkLength(length, species);
		const validWeight = this.checkWeight(weight, species);
		const validStation = this.checkStationNumber(stationNumber);
		let validID = true;
		if (this.isTagged) {
			validID = this.checkSampleNumber(sampleNumber);
		} else {
			sampleNumber = null;
		}
		if (location === '') {
			location = null;
		}
		let validFish = true;
		if (this.base64 != null) {
			validFish = await this.predict();
		}

		if (validLength && validWeight && validID && validStation && tournamentId != -1 && boatId != -1) {
			const formattedDate = this.pipe.transform(date, 'MM/dd/yyyy');
			var fish = {
				Weight: parseFloat(weight),
				Length: parseFloat(length),
				Species: species,
				Image: this.base64,
				Date: formattedDate,
				SampleNumber: parseFloat(sampleNumber),
				HasTag: this.isTagged,
				Location: location,
				StationNumber: parseFloat(stationNumber),
				isValid: validFish,
				TournamentId: parseFloat(tournamentId),
				BoatId: parseFloat(boatId),
			};
			this.sendRequest(fish);
      this.reload();
    }
  }

	private checkStationNumber(stationNumber) {
		const stationNum = parseFloat(stationNumber);
		if (stationNumber == '') {
			this.stationLabel = 'Enter number';
			return false;
		} else if (isNaN(stationNumber)) {
			this.stationLabel = 'Must be a number';
			return false;
		} else if (stationNum < 0) {
			this.stationLabel = 'Must be positive';
			return false;
		}
		this.stationLabel = '';
		return true;
	}

	private checkSampleNumber(sampleNumber) {
		const sampleNum = parseFloat(sampleNumber);
		if (sampleNumber == '') {
			this.sampleLabel = 'Enter number';
			return false;
		} else if (isNaN(sampleNumber)) {
			this.sampleLabel = 'Must be a number';
			return false;
		} else if (sampleNum < 0) {
			this.sampleLabel = 'Must be positive';
			return false;
		}
		this.sampleLabel = '';
    return true;
  }

	private checkLength(length, species) {
		if (length == '') {
			this.lengthLabel = 'Enter length';
			return false;
		} else if (isNaN(length)) {
			this.lengthLabel = 'Invalid length';
			return false;
		} else if (length < 0 || length > Fish.maxLengths[species]) {
			this.lengthLabel = 'Out of bounds';
			return false;
		}
		this.lengthLabel = '';
		return true;
  }

	private checkWeight(weight, species) {
		if (weight == '') {
			this.weightLabel = 'Enter weight';
			return false;
		} else if (isNaN(weight)) {
			this.weightLabel = 'Invalid weight';
			return false;
		} else if (weight < 0 || weight > Fish.maxWeights[species]) {
			this.weightLabel = 'Out of bounds';
			return false;
		}
		this.weightLabel = '';
		return true;
  }

  private sendRequest(values) {
    const link = this.baseUrl + 'api/database/fish';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
	  this.http.post<Fish>(link, values, httpOptions).subscribe();
  }

  private async reload() {
    this.subStyle = "success";
    await this.wait(300);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/data_entry']);
    });
  }

  private wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

	private async predict() {
		let canvas = <HTMLCanvasElement>document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		let image = new Image();
		image.src = this.base64;
    ctx.drawImage(image, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = data[i] / 255.0;   // Red
      data[i + 1] = data[i + 1] / 255.0; // Green
      data[i + 2] = data[i + 2] / 255.0; // Blue
    }

    let tensor = tf.fromPixels(imgData)
      .resizeNearestNeighbor([250, 250])
      .toFloat()
      .expandDims();

    let predictions = await this.model.predict(tensor).data();
		let prediction = predictions[0];
		ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (prediction >= .8) {
		  return await true;
		}
		return false;
  }
}





