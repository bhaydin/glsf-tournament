import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit() {
      const link = this.baseUrl + 'api/fishes';
      var fishes_ext = this.http.get(link).subscribe();
      for (var fish in fishes_ext) {
          this.fishes.push({
              'Image' : ,
          })
      }
  }



}
