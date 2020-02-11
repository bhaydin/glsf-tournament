import { Component, OnInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { Requests } from '../http/Requests';
import { MatDialog } from '@angular/material';
import { EditFishDialog } from './editFish';
import { Fish } from '../models/dataSchemas';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../componentStyle.css']
})

export class HomeComponent implements OnInit {
  public static speciesFilter: String;
	public static valueFilter: String;
	public filteredFishes: Array<Fish> = [];

	constructor(private request: Requests, private dialog: MatDialog, @Inject('BASE_URL') private baseUrl: string) {
		this.setUpHomeRequest();
	}

	ngOnInit() {

    $("#speciesDropDown li a").click(function () {
      HomeComponent.speciesFilter = $(this).text();
      $("#speciesButton").html($(this).text());
	  });

    $("#speciesDropDown li a").on('click', () => {
      this.filter();
    });

    $("#filterDropDown a").click(function () {
      HomeComponent.valueFilter = $(this).text();
      $("#filterButton").html($(this).text());
    });

    $("#filterDropDown a").on('click', () => {
      this.filter();
    });
  }

	async setUpHomeRequest() {
		await this.request.initialize();
		await this.request.getFish(this.request.tournaments[0].Id);
		this.filteredFishes = this.request.fishes;
	}

	saveAsCSV() {
		let text = 'Species, Weight, Length, Date, HasTag, SampleNumber, Port, StationNumber \n';
		this.filteredFishes.forEach(fish => {
			const fishString = fish.Species + ", " + fish.Weight + ", " + fish.Length + ", " + fish.Date + ", " + fish.HasTag + ", " + fish.SampleNumber + ", " + fish.Port + ", " + fish.StationNumber +" \n";
			text += fishString;
		});
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', 'fishes.csv');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}


	editRow(index) {
		const dialogRef = this.dialog.open(EditFishDialog, {
			panelClass: 'custom-dialog-container',
			data: Object.assign({}, this.request.fishes[index]),
		});
		dialogRef.afterClosed().subscribe(editedFish => {
			if (editedFish != undefined) {
				const link = this.baseUrl + 'api/database/fish';
				editedFish.Length = parseFloat(editedFish.Length);
				editedFish.Weight = parseFloat(editedFish.Weight);
				this.request.update(editedFish, link).then(() => this.request.fishes[index] = editedFish);
      }
		});
	}

  private filter() {
    let species = HomeComponent.speciesFilter;
	  let value = HomeComponent.valueFilter;

    // Filter by species
	  if (species == undefined || species === "All Species") {
		  this.filteredFishes = this.request.fishes;
	  } else {
		  this.filteredFishes = this.request.fishes.filter(fish => fish.Species == species);
    }

    // Sort by fish properties
    if (value === "Length: High to Low") {
		  this.filteredFishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? -1 : 1);
    } else if (value === "Length: Low to High") {
		  this.filteredFishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? 1 : -1);
    } else if (value === "Weight: High to Low") {
		  this.filteredFishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? -1 : 1);
    } else if (value === "Weight: Low to High") {
		  this.filteredFishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? 1 : -1);
	  } else if (value === "Sample Number") {
		  this.filteredFishes = this.request.fishes.filter(fish => fish.SampleNumber != null );
		  this.filteredFishes.sort((fish1, fish2) => (fish1.SampleNumber > fish2.SampleNumber) ? 1 : -1);
    } else if (value === "Date Caught") {
		  this.filteredFishes.sort((fish1, fish2) => (new Date(fish1.Date) > new Date(fish2.Date)) ? -1 : 1);
    }
  }
}
