import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/shared/services/patient.service';
import { Patient } from 'src/app/shared/sdk';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';

@Component({
  selector: 'app-self-declaration-leave',
  templateUrl: './self-declaration-leave.component.html',
  styleUrls: ['./self-declaration-leave.component.scss'],
})
export class SelfDeclarationLeaveComponent implements OnInit {
  public patient: Patient;
  protected subscriptions: Array<Subscription> = new Array();
  public leaveReason: number;
  public leaveRequestAdditionalInfo: string;
  public now: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    public patientService: PatientService,
    protected location: Location,
    protected router: Router,
    protected leaveRequestService: LeaveRequestService
  ) {
    this.now = new Date();
  }

  ngOnInit() {
    this.patient = this.patientService.patient;

    this.activatedRoute.paramMap.subscribe(params => {
      this.leaveReason = +params.get('leaveReason');
      this.leaveRequestAdditionalInfo = params.get('leaveRequestAdditionalInfo');
    });
  }

  public requestLeaveHome() {
    if (this.leaveReason < 8) {
        this.leaveRequestService.request(this.leaveReason, null).subscribe(result => {
            if (result != null) {
                this.router.navigate(['/app/leave-request-result']);
            }
        });
    } else {
      this.leaveRequestService.request(this.leaveReason, this.leaveRequestAdditionalInfo).subscribe(result => {
        if (result != null) {
            this.router.navigate(['/app/leave-request-result']);
        }
      });
    }
  }

  public goBack() {
    this.location.back();
  }

  public backToHome() {
      this.router.navigate(['/app/home']);
  }

}
