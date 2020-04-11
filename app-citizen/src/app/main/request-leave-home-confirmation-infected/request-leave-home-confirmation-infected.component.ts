import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-leave-home-confirmation-infected',
  templateUrl: './request-leave-home-confirmation-infected.component.html',
  styleUrls: ['./request-leave-home-confirmation-infected.component.scss'],
})
export class RequestLeaveHomeConfirmationInfectedComponent implements OnInit {

  constructor(
    protected router: Router
  ) { }

  ngOnInit() {}

  public backToHome() {
    this.router.navigate(['/app/home']);
  }

}
