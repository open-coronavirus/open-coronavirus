/**
 * coronavirus-server - coronavirus-server
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * (Schema options: { title: \'NewLeaveRequest\', exclude: [ \'id\' ] })
 */
export interface NewLeaveRequest { 
  [key: string]: object | any;


    leaveReason: number;
    additionalInfo?: string;
    outOfHomeTimestamp?: Date;
    backToHomeTimestamp?: Date;
    patientId: string;
    status?: number;
}

