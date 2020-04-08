import { Component, Inject, OnInit } from '@angular/core';
import { Fish, User } from '../models/dataSchemas';
import * as $ from 'jquery';
import { Requests } from '../http/Requests';
import { MatDialog } from '@angular/material';
import { EditFishDialog } from './editFish';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../componentStyle.css', '/homeStyle.css']
})

export class HomeComponent implements OnInit {
  public filteredFishes: Array<Fish> = [];
	public tournID = 0;
	fishes = Fish.fishes;
	currentUser: User;
  public static speciesFilter: String;
	public static valueFilter: String;
  public static tournamentFilter: String;
  public static boatFilter: String;
  public static validFishFilter: String;

	imperialMode = true;
	unitText = "View Metric";
	weightLabel = "Weight (Lb)";
	lengthLabel = "Length (In)";
	storedLengths = [];
	storedWeights = [];
  private species = false;
  private weight = false;
  private length = false;
  private number = false;
  private date = false;
  private valid = false;
  private port = false;
  private clipStatus = false;
  private finsClipped = false;
  private lastCaretClass = "";
  private lastSort = "";

	constructor(private request: Requests, private dialog: MatDialog, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
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

    for (let i = 0; i < this.request.tournaments.length; i++) {
      let t = this.request.tournaments[i];

      if (t.Name == filter) {
        this.tournID = t.Id;
        break;
      }
    }

    this.getTournamentBoats();
    this.filter();
  }

  private getTournamentBoats() {
    this.request.getBoats(this.tournID);
    this.request.getFish(this.tournID);

    HomeComponent.boatFilter = "All Boats";
    $("#boatFilter").html("All Boats");
  }

  public newBoatFilter(filter) {
    $("#boatFilter").html(filter);
    HomeComponent.boatFilter = filter;
    this.filter();
  }

  private getDefaultTournament() {
    let foundId = 0;
    var today = new Date();

    for (let i = 0; i < this.request.tournaments.length; i++) {
      let t = this.request.tournaments[i];
      var start = this.stringToDate(t.StartDate);
      var end = this.stringToDate(t.EndDate);

      if (today >= start && end >= today) {
        foundId = i;
        break;
      }
    }

    HomeComponent.tournamentFilter = this.request.tournaments[foundId].Name;
    $("#tournamentFilter").html(this.request.tournaments[foundId].Name);
    this.tournID = this.request.tournaments[foundId].Id;
    this.getTournamentBoats();

    return this.request.tournaments[foundId].Id;
  }

  private stringToDate(dateStr) {
    var parts = dateStr.split('/');
    //console.log(parts);
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    var mydate = new Date(parts[2], parts[0] - 1, parts[1]);
    return mydate;
  }

  async setUpHomeRequest() {
    await this.request.initialize();
    await this.getDefaultTournament();
    await this.filter();
	}

