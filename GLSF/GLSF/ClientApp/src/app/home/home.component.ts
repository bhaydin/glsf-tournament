import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish } from '../fishModel/fish.model';
import { ImageDefault } from '../fishModel/Image';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./style.css']
})

export class HomeComponent implements OnInit {
	public fishes: Array<Fish> = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
	  this.getFish();
	}

	private getFish() {
		const link = this.baseUrl + 'api/fishes';
		this.http.get<Fish[]>(link).subscribe(body =>
			this.analyzeBody(body)
		);

	}

	private analyzeBody(body) {
		body.forEach((entity) => {
			if (entity.Image == null) {
				entity.Image = ImageDefault.image;
			}
			if (entity.SampleNumber === null) {
				entity.SampleNumber = 'N/A'
			}
			this.fishes.push(entity);
		})
	}
}
