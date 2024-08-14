import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent  implements OnInit,OnDestroy{

  approvalStatus!: string;
  intervalSubscription!: Subscription;
  constructor( private authService: AuthService, private router: Router) {

  }
  ngOnInit(): void {
this.startPolling()
  }

  startPolling() {
    // Poll every 30 seconds
    this.intervalSubscription = interval(5000)
      .pipe(
        takeWhile(() => !this.approvalStatus) // Poll until approval status is received
      )
      .subscribe(() => {
        this.checkApprovalStatus();
      });
  }

  checkApprovalStatus() {
    const email = sessionStorage.getItem('userId')
    this.authService.getApprovalStatus(email).subscribe(
      (res) => {
        console.log(res);
        if (res.statusCode == 200) {
          this.stopPolling();
          sessionStorage.setItem('userDetails',JSON.stringify(res.result))
          this.router.navigateByUrl('navbar/friend-request')
          this.approvalStatus = "Approved";
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  stopPolling() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

}
