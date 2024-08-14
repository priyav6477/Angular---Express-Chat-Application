import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-display-friend-request',
  templateUrl: './display-friend-request.component.html',
  styleUrls: ['./display-friend-request.component.css']
})
export class DisplayFriendRequestComponent {

  users: any[] = [];
  userId = sessionStorage.getItem('userId');
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFriendRequest();
  }


  getFriendRequest() {
    this.http.get<any>(`http://localhost:3000/friend-requests/${this.userId}`).subscribe(
      (response) => {
        this.users = response.result;
        console.log(this.users.length)

      });
  }

  acceptUser(user: any) {
    const data = {
      senderId: user.email,
      recipientId: this.userId,
    };
    this.http.post<any>('http://localhost:3000/accept-friend-request', data)
      .subscribe(
        response => {
          console.log(response);
          this.getFriendRequest();
        });
  }
}
