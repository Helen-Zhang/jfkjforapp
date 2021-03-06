import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators'
import { CommonService } from '../common.service';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public http: HttpClient,private common:CommonService,private httpnative: HTTP) { }
  
  getAccount(userid: string,pass:string,email:string,domain:string,folder:string): Observable<any> {
    let auth='Basic '+btoa(userid+':'+pass);
    const options = {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
    };
    return from(this.httpnative.get(domain+'/'+folder+'/appmgt.nsf/xp_ws.xsp/getMyAccount?email='+email,'',options));
   
  };
  
}
