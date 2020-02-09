import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish, Tournament, Boat } from '../models/dataSchemas';
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
  private unfilteredBoats: Array<Boat> = [];
  private boats: Array<Boat> = [];

  public static speciesFilter: String;
  public static valueFilter: String;
  public static tournamentFilter: String;
  public static boatFilter: String;
  public static validFishFilter: String;

  private species = false;
  private weight = false;
  private length = false;
  private number = false;
  private date = false;
  private valid = false;
  private lastCaretClass = "";
  private lastSort = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit() {
    this.getFish();

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

    $("#validFishDropDown a").click(function () {
      HomeComponent.validFishFilter = $(this).text();
      $("#validFishButton").html($(this).text());
    });

    $("#validFishDropDown a").on('click', () => {
      this.filter();
    });
  }

  public newTournamentFilter(filter) {
    $("#tournamentFilter").html(filter);
    HomeComponent.tournamentFilter = filter;
    this.getTournamentBoats();
    this.filter();
  }

  private getTournamentBoats() {
    this.boats = [];
    let tid = -1;
    let filter = HomeComponent.tournamentFilter;

    for (let i = 0; i < this.tournaments.length; i++) {
      let t = this.tournaments[i];
      
      if (t.Name == filter) {
        tid = t.Id;
      }
    }

    for (let j = 0; j < this.unfilteredBoats.length; j++) {
      let boat = this.unfilteredBoats[j];

      if (boat.TournamentId == tid) {
        this.boats.push(boat);
      }
    }

    HomeComponent.boatFilter = "All Boats";
    $("#boatFilter").html("All Boats");
  }

  public newBoatFilter(filter) {
    $("#boatFilter").html(filter);
    HomeComponent.boatFilter = filter;
    this.filter();
  }

  private getTournaments() {
    const link = this.baseUrl + 'api/database/tournament';
    this.http.get<Tournament[]>(link).subscribe(body =>
      this.analyzeTournamentBody(body)
    );
  }

  private getBoats() {
    const link = this.baseUrl + 'api/database/boat';
    this.http.get<Tournament[]>(link).subscribe(body =>
      this.analyzeBoatBody(body)
    );
  }

  private analyzeBoatBody(body) {
    body.forEach((entity) => {
      this.unfilteredBoats.push(entity);
    });

    this.getTournamentBoats();
    this.filter();
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
    this.getBoats();
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
    });

    this.getTournaments();
  }

  private filter() {
    this.fishes = [];
    this.speciesFilter();
    this.filterByTournaments();
    this.boatFilter();

    this.sortBy(this.lastSort);
    this.sortBy(this.lastSort);
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

  public sortBy(value) {
    if (this.lastCaretClass !== "") {
      document.getElementById(this.lastCaretClass).style.visibility = "hidden";
    }

    this.lastSort = value;
    let sort = 0;
    let caretClass = "";

    if (value === "Species") {
      this.species = !this.species;
      sort = this.species ? -1 : 1;
      caretClass = "speciesCaret";

      this.fishes.sort(function (fish1, fish2) {
        var f1 = fish1.Species.toUpperCase();
        var f2 = fish2.Species.toUpperCase();

        return (f1 < f2) ? sort : -sort;
      });
    } else if (value === "Length") {
      this.length = !this.length;
      sort = this.length ? -1 : 1;
      caretClass = "lengthCaret";

      this.fishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? sort : -sort);
    } else if (value === "Weight") {
      this.weight = !this.weight;
      sort = this.weight ? -1 : 1;
      caretClass = "weightCaret";

      this.fishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? sort : -sort);
    } else if (value === "Valid") {
      this.valid = !this.valid;
      sort = this.valid ? -1 : 1;
      caretClass = "validCaret";

      this.fishes.sort((fish1) => (fish1.isValid) ? sort : -sort);
    } else if (value === "Number") {
      this.number = !this.number;
      sort = this.number ? -1 : 1;
      caretClass = "numberCaret";

      let fishWithNumbers = this.fishes.filter(this.checkSampleNumber);
      let fishWithoutNumbers = this.fishes.filter(this.checkSampleNumberNa);

      fishWithNumbers.sort(function (fish1, fish2) {
          return fish1.SampleNumber > fish2.SampleNumber ? sort : -sort;
      });

      if (sort == -1) {
        this.fishes = fishWithNumbers.concat(fishWithoutNumbers);
      } else {
        this.fishes = fishWithoutNumbers.concat(fishWithNumbers);
      }
    } else if (value === "Date") {
      this.date = !this.date;
      sort = this.date ? -1 : 1;
      caretClass = "dateCaret";

      this.fishes.sort((fish1, fish2) => (new Date(fish1.Date) > new Date(fish2.Date)) ? sort : -sort);
    }

    if (sort == 1) {
      document.getElementById(caretClass).style.visibility = "visible";
      document.getElementById(caretClass).className = "fa fa-caret-down";
    } else if (sort == -1) {
      document.getElementById(caretClass).style.visibility = "visible";
      document.getElementById(caretClass).className = "fa fa-caret-up";
    }

    this.lastCaretClass = caretClass;
  }

  private filterByTournaments() {
    let tournamentFilter = HomeComponent.tournamentFilter;
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

  private boatFilter() {
    let filter = HomeComponent.boatFilter;

    if (filter != undefined && filter != "All Boats") {
      let id = 0;

      for (let i = 0; i < this.unfilteredBoats.length; i++) {
        if (this.unfilteredBoats[i].Name == filter) {
          id = this.unfilteredBoats[i].Id;
          break;
        }
      }

      for (let i = this.fishes.length - 1; i >= 0; i--) {
        let fish = this.fishes[i];

        if (fish.BoatId != id) {
          this.fishes.splice(i, 1);
        }
      }
    }
  }

  public resetFilters() {
    HomeComponent.speciesFilter = "All Species";
    $("#speciesButton").html("All Species");

    HomeComponent.valueFilter = "None";
    $("#filterButton").html("None");

    HomeComponent.validFishFilter = "Both";
    $("#validFishButton").html("Both");

    HomeComponent.boatFilter = "All Boats";
    $("#boatFilter").html("All Boats");

    this.getDefaultTournament();
    this.filter();
  }

  private checkSampleNumber(fish: Fish) {
    return fish.SampleNumber !== "N/A";
  }

  private checkSampleNumberNa(fish: Fish) {
    return fish.SampleNumber === "N/A";
  }
}
