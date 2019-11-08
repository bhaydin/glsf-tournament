import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish } from '../models/dataSchemas';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./homeStyle.css']
})

export class HomeComponent implements OnInit {
	fishes: Array<Fish> = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
    this.getFish();

    $("#speciesDropDown li a").click(function () {
      console.log($(this).text());
      $("#speciesButton").html($(this).text());
    });

    $("#filterDropDown a").click(function () {
      console.log($(this).text());
      $("#filterButton").html($(this).text());
    });
	}

	private getFish() {
		const link = this.baseUrl + 'api/database/fish';
		this.http.get<Fish[]>(link).subscribe(body =>
			this.analyzeBody(body)
		);
	}

	private analyzeBody(body) {
		body.forEach((entity) => {
			if (entity.Image == null) {
				entity.Image = Fish.defaultImage;
			}
			if (entity.SampleNumber === null) {
				entity.SampleNumber = 'N/A'
			}
			this.fishes.push(entity);
		})
	}
}
