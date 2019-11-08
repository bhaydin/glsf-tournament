import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish } from '../models/dataSchemas';

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
