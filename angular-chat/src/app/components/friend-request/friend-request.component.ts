import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';
import { SnackbarServiceService } from 'src/app/service/snackbar-service.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent {

  users: any[] = [];
  userId = sessionStorage.getItem('userId') || "";

  constructor(private http: HttpClient, private chatService: ChatService,private snackbarMessage: SnackbarServiceService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.chatService.getAllUsers(this.userId).subscribe(
      (response) => {
        console.log(response);
        this.users = response.result;
      });
  }

  sendFriendRequest(recipientId: string) {
    const senderId = this.userId; // You can define senderId dynamically if needed
    const requestBody = { senderId, recipientId };
    console.log(requestBody)
    this.chatService.friendRequest(requestBody).subscribe(
      response => {
        console.log('Friend request sent successfully:', response);

        if(response.statusCode!=200){
          this.snackbarMessage.snackbarDisplay(response.message);
        }
        this.fetchUsers();
      });
  }
}
