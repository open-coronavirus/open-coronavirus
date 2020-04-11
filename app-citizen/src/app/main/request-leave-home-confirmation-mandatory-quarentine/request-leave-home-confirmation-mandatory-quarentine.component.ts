import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-leave-home-confirmation-mandatory-quarentine',
  templateUrl: './request-leave-home-confirmation-mandatory-quarentine.component.html',
  styleUrls: ['./request-leave-home-confirmation-mandatory-quarentine.component.scss'],
})
export class RequestLeaveHomeConfirmationMandatoryQuarentineComponent implements OnInit {

  constructor(
    protected router: Router
  ) { }

  ngOnInit() {}

  public goToRequestLeaveHome() {
    this.router.navigate(['/app/request-leave-home']);
  }

  public backToHome() {
    this.router.navigate(['/app/home']);
  }
}
