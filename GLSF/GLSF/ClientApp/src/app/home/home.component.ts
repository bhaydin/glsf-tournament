import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish, Tournament } from '../models/dataSchemas';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./homeStyle.css']
})

export class HomeComponent implements OnInit {
  private unfilteredFishes: Array<Fish> = [];
  private fishes: Array<Fish> = [];
  private tournaments: Array<Tournament> = [];
  public static speciesFilter: String;
  public static valueFilter: String;
  public static tournamentFilter: String;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit() {
    this.getFish();
    this.getTournaments();

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

  public newTournamentFilter(filter) {
    $("#tournamentFilter").html(filter);
    HomeComponent.tournamentFilter = filter;
    this.filter();
  }

  private getTournaments() {
    const link = this.baseUrl + 'api/database/tournament';
    this.http.get<Tournament[]>(link).subscribe(body =>
      this.analyzeTournamentBody(body)
    );
  }

  private analyzeTournamentBody(body) {
    body.forEach((entity) => {
      this.tournaments.push(entity);
    });
    this.getDefaultTournament();
  }

  private getDefaultTournament() {
    console.log(this.tournaments);
    let foundId = 0;
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    for (let i = 0; i < this.tournaments.length; i++) {
      let t = this.tournaments[i];
      var start = this.stringToDate(t.StartDate);
      var end = this.stringToDate(t.EndDate);

      if (today >= start && end >= today) {
        foundId = i;
        break;
      }
    }

    HomeComponent.tournamentFilter = this.tournaments[foundId].Name;
    $("#tournamentFilter").html(this.tournaments[foundId].Name);
    this.filter();
  }

  private stringToDate(dateStr) {
    var parts = dateStr.split('/');
    //console.log(parts);
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    var mydate = new Date(parts[2], parts[0] - 1, parts[1]);
    return mydate;
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
    this.fishes = [];
    this.speciesFilter();
    this.tournamentFilter();
    this.fishPropFilter();
  }

  private speciesFilter() {
    let species = HomeComponent.speciesFilter;

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
  }

  private fishPropFilter() {
    let value = HomeComponent.valueFilter;

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

  private tournamentFilter() {
    let tournamentFilter = HomeComponent.tournamentFilter;
    console.log(tournamentFilter);
    let id = 0;

    for (let i = 0; i < this.tournaments.length; i++) {
      if (this.tournaments[i].Name === tournamentFilter) {
        id = this.tournaments[i].Id;
        break;
      }
    }

    for (let i = this.fishes.length - 1; i >= 0; i--) {
      let fish = this.fishes[i];

      if (fish.TournamentId != id) {
        this.fishes.splice(i, 1);
      }
    }
  }

  private checkSampleNumber(fish: Fish) {
    return fish.SampleNumber !== "N/A";
  }
}
