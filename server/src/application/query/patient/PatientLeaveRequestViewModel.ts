export type PatientLeaveRequestViewModel = {
  id: string;
  leaveReason: number;
  additionalInfo: string | undefined;
  outOfHomeTimestamp: Date;
  backToHomeTimestamp: Date | null | undefined;
  status: number;
};
