import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-leave-home-confirmation-no-test',
  templateUrl: './request-leave-home-confirmation-no-test.component.html',
  styleUrls: ['./request-leave-home-confirmation-no-test.component.scss'],
})
export class RequestLeaveHomeConfirmationNoTestComponent implements OnInit {
  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {}

  public goToRequestLeaveHome() {
    this.router.navigate(['/app/request-leave-home']);
  }

  public requestTest() {
    this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
  }

  public backToHome() {
    this.router.navigate(['/app/home']);
  }
}