	saveAsCSV(unitLength, unitWeight, imperial) {
		let i = 0;
		let unitMultiplierWeight = 1;
		let unitMultiplierLength = 1;
		if (!imperial){
			unitMultiplierWeight = 0.45359237;
		  unitMultiplierLength = 2.54;
		}
		let text = 'Species, Weight(' + unitWeight +'), Length ('+ unitLength +'), Date, Has Tag, Sample Number, Port, Station Number, Fins Clipped \n';
		this.filteredFishes.forEach(fish => {
			const fishString = fish.Species + ", " + unitMultiplierWeight * this.storedWeights[i] + ", " + unitMultiplierLength * this.storedLengths[i++] + ", " + fish.Date + ", " + fish.HasTag + ", " + fish.SampleNumber + ", " + fish.Port + ", " + fish.StationNumber + ", " + fish.FinsClipped + " \n";
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

	changeUnits() {
		if (this.imperialMode) {  
			this.unitText = "View Imperial";
			this.lengthLabel = "Length (Cm)";
			this.weightLabel = "Weight (Kg)";
			let i = 0;
			this.filteredFishes.forEach(fish => {
				this.storedWeights[i] = fish.Weight;
				this.storedLengths[i++] = fish.Length;
				fish.Weight *= 0.45359237;
				fish.Length *= 2.54;
			});
			this.imperialMode = false;
		} else {
			this.unitText = "View Metric";
			this.weightLabel = "Weight (Lb)";
			this.lengthLabel = "Length (In)";
			let i = 0;
			this.filteredFishes.forEach(fish => {
				fish.Weight = this.storedWeights[i];
				fish.Length = this.storedLengths[i++];
			});
			this.imperialMode = true;
		}
	}

	editRow(index) {
		const dialogRef = this.dialog.open(EditFishDialog, {
      panelClass: 'custom-dialog-container',
      data: Object.assign({}, this.filteredFishes[index]),
		});
		dialogRef.afterClosed().subscribe(editedFish => {
      if (editedFish != undefined) {
        const link = this.baseUrl + 'api/database/fish';
        editedFish.Length = parseFloat(editedFish.Length);
        editedFish.Weight = parseFloat(editedFish.Weight);
        this.request.update(editedFish, link).then(() => {
          this.filteredFishes[index] = editedFish;
			    for (let i = 0; i < this.request.fishes.length; i++) {
			      if (this.request.fishes[i].Id == editedFish.Id) {
					    this.request.fishes[i] = editedFish;
					    break;
            }
          }
        });
      }
		});
	}

  private async filter() {
	  this.filteredFishes = [];
	  this.storedWeights = [];
	  this.storedLengths = [];
    await this.request.getFish(this.tournID);
    await this.speciesFilter();
	  await this.boatFilter();
	  let i = 0;
	  this.filteredFishes.forEach(fish => {
		  this.storedWeights[i] = fish.Weight;
		  this.storedLengths[i++] = fish.Length;
		  if (!this.imperialMode) {
			  fish.Weight *= 0.45359237;
			  fish.Length *= 2.54;
		  }
	  });

    await this.sortBy(this.lastSort);
	  await this.sortBy(this.lastSort);
  }

  private speciesFilter() {
    let species = HomeComponent.speciesFilter;
    
    if (species == undefined || species === "All Species") {
      this.request.fishes.forEach((fish: Fish) => {
        this.filteredFishes.push(fish);
      })
    } else {
      this.request.fishes.forEach((fish: Fish) => {
        if (fish.Species === species) {
          this.filteredFishes.push(fish);
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

      this.filteredFishes.sort(function (fish1, fish2) {
        var f1 = fish1.Species.toUpperCase();
        var f2 = fish2.Species.toUpperCase();

        return (f1 < f2) ? sort : -sort;
      });
    } else if (value === "Length") {
      this.length = !this.length;
      sort = this.length ? -1 : 1;
      caretClass = "lengthCaret";

      this.filteredFishes.sort((fish1, fish2) => (fish1.Length > fish2.Length) ? sort : -sort);
    } else if (value === "Weight") {
      this.weight = !this.weight;
      sort = this.weight ? -1 : 1;
      caretClass = "weightCaret";

      this.filteredFishes.sort((fish1, fish2) => (fish1.Weight > fish2.Weight) ? sort : -sort);
    } else if (value === "Valid") {
      this.valid = !this.valid;
      sort = this.valid ? -1 : 1;
      caretClass = "validCaret";

      this.filteredFishes.sort((fish1) => (fish1.IsValid) ? sort : -sort);
    } else if (value === "Number") {
      this.number = !this.number;
      sort = this.number ? -1 : 1;
      caretClass = "numberCaret";

      let fishWithNumbers = this.filteredFishes.filter(this.checkSampleNumber);
      let fishWithoutNumbers = this.filteredFishes.filter(this.checkSampleNumberNa);

      fishWithNumbers.sort(function (fish1, fish2) {
        return fish1.SampleNumber > fish2.SampleNumber ? -sort : sort;
      });

      if (sort == -1) {
        this.filteredFishes = fishWithNumbers.concat(fishWithoutNumbers);
      } else {
        this.filteredFishes = fishWithoutNumbers.concat(fishWithNumbers);
      }
    } else if (value === "Date") {
      this.date = !this.date;
      sort = this.date ? -1 : 1;
      caretClass = "dateCaret";

      this.filteredFishes.sort((fish1, fish2) => (new Date(fish1.Date) > new Date(fish2.Date)) ? sort : -sort);
    } else if (value === "Port") {
      this.port = !this.port;
      sort = this.port ? -1 : 1;
      caretClass = "portCaret";

      this.filteredFishes.sort(function (fish1, fish2) {
        var f1 = fish1.Port.toUpperCase();
        var f2 = fish2.Port.toUpperCase();

        return (f1 < f2) ? sort : -sort;
      });
    } else if (value === "ClipStatus") {
      this.clipStatus = !this.clipStatus;
      sort = this.clipStatus ? -1 : 1;
      caretClass = "clipStatusCaret";

		  this.filteredFishes.sort(function (fish1, fish2) {
			  var f1 = fish1.NoClips;
			  var f2 = fish2.NoClips;

        return (f1 < f2) ? sort : -sort;
      });
    } else if (value === "Fins") {
      this.finsClipped = !this.finsClipped;
      sort = this.finsClipped ? -1 : 1;
      caretClass = "finsCaret";

      this.filteredFishes.sort(function (fish1, fish2) {
        var f1 = fish1.FinsClipped.toUpperCase();
        var f2 = fish2.FinsClipped.toUpperCase();

        return (f1 < f2) ? sort : -sort;
      });
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

  private boatFilter() {
    let filter = HomeComponent.boatFilter;

    if (filter != undefined && filter != "All Boats") {
      let id = 0;

      for (let i = 0; i < this.request.boats.length; i++) {
        if (this.request.boats[i].Name == filter) {
          id = this.request.boats[i].Id;
          break;
        }
      }

      for (let i = this.filteredFishes.length - 1; i >= 0; i--) {
        let fish = this.filteredFishes[i];

        if (fish.BoatId != id) {
          this.filteredFishes.splice(i, 1);
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
    return !(fish.SampleNumber === "N/A" || fish.SampleNumber === "" || fish.SampleNumber === "Unspecified");
  }

  private checkSampleNumberNa(fish: Fish) {
    return fish.SampleNumber === "N/A" || fish.SampleNumber === "" || fish.SampleNumber === "Unspecified";
  }
}
