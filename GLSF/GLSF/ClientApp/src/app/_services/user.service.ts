import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/dataSchemas';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

   
	async getAllUsers() {
		return await this.http.get<User[]>(this.baseUrl + 'api/database/user').toPromise();
  }

	async registerUser(user: User) {
		return await this.http.post<any>(this.baseUrl + 'api/database/user/register', user).toPromise();
  }

	async deleteById(id) {
	  return await this.http.delete(this.baseUrl + 'api/database/user/' + id).toPromise();
	}

	async getById(id) {
		return await this.http.delete(this.baseUrl + 'api/database/user/' + id).toPromise();
	}
}
