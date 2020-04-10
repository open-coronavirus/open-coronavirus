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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { BluetoothLeAdvertisement } from '../model/bluetoothLeAdvertisement';
import { BluetoothLeAdvertisementWithRelations } from '../model/bluetoothLeAdvertisementWithRelations';
import { LoopbackCount } from '../model/loopbackCount';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class BluetoothLeAdvertisementControllerService {

    protected basePath = 'http://localhost:3000';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }



    /**
     * @param where 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerCount(where?: { [key: string]: object; }, observe?: 'body', reportProgress?: boolean): Observable<LoopbackCount>;
    public bluetoothLeAdvertisementControllerCount(where?: { [key: string]: object; }, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LoopbackCount>>;
    public bluetoothLeAdvertisementControllerCount(where?: { [key: string]: object; }, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LoopbackCount>>;
    public bluetoothLeAdvertisementControllerCount(where?: { [key: string]: object; }, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (where !== undefined && where !== null) {
            queryParameters = queryParameters.set('where', <any>where);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<LoopbackCount>(`${this.configuration.basePath}/bluetooth-le-advertisements/count`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param requestBody 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerCreate(requestBody?: { [key: string]: object; }, observe?: 'body', reportProgress?: boolean): Observable<BluetoothLeAdvertisement>;
    public bluetoothLeAdvertisementControllerCreate(requestBody?: { [key: string]: object; }, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BluetoothLeAdvertisement>>;
    public bluetoothLeAdvertisementControllerCreate(requestBody?: { [key: string]: object; }, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BluetoothLeAdvertisement>>;
    public bluetoothLeAdvertisementControllerCreate(requestBody?: { [key: string]: object; }, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<BluetoothLeAdvertisement>(`${this.configuration.basePath}/bluetooth-le-advertisements`,
            requestBody,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerDeleteById(id: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public bluetoothLeAdvertisementControllerDeleteById(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public bluetoothLeAdvertisementControllerDeleteById(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public bluetoothLeAdvertisementControllerDeleteById(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerDeleteById.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.delete<any>(`${this.configuration.basePath}/bluetooth-le-advertisements/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param filter 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerFind(filter?: object, observe?: 'body', reportProgress?: boolean): Observable<Array<BluetoothLeAdvertisementWithRelations>>;
    public bluetoothLeAdvertisementControllerFind(filter?: object, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<BluetoothLeAdvertisementWithRelations>>>;
    public bluetoothLeAdvertisementControllerFind(filter?: object, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<BluetoothLeAdvertisementWithRelations>>>;
    public bluetoothLeAdvertisementControllerFind(filter?: object, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (filter !== undefined && filter !== null) {
            queryParameters = queryParameters.set('filter', <any>filter);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<Array<BluetoothLeAdvertisementWithRelations>>(`${this.configuration.basePath}/bluetooth-le-advertisements`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param id 
     * @param filter 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerFindById(id: string, filter?: object, observe?: 'body', reportProgress?: boolean): Observable<BluetoothLeAdvertisementWithRelations>;
    public bluetoothLeAdvertisementControllerFindById(id: string, filter?: object, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BluetoothLeAdvertisementWithRelations>>;
    public bluetoothLeAdvertisementControllerFindById(id: string, filter?: object, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BluetoothLeAdvertisementWithRelations>>;
    public bluetoothLeAdvertisementControllerFindById(id: string, filter?: object, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerFindById.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (filter !== undefined && filter !== null) {
            queryParameters = queryParameters.set('filter', <any>filter);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<BluetoothLeAdvertisementWithRelations>(`${this.configuration.basePath}/bluetooth-le-advertisements/${encodeURIComponent(String(id))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param id 
     * @param requestBody 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerReplaceById(id: string, requestBody?: { [key: string]: object; }, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public bluetoothLeAdvertisementControllerReplaceById(id: string, requestBody?: { [key: string]: object; }, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public bluetoothLeAdvertisementControllerReplaceById(id: string, requestBody?: { [key: string]: object; }, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public bluetoothLeAdvertisementControllerReplaceById(id: string, requestBody?: { [key: string]: object; }, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerReplaceById.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.put<any>(`${this.configuration.basePath}/bluetooth-le-advertisements/${encodeURIComponent(String(id))}`,
            requestBody,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param where 
     * @param requestBody 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerUpdateAll(where?: { [key: string]: object; }, requestBody?: { [key: string]: object; }, observe?: 'body', reportProgress?: boolean): Observable<LoopbackCount>;
    public bluetoothLeAdvertisementControllerUpdateAll(where?: { [key: string]: object; }, requestBody?: { [key: string]: object; }, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LoopbackCount>>;
    public bluetoothLeAdvertisementControllerUpdateAll(where?: { [key: string]: object; }, requestBody?: { [key: string]: object; }, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LoopbackCount>>;
    public bluetoothLeAdvertisementControllerUpdateAll(where?: { [key: string]: object; }, requestBody?: { [key: string]: object; }, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (where !== undefined && where !== null) {
            queryParameters = queryParameters.set('where', <any>where);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.patch<LoopbackCount>(`${this.configuration.basePath}/bluetooth-le-advertisements`,
            requestBody,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param id 
     * @param requestBody 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bluetoothLeAdvertisementControllerUpdateById(id: string, requestBody?: { [key: string]: object; }, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public bluetoothLeAdvertisementControllerUpdateById(id: string, requestBody?: { [key: string]: object; }, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public bluetoothLeAdvertisementControllerUpdateById(id: string, requestBody?: { [key: string]: object; }, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public bluetoothLeAdvertisementControllerUpdateById(id: string, requestBody?: { [key: string]: object; }, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerUpdateById.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.patch<any>(`${this.configuration.basePath}/bluetooth-le-advertisements/${encodeURIComponent(String(id))}`,
            requestBody,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
