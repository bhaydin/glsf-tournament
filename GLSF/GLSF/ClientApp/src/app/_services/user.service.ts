import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/dataSchemas';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

   //Gets all users in database
	async getAllUsers() {
		return await this.http.get<User[]>(this.baseUrl + 'api/database/user').toPromise();
  }

  //Registers new user to database
	async registerUser(user: User) {
		return await this.http.post<any>(this.baseUrl + 'api/database/user/register', user).toPromise();
  }

  //Deletes user by ID
	async deleteById(id) {
	  return await this.http.delete(this.baseUrl + 'api/database/user/' + id).toPromise();
	}

  //Gets user by ID
	async getById(id) {
		return await this.http.delete(this.baseUrl + 'api/database/user/' + id).toPromise();
	}
}
