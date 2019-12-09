import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish } from '../models/dataSchemas';
import { Requests } from '../http/Requests';
import * as $ from 'jquery';

@Component({
  selector: 'app-unverifiedData',
  templateUrl: './unverifiedData.component.html',
  styleUrls: ['./unverifiedDataStyle.css']
})

export class UnverifiedDataComponent implements OnInit {
  private unfilteredFishes: Array<Fish> = [];
  private fishes: Array<Fish> = [];
  public static speciesFilter: String;
  public static valueFilter: String;
  private link = this.baseUrl + 'api/database/fish';

  constructor(private request: Requests, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
    this.getFish();
  }

	private getFish() {
		const link = this.baseUrl + 'api/database/fish';
		this.http.get<Fish[]>(link).subscribe(body =>
			this.analyzeBody(body)
    );
  }

  async filter(value) {
    this.fishes = [];
    this.unfilteredFishes.forEach(fish => this.filterOneFish(value, fish));
  }

  async validateFish(value) {
    var checkBox = document.getElementById("validateCheckBox" + value) as HTMLInputElement;

    if (checkBox.checked) {
      let validFish = this.fishes[value];
      this.fishes.splice(value, 1);
      validFish.isValid = true;

      let validFishIndex = this.unfilteredFishes.indexOf(validFish);
      this.unfilteredFishes.splice(validFishIndex, 1);

      this.http.get<Fish[]>(this.link).subscribe(body =>
        this.removeFish(body, validFish)
      );
    }
  }

  private removeFish(body, fish) {
    body.forEach((entity) => {
      if (entity.Id == fish.Id) {
        entity.isValid = true;
        fish.isValid = true;
        this.request.updateFish(fish, this.link);
      }
    })
  }

  async filterOneFish(value, fish) {
    if (value == fish.TournamentId) {
      this.fishes.push(fish);
    }
  }

  private async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async analyzeBody(body) {
    body.forEach((entity) => {
      if (!entity.isValid) {
        if (entity.Image == '') {
          entity.Image = Fish.defaultImage;
        }
        if (entity.SampleNumber === null) {
          entity.SampleNumber = 'N/A'
        }
        this.fishes.push(entity);
        this.unfilteredFishes.push(entity);
      }
    })

    if (this.request.tournaments[0] != undefined) {
      this.filter(this.request.tournaments[0].Id);
    }
  }
}
