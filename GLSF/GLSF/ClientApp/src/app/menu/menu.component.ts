import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../models/dataSchemas';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	currentUser: User;

	constructor(private router: Router, private authenticationService: AuthenticationService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
	ngOnInit() {}

  //When the user logs out, moves them to the log in page, and removes their user from the current user cookie
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
	}
}
