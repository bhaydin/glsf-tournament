import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Fish, Tournament, BoatGroup } from '../models/dataSchemas';
import { Router } from "@angular/router"
import { DatePipe } from '@angular/common';
import { CameraDialog } from './camera';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';
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
	base64 = null;
	isTagged = false;
	imageAvailable = false;
	subStyle = "normal";
	currentDate: Date = new Date();
	fishes = Fish.fishes;
	dataURL: any;
	file: any;
	model: any;
	modelLocation = "../assets/FishModel/FishClassifier/model.json";
	IMAGENET_CLASSES = {
		0: 'Fish',
		1: 'Not a fish',
	};
	tournaments: Array<Tournament> = [];
	groups: Array<BoatGroup> = [];

	constructor(private dialog: MatDialog, private pipe: DatePipe, private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	ngOnInit() {
			this.getGroups();
			this.getTournaments();
    this.loadModel();
  }

  async loadModel() {
    console.log("Loading model");
    const var1 = await fetch(this.modelLocation);
    console.log(var1);
    this.model = await tf.loadModel(this.modelLocation);
    console.log("Model: ");
    console.log(this.model);
    console.log("");
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
				Name: 'No Tournaments Available',
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
				Name: 'No groups available',
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
        this.dataURL = reader.result;
      };

      console.log("Read file");
		}
	}

	removeImage() {
		this.base64 = null;
		this.imageAvailable = false;
	}

	tagged(isTagged) {
		this.isTagged = isTagged;
	}

	createFish(weight, length, species, date, sampleNumber, location, stationNumber, tournamentId, boatId) {
    const validLength = this.checkLength(length, species);
    const validWeight = this.checkWeight(weight, species);
		let validID = true;
		if (this.isTagged) {
			validID = this.checkSampleNumber(sampleNumber);
		} else {
			sampleNumber = null;
		}
		if (location === '') {
			location = null;
		}
		if (validLength && validWeight && validID && tournamentId != -1 && boatId != -1) {
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
				isValid: true,     //Ethan modify this variable based on model
				TournamentId: parseFloat(tournamentId),
				BoatId: parseFloat(boatId),
			};
			this.sendRequest(fish);
      this.reload();
    }
  }

	private checkSampleNumber(sampleNumber) {
		if (!(sampleNumber === '')) {
			if (parseFloat(sampleNumber)) {
				sampleNumber = parseFloat(sampleNumber);
				if (sampleNumber >= 0) {
		    	this.sampleLabel = '';
        } else {
		     	this.sampleLabel = 'TagID Negative';
          return false;
        }
      } else {
		     this.sampleLabel = 'Invalid TagID';
        return false;
      }
    }
    return true;
  }

  private checkLength(length, species) {
    if (length !== '') {
      if (!isNaN(length)) {
        length = parseFloat(length);
		  if (length > 0 && length < Fish.maxLengths[species]) {
          this.lengthLabel = '';
          return true;
        } else {
          this.lengthLabel = 'Length is out of standard bounds';
        }
      } else {
        this.lengthLabel = 'Invalid Length';
      }
    } else {
      this.lengthLabel = 'No Length Entry';
    }
    return false;
  }

  private checkWeight(weight, species) {
    if (weight !== '') {
      if (!isNaN(weight)) {
        weight = parseFloat(weight);
		  if (weight > 0 && weight < Fish.maxWeights[species]) {
          this.weightLabel = '';
          return true;
        } else {
          this.weightLabel = 'Weight is out of standard bounds';
        }
      } else {
        this.weightLabel = 'Invalid Weight';
      }
    } else {
      this.weightLabel = 'No Weight Entry';
    }
    return false;
  }

  private sendRequest(values) {
    const link = this.baseUrl + 'api/database/fish';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }

    console.log(values);
    this.predict(link, values, httpOptions);
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

  async predict(link, values, httpOptions) {
    console.log(values);
    console.log("Predicting");

    let image = $("#selected-image").get(0); //<HTMLImageElement> this.dataURL;
    console.log(image);

    var canvas = <HTMLCanvasElement>document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      img = <HTMLImageElement>(new Image()),
      w = canvas.width / 3;

    ctx.drawImage(<HTMLImageElement>image, 0, 0);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    console.log("Image data");
    console.log(data.length);
    console.log(canvas.width);
    console.log(canvas.height);
    console.log(data);

    for (var i = 0; i < data.length; i += 4) {
      data[i] = data[i] / 255.0;   // Red
      data[i + 1] = data[i + 1] / 255.0; // Green
      data[i + 2] = data[i + 2] / 255.0; // Blue
    }

    let tensor = tf.fromPixels(imgData)
      .resizeNearestNeighbor([250, 250])
      .toFloat()
      .expandDims();

    console.log(tensor.shape);

    console.log("getting predictions from model");
    let predictions = await this.model.predict(tensor).data();
    console.log("got predictions");
    console.log(predictions);


    console.log("making prediction list");
    $("#prediction-list").empty();
    let prediction = predictions[0];
    let valid = false;

    if (prediction >= .8) {
      valid = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Made predictions");

    console.log(values);
    values.Valid = valid;
    console.log(values);

    this.http.post<Fish>(link, values, httpOptions).subscribe();
    console.log("Sent data to DB");
  }
}





