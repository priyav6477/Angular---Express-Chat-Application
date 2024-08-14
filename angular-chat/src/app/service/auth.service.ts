import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private baseUrl="http://localhost:3000";

  login(request:any) :Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, request);
  }

  approveUser(request:any) :Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/approveLogin`, request);
  }

  pendingLogins() :Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/pending-logins`);
  }

  getApprovalStatus(email:any) :Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/approval-status/${email}`);
  }
}
