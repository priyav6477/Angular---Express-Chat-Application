import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  constructor(private http: HttpClient) { }
  private baseUrl="http://localhost:3000";

  // http://localhost:3000/getFriends/priya@gmail.com

  getFriends(email:any) :Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/getFriends/${email}`);
  }
  getMessages(user1:any,user2:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/get-messages?userId1=${user1}&userId2=${user2}`);
  }

  sendMessage(request:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/send-message`,request);
  }
  
  getConversations():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/admin/conversations`);
  }
}