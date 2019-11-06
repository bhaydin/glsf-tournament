import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Fish } from '../fishModel/fish.model';
import { Router } from "@angular/router"
import { DatePipe } from '@angular/common';
import { CameraDialog } from './camera';
import { MatDialog } from '@angular/material';


@Component({
	selector: 'app-dataEntry',
	templateUrl: './dataEntry.html',
	styleUrls: ['./dataStyling.css'],
	providers: [DatePipe]
})

export class DataEntryComponent {
  weightLabel = '';
  lengthLabel = '';
	sampleLabel = '';
	base64 = '';
	isTagged = false;
	imageAvailable = false;
	subStyle = "normal";
	sampleStyle = "disabled";
	currentDate: Date = new Date();
  fishes = Fish.fishes;

	constructor(private dialog: MatDialog, private pipe: DatePipe, private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	openDialog(): void {
		const dialogRef = this.dialog.open(CameraDialog, {
			panelClass: 'custom-dialog-container'
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != undefined) {
				this.base64 = result;
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
			}
		}
	}

	removeImage() {
		this.base64 = '';
		this.imageAvailable = false;
	}

	tagged(isTagged) {
		this.isTagged = isTagged;
	}

	send_data(weight, length, species, date, sampleNumber, location, stationNumber) {
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
		if (this.base64 === '') {
			this.base64 = null;
		}
		if (validLength && validWeight && validID) {
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
				StationNumber: parseFloat(stationNumber)
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
    const link = this.baseUrl + 'api/fishes';
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
}





