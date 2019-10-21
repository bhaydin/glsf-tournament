import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ECalendarValue } from 'ng2-date-picker';
import { Fishes } from '../fish/fish.model';
import { Router } from "@angular/router"

import * as moment from 'moment';


@Component({
  selector: 'app-website',
  templateUrl: './website.html',
  styleUrls: ['./style.css']
})

export class WebsiteComponent implements OnInit {
  public weightLabel: string;
  public lengthLabel: string;
  public tagIdLabel: string;
  public imgURL: any;
  public base64: string = '';
  public dateConfig: any;
  public camConfig: any;
  public hideCam: boolean = true;
  public webcamLabel: string = "Take Picture";
  public isDisabled: boolean = false;
  public subStyle: any = "btn btn-primary";
  public currentDate: any = moment().format("MM/DD/YY");

    constructor(private router: Router, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.dateConfig = {
      format: "MM/DD/YY",
      disableKeypress: true,
      returnedValueType: ECalendarValue.String,
      max: moment(),
    };
  }

  ngOnInit() {
  }

  public preview(image) {
    if (image.length !== 0) {
      const reader = new FileReader();
      reader.readAsDataURL(image[0]);
      reader.onload = () => {
        this.imgURL = reader.result;
        this.base64 = reader.result.toString();
      }
    }
  }

  public swapCamera(cam) {
    cam.switchCamera = true;
  }

  public takePicture() {
    if (this.hideCam) {
      this.hideCam = false;
      this.webcamLabel = "Close Camera"
    } else {
      this.hideCam = true;
      this.webcamLabel = "Take Picture";
    }
  }

  public send_data(weight, length, species, date, tagId) {
    const validLength = this.checkLength(length, species);
    const validWeight = this.checkWeight(weight, species);
    const validID = this.checkTagID(tagId);
    if (tagId === '') {
      tagId = '-1';
    }
    date = this.getDate(date);
    if (validLength && validWeight && validID) {
      const values = {
        Weight: weight, Length: length,
        Species: species, Image: this.base64,
          Date: date, TagID: tagId
      };
      this.sendRequest(values);
      this.reload();
    }
  }

  private checkTagID(tagId) {
    if (!(tagId === '')) {
      if (parseFloat(tagId)) {
        tagId = parseFloat(tagId);
        if (tagId >= 0) {
          this.tagIdLabel = '';
        } else {
          this.tagIdLabel = 'TagID Negative';
          return false;
        }
      } else {
        this.tagIdLabel = 'Invalid TagID';
        return false;
      }
    }
    return true;
  }

  private getDate(date) {
    date = date.inputElementValue;
    if (date === undefined) {
      date = this.currentDate;
    }
    return date;
  }

  private checkLength(length, species) {
    if (length !== '') {
      if (!isNaN(length)) {
        var fish_length = parseFloat(length);
        if (fish_length > 0 && fish_length < Fishes.maxLengths[species]) {
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
        var fish_weight = parseFloat(weight);
        if (fish_weight > 0 && fish_weight < Fishes.maxWeights[species]) {
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
    this.http.post(link, values, httpOptions).subscribe();
  }

  private async reload() {
    this.subStyle = "btn btn-success";
    await this.wait(200);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/data']);
    });
  }

  private wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}



