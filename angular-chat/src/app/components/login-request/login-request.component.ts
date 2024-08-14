import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-login-request',
  templateUrl: './login-request.component.html',
  styleUrls: ['./login-request.component.css']
})
export class LoginRequestComponent {
  users: any[] = [];
  userId = sessionStorage.getItem('userId');

  constructor(private http: HttpClient, private chatService: ChatService) { }

  ngOnInit(): void {
    this.getLoginRequests();
  }

  getLoginRequests() {
    this.chatService.getLoginUsersList().subscribe(response => {
      console.log(response);
      this.users = response.result;
    })
  }

  acceptUser(user: any) {
    console.log(user)
    const data = {
      email: user
    };
    this.chatService.approveLoginRequest(data).subscribe(response => {
      console.log(response);
      this.getLoginRequests();
    })
  }
}
