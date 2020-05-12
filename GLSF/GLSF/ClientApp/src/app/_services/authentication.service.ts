import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/dataSchemas'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

	  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

  //Access level 0 is default and is guest.
  //Logs in user and sets them in a cookie for seven days so that the user doesn't need to relogin to the website
  //Each time they refresh
	async login(username, password) {
		const link = this.baseUrl + 'api/database/user/authenticate';
		let ReturningUser: User = { Username: username, Password: password, FirstName: '', LastName: '', Token: '', Id: null, AccessLevel: 0, Email: '', PhoneNumber: '' };
		return await this.http.post<any>(link, ReturningUser).toPromise().then(user => {
			ReturningUser.AccessLevel = user.accessLevel;
			ReturningUser.Token = user.token;
			ReturningUser.FirstName = user.firstName;
			ReturningUser.LastName = user.lastName;
			ReturningUser.Id = user.id;
			ReturningUser.PhoneNumber = user.phonenumber;
			ReturningUser.Email = user.email;
			localStorage.setItem('currentUser', JSON.stringify(ReturningUser));
			this.currentUserSubject.next(ReturningUser);
		});
  }
    //Logs out user
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
