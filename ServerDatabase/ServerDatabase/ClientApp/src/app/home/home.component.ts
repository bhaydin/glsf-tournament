import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fish } from '../fish/fish.model';
import { ImageDefault } from '../fish/Image';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./style.css']
})

export class HomeComponent implements OnInit {
	public fishes: Array<Fish> = [];
	private queryStart: number = 0;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	ngOnInit() {
	  this.getFish();
	}

	@HostListener('window:scroll', [])
	onScroll() {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			this.getFish();
		}
	};

	private getFish() {
		const link = this.baseUrl + 'api/fishes/' + this.queryStart;
		this.http.get<Fish[]>(link).subscribe(body =>
			this.analyzeBody(body)
		);
		this.queryStart += 100;
	}

	private analyzeBody(body) {
		body.forEach((entity) => {
			if (entity.Image == '') {
				entity.Image = ImageDefault.image;
			}
			if (entity.TagID === -1) {
				entity.TagID = 'N/A'
			}
			this.fishes.push(entity);
		})
	}
}
