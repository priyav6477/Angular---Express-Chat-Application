import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient){

  }
  API_PATH = 'http://localhost:3000';

  registerUser(formData: any):Observable<any>{
    return this.http.post<any>(`${this.API_PATH}/register`, formData);
  }
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_PATH}/pendingRegistrations`);
  }
  friendRequest(data:any){
    return this.http.post<any>(`${this.API_PATH}/friend-request`, data);
  }
  //to get list of users in friend list ie for add friend tab
  getAllUsers(userId: string): Observable<any> {
    return this.http.get<any>(`${this.API_PATH}/getAllUsers/${userId}`);
  }
//update profile
updatreProfile(userId: string,data:any): Observable<any> {
  return this.http.put<any>(`${this.API_PATH}/editUser/${userId}`,data);
}

getLoginUsersList(): Observable<any> {
  return this.http.get<any>(`${this.API_PATH}/pending-logins`);
}

approveLoginRequest(data:any): Observable<any> {
  return this.http.post<any>(`${this.API_PATH}/approveLogin`,data);
}
}