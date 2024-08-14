import { Component, OnDestroy } from '@angular/core';
import { Subscription, interval, takeWhile } from 'rxjs';
import { FriendService } from 'src/app/service/friend.service';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnDestroy{
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
    this.friendService.getConversations().subscribe(data => {
      this.friends = data.result
      console.log(this.friends.length)
    })
  }


  convoDetails: any;

  OnChatClick(sender: any, receiver: any) {
    this.isChatClicked = sender
    this.convoDetails = this.friends.find(friend => friend.conversation.senderId == sender && friend.conversation.receiverId == receiver)

    console.log(this.convoDetails)

    this.friendService.getMessages(sender, receiver).subscribe(data => {
      this.messages = data.result;
      console.log(this.messages)
    })
    this.startPolling();
  }


  getMessages() {
    this.friendService.getMessages(this.convoDetails.conversation.senderId, this.convoDetails.conversation.receiverId).subscribe(data => {
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

  startPolling() {
    // Poll every 30 seconds
    this.intervalSubscription = interval(20000)
      .pipe(
        takeWhile(() => !this.clickedUser) // Poll until approval status is received
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
    this.clickedUser = 
    this.stopPolling();
  }
}
