export type PatientLeaveRequestViewModel = {
  id: string;
  leaveReason: number;
  additionalInfo: string | undefined;
  outOfHomeTimestamp: Date;
  backToHomeTimestamp: Date;
  status: number;
};
