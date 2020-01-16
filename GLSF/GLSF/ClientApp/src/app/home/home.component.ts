import { Component, OnInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { Requests } from '../http/Requests';
import { MatDialog } from '@angular/material';
import { EditFishDialog } from './editFish';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../componentStyle.css']
})

export class HomeComponent implements OnInit {
  public static speciesFilter: String;
	public static valueFilter: String;

	constructor(private request: Requests, private dialog: MatDialog, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
		this.request.getFish();
		this.request.initialize();

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
				if (!editedFish.HasTag) {
					editedFish.SampleNumber = '';
				}
				this.request.update(editedFish, link).then(() => this.request.fishes[index] = editedFish);
      }
		});
	}

  private filter() {
    let species = HomeComponent.speciesFilter;
	  let value = HomeComponent.valueFilter;

    // Filter by species
	  if (species == undefined || species === "All Species") {
		  this.request.fishes = this.request.allFishes;
	  } else {
		  this.request.fishes = this.request.allFishes.filter(fish => fish.Species == species);
    }

    // Sort by fish properties
    if (value === "Length: High to Low") {
      this.request.fishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? -1 : 1);
    } else if (value === "Length: Low to High") {
      this.request.fishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? 1 : -1);
    } else if (value === "Weight: High to Low") {
      this.request.fishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? -1 : 1);
    } else if (value === "Weight: Low to High") {
      this.request.fishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? 1 : -1);
	  } else if (value === "Sample Number") {
		  this.request.fishes = this.request.allFishes.filter(fish => fish.SampleNumber != null );
      this.request.fishes.sort((fish1, fish2) => (fish1.SampleNumber > fish2.SampleNumber) ? 1 : -1);
    } else if (value === "Date Caught") {
      this.request.fishes.sort((fish1, fish2) => (new Date(fish1.Date) > new Date(fish2.Date)) ? -1 : 1);
    }
  }
}
