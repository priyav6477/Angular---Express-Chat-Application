import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, takeWhile } from 'rxjs';
import { FriendService } from 'src/app/service/friend.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  email!: string
  isChatClicked: any
  currentUser: any
  clickedUser: any
  intervalSubscription!: Subscription;
  message!: string
  messages: any[] = [];
  friends: any[] = [];
  currentUserImage: any;
  constructor(private friendService: FriendService) {
    let user = sessionStorage.getItem('userDetails');

    this.currentUser = sessionStorage.getItem('userId');
    if (user) {
      let userObject = JSON.parse(user);
      this.email = userObject.stepOneData.email
      this.currentUserImage = userObject.stepThreeData.profile
    }
  }


  ngOnInit(): void {
    // this.messageService.receiveMessage().subscribe((message) => {
    //   console.log('Received message:', message);
    // });

    this.friendService.getFriends(this.email).subscribe(data => {
      this.friends = data.result
      console.log(this.friends)

    })
  }

  OnChatClick(email: any) {
    this.message = ''
    this.isChatClicked = email
    this.clickedUser = this.friends.find(friend => friend.email == email)
    this.friendService.getMessages(this.currentUser, this.clickedUser.email).subscribe(data => {
      console.log(data);
      this.messages = data.result;
    })
    this.startPolling();
  }


  getMessages() {
    this.friendService.getMessages(this.currentUser, this.clickedUser.email).subscribe(data => {
      console.log(data);
      this.messages = data.result;
    })
  }

  getFormattedTime(timeString: string): string {
    const date = new Date(timeString);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    };
    const formattedTime = date.toLocaleDateString('en-US', options);
    return formattedTime;
  }


  sendMessage() {
    if (this.message !== null && this.message !== undefined && this.message.trim() !== '') {
      const req = {
        senderId: this.currentUser,
        receiverId: this.clickedUser.email,
        message: this.message
      }
      this.friendService.sendMessage(req).subscribe(data => {
        this.message='';
        console.log(data);
      })
      this.getMessages();
    }
    // this.messageService.sendMessage("prem@gmail.com", "priya@gmail.com", "Biii")
  }

  startPolling() {
    // Poll every 30 seconds
    this.intervalSubscription = interval(10000)
      .pipe(
        takeWhile(() => this.clickedUser) // Poll until approval status is received
      )
      .subscribe(() => {
        this.getMessages();
      });
  }

  stopPolling() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.clickedUser = ''
    this.stopPolling();
  }

}
