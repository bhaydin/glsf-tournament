import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    random = ''
  constructor() { }

  ngOnInit() {
  }

  submitLogin(user: string) {
      this.random = user;
  }
}
