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
  private unfilteredFishes: Array<Fish> = [];
  private fishes: Array<Fish> = [];
  public static speciesFilter: String;
  public static valueFilter: String;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
    this.getFish();

    $("#speciesDropDown li a").click(function () {
      HomeComponent.speciesFilter = $(this).text();
      $("#speciesButton").html($(this).text());
    });

    $("#speciesDropDown li a").on('click', (e) => {
      this.filter();
    });

    $("#filterDropDown a").click(function () {
      HomeComponent.valueFilter = $(this).text();
      $("#filterButton").html($(this).text());
    });

    $("#filterDropDown a").on('click', (e) => {
      this.filter();
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
			if (entity.Image == '') {
				entity.Image = Fish.defaultImage;
			}
			if (entity.SampleNumber === null) {
				entity.SampleNumber = 'N/A'
			}
      this.fishes.push(entity);
      this.unfilteredFishes.push(entity);
		})
  }

  private filter() {
    let species = HomeComponent.speciesFilter;
    let value = HomeComponent.valueFilter;
    this.fishes = [];

    // Filter by species
    if (species == undefined || species === "All Species") {
      this.unfilteredFishes.forEach((fish: Fish) => {
        this.fishes.push(fish);
      })
    } else {
      this.unfilteredFishes.forEach((fish: Fish) => {
        if (fish.Species === species) {
          this.fishes.push(fish);
        }
      })
    }

    // Sort by fish properties
    if (value === "Length: High to Low") {
      this.fishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? -1 : 1);
    } else if (value === "Length: Low to High") {
      this.fishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? 1 : -1);
    } else if (value === "Weight: High to Low") {
      this.fishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? -1 : 1);
    } else if (value === "Weight: Low to High") {
      this.fishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? 1 : -1);
    } else if (value === "Sample Number") {
      this.fishes = this.fishes.filter(this.checkSampleNumber);
      this.fishes.sort((fish1, fish2) => (fish1.SampleNumber > fish2.SampleNumber) ? 1 : -1);
    } else if (value === "Date Caught") {
      this.fishes.sort((fish1, fish2) => (new Date(fish1.Date) > new Date(fish2.Date)) ? -1 : 1);
    }
  }

  private checkSampleNumber(fish: Fish) {
    return fish.SampleNumber !== "N/A";
  }
}
