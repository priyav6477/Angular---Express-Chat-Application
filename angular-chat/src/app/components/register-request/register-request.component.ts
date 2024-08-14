import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChatService } from 'src/app/service/chat.service';
import { UserDetailsResult } from 'src/app/user-details-result';

@Component({
  selector: 'app-register-request',
  templateUrl: './register-request.component.html',
  styleUrls: ['./register-request.component.css']
})
export class RegisterRequestComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobile', 'dateOfBirth', 'gender', 'companyName', 'companyAddress', 'actions'];
  userList: UserDetailsResult[] = [];

  dataSource = new MatTableDataSource<UserDetailsResult>(this.userList);

  // dataSource = ELEMENT_DATA;

  constructor(private chatService: ChatService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getPendingRegistrations();
  }


  dataSize: any
  getPendingRegistrations() {
    this.chatService.getUsers().subscribe(data => {
      console.log(data)
      if (data.statusCode == 200) {
        this.dataSize = true
      } else {
        this.dataSize = false
      }

      this.dataSource = data.result;
    }
    );
  }


  approveUser(user: any) {
    this.updateUserStatus(user.stepOneData.email, 'success');
  }

  rejectUser(user: any) {
    this.updateUserStatus(user.stepOneData.email, 'denied');
  }

  updateUserStatus(user: any, status: string) {
    const userId = user; // Assuming you have a unique identifier for each user
    console.log(userId)
    this.http.put(`http://localhost:3000/users/${userId}/status`, { status }).subscribe(
      (response) => {
        console.log('User status updated successfully');
        this.getPendingRegistrations();

      },
      (error) => {
        console.error('Error updating user status:', error);
      }
    );
  }
}
