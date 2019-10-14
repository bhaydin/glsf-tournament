import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ECalendarValue, DatePickerComponent } from 'ng2-date-picker';

class MyContainer {
  @ViewChild('date') datePicker: DatePickerComponent;
  open() { this.datePicker.api.open(); }
  close() { this.datePicker.api.close(); }
}

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
  public base64: string;
  public dateConfig: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.dateConfig = {
      format: "MM/DD/YY",
      disableKeypress: true,
      returnedValueType: ECalendarValue.String,
      }
  }

  ngOnInit() {
  }

  preview(image) {
    if (image.length !== 0) {
      const reader = new FileReader();
      reader.readAsDataURL(image[0]);
      reader.onload = () => {
        this.imgURL = reader.result;
        this.base64 = reader.result.toString().split(",")[1];
      };
    }
  }

  send_data(weight, length, species, date, tagId) {
    let validLength = false;
    let validWeight = false;
    if (weight !== '') {
      if (parseFloat(weight)) {
        this.weightLabel = '';
        validWeight = true;
      } else {
        this.weightLabel = 'Invalid Weight';
      }
    } else {
      this.weightLabel = 'No Weight Entry';
    }

    if (length !== '') {
      if (parseFloat(length)) {
        this.lengthLabel = '';
        validLength = true;
      } else {
        this.lengthLabel = 'Invalid Length';
      }
    } else {
      this.lengthLabel = 'No Length Entry';
    }

    if (parseFloat(tagId)) {
      this.tagIdLabel = '';
      validLength = true;
    }  else {
    this.tagIdLabel = 'Invalid TagID';
    }
    if (validLength && validWeight) {
      const values = {
        Weight: weight, Length: length,
        Species: species, Image: this.base64,
        Date: date.inputElementValue, TagID: tagId
      };
      const link = this.baseUrl + 'api/fishes';
      console.log(values);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      this.http.post(link, values, httpOptions).subscribe();
    }
  }
}



