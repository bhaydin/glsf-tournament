import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ECalendarValue, DatePickerComponent } from 'ng2-date-picker';
import * as $ from 'jquery';
import * as tf from '../../assets/tfjs.js';
//import * as tf from '@tensorflow/tfjs';

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
  public dataURL: any;
  public file: any;
  public model: any;
    public modelLocation = "../assets/FishModel/FishClassifier/model.json";
    public IMAGENET_CLASSES = {
        0: 'Fish',
        1: 'Not a fish',
    };

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.dateConfig = {
      format: "MM/DD/YY",
      disableKeypress: true,
      returnedValueType: ECalendarValue.String,
      }
  }

    ngOnInit() {
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

  preview(image) {
    console.log(image);
    console.log("Starting file reader");

    if (image.length !== 0) {
      const reader = new FileReader();
      reader.readAsDataURL(image[0]);
        reader.onload = () => {
            this.dataURL = reader.result;
            this.imgURL = reader.result;
            this.base64 = reader.result.toString().split(",")[1];
        };

        console.log("Read file");
    } 
  }

    send_data(weight, length, species, date, tagId) {
        console.log("Sending data");
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
      let values = {
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

        console.log(values);
        this.predict(link, values, httpOptions);
      }
  }

    async predict(link, values, httpOptions) {
        console.log(values);
        console.log("Predicting");

        let image = $("#selected-image").get(0); //<HTMLImageElement> this.dataURL;
        console.log(image);

        var canvas = <HTMLCanvasElement> document.getElementById("canvas"),
            ctx = canvas.getContext("2d"),
            img = <HTMLImageElement> (new  Image()),
            w = canvas.width / 3;

        ctx.drawImage(<HTMLImageElement> image, 0, 0);
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

        if (prediction >= .5) {
            $("#prediction-list").append(`<li>Fish: ${prediction}</li>`);
            valid = true;
        } else {
            $("#prediction-list").append(`<li>Not Fish: ${prediction}</li>`);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Made predictions");

        console.log(values);
        values.Valid = valid;
        console.log(values);

        this.http.post(link, values, httpOptions).subscribe();
        console.log("Sent data to DB");
    }
}
