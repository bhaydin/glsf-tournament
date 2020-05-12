import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../_services/authentication.service'

@Component({
  selector: 'app-tournaments',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	loginLabel = "";
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get form() { return this.loginForm.controls; }

  //Logs in user with entered information
  //Prevents a double log in by disabling button after pressed, enables button after failure or success
  //If success moves user to the home page with fish information
	async onSubmit() {
		try {
			this.loginLabel = "";
		  this.submitted = true;
		  this.loading = true;
		  if (!this.loginForm.invalid) {
			  await this.authenticationService.login(this.form.username.value, this.form.password.value).then(() => {
				  this.router.navigate([this.returnUrl]);
			  });
		  }
		  this.loading = false;
		  this.submitted = false;
		} catch (e) {
			this.loginLabel = e;
		  this.loading = false;
		  this.submitted = false;
	  }
  }
}
