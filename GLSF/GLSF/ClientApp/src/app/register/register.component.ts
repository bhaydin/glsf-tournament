import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {
	  registerForm: FormGroup;
	  registerLabel = "";
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
	get form() { return this.registerForm.controls; }

  //Activates when the user presses register. Prevents another registration of the user two times by disabling the button
  //Then the user service registers the value, if successful takes the user to the log in page
  async onSubmit() {
	  try {
		  this.registerLabel = "";
		  this.submitted = true;
		  this.loading = true;
		  // stop here if form is invalid
		  if (!this.registerForm.invalid) {
			  await this.userService.registerUser(this.registerForm.value).then(() => {
				  this.router.navigate(['/login']);
			  });
		  }
		  this.loading = false;
		  this.submitted = false;
	  } catch (e) {
		  this.registerLabel = e;
		  this.loading = false;
		  this.submitted = false;
	  }
  }
}
