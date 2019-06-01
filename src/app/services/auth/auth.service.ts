import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthLoginInfo } from './login-info';
import { JwtResponse } from './jwt-response';
import { SignUpInfo } from './signup-info';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private URL = environment.api + '/api/auth/'
  private loginUrl = this.URL + 'signin';
  private signupUrl = this.URL + 'signup';
  private URL_GRAND = this.URL + 'grand';
  private URL_REVOKE = this.URL + 'revoke';
 
  constructor(private http: HttpClient) {
  }
 
  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }
 
  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }

  grand(role: string, user: User): Observable<Object> {
    return this.http.put(this.URL_GRAND, {
      username: user.username,
      role: role
    });
  }

  revoke(role: string, user: User): Observable<Object> {
    return this.http.put(this.URL_REVOKE, {
      username: user.username,
      role: role
    });
  }
}
