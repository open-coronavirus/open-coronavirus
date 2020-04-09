import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/shared/services/patient.service';
import { Patient } from 'src/app/shared/sdk';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-self-declaration-leave',
  templateUrl: './self-declaration-leave.component.html',
  styleUrls: ['./self-declaration-leave.component.scss'],
})
export class SelfDeclarationLeaveComponent implements OnInit {
  public patient: Patient;
  protected subscriptions: Array<Subscription> = new Array();

  constructor(
    public patientService: PatientService,
    protected location: Location,
    protected router: Router
  ) { }

  ngOnInit() {
    this.patientService.patientLoaded$.subscribe(patientLoaded => {
      if (patientLoaded) {
        this.patient = patientLoaded;
      }
    });
  }

  public goBack() {
    this.location.back();
  }


public backToHome() {
    this.router.navigate(['/app/home'])
}

}
