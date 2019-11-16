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

    console.log(species);
    console.log(value);
    this.fishes = [];

    if (!(species == undefined || species === "All Species")) {
      if (value == undefined || value === "None") {
        this.unfilteredFishes.forEach((fish: Fish) => {
          if (fish.Species === species) {
            this.fishes.push(fish);
          }
        })
      } else if (value === "Length: High to Low") {
        this.filterByLengthHighLow(species);
      } else if (value === "Length: Low to High") {
        this.filterByLengthLowHigh(species);
      } else if (value === "Weight: High to Low") {
        this.filterByWeightHighLow(species);
      } else if (value === "Weight: Low to High") {
        this.filterByWeightLowHigh(species);
      } else if (value === "Sample Number") {
        this.filterBySampleNum(species);
      } else if (value === "Date Caught") {
        this.filterByDateCaught(species);
      }
    } else {
      if (value == undefined || value === "None") {
        this.unfilteredFishes.forEach((fish: Fish) => {
          this.fishes.push(fish);
        })
      } else if (value === "Length: High to Low") {
        this.filterByLengthHighLow("All Species");
      } else if (value === "Length: Low to High") {
        this.filterByLengthLowHigh("All Species");
      } else if (value === "Weight: High to Low") {
        this.filterByWeightHighLow("All Species");
      } else if (value === "Weight: Low to High") {
        this.filterByWeightLowHigh("All Species");
      } else if (value === "Sample Number") {
        this.filterBySampleNum("All Species");
      } else if (value === "Date Caught") {
        this.filterByDateCaught("All Species");
      }
    }
  }

  private filterByWeightLowHigh(species: String) {

  }

  private filterByWeightHighLow(species: String) {

  }

  private filterByLengthLowHigh(species: String) {

  }

  private filterByLengthHighLow(species: String) {

  }

  private filterBySampleNum(species: String) {

  }

  private filterByDateCaught(species: String) {

  }
}
