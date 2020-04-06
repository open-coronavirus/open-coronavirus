import { PoliceOfficer, Auth } from "../models";
import { Sanitarian } from "../models";


export interface AuthService {

  postPoliceOfficerLogin(auth: Auth): Promise<PoliceOfficer | null>;
  postSanitarianLogin(auth: Auth): Promise<Sanitarian | null>;

}
