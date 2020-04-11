import {Injectable} from "@angular/core";
import {
    TestAppointmentControllerService,
    TestAppointmentWithRelations,
    TestResultControllerService,
    TestResultWithRelations
} from "../sdk";
import {BehaviorSubject, Subject} from "rxjs";
import {PatientService} from "./patient.service";

@Injectable()
export class TestResultService {

    public testResult: TestResultWithRelations;

    public testResultLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    public constructor(protected patientService: PatientService,
                       protected testResultControllerService: TestResultControllerService) {

        //first of all
        this.loadTestResults();

    }

    public loadTestResults() {

        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.testResultControllerService.testResultControllerFindLatestByPatientId(this.patientService.patient.id).subscribe(testResult => {
                    this.testResult = testResult;
                    this.testResultLoaded$.next(true);
                })
            }
        });
    }

    public sendTestAnswers(answers, questionnaireId) {

        let returnValue = new Subject();

        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {

                let testResult: TestResultWithRelations = new class implements TestResultWithRelations {
                    [key: string]: object | any;
                    questionnaireId: string;
                    answers: Array<object>;
                    patientId: string;
                }

                testResult.questionnaireId = questionnaireId;
                testResult.answers = answers;
                testResult.patientId = this.patientService.patient.id;

                this.testResultControllerService.testResultControllerCreate(testResult).subscribe(testResultFromServer => {
                    if(testResultFromServer != null) {
                        this.loadTestResults();
                        returnValue.next(true);
                    }
                });

            }
        });

        return returnValue;

    }

}
