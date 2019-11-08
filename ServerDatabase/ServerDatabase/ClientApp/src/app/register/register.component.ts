import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    random = ''
  constructor() { }

  ngOnInit() {
  }

  submitLogin(user: string) {
      this.random = user;
  }
}
