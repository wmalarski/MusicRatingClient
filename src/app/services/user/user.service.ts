import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, UserList } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL_USERS = environment.api + '/users';
  private URL_QUERY = this.URL_USERS + '/query';
  private URL_REMOVE = this.URL_USERS + '/remove';

  constructor(private http: HttpClient) { }
 
  findAll(pageSize: number, pageIndex: number): Observable<UserList> {
    return this.http.get<UserList>(this.URL_USERS, {
      params: {
        size: pageSize.toString(),
        page: pageIndex.toString(),
      }});
  }

  findByName(query: string, pageSize: number, pageIndex: number): Observable<UserList> {
    return this.http.get<UserList>(this.URL_QUERY, {
      params: {
        query: query,
        size: pageSize.toString(),
        page: pageIndex.toString(),
      }});
  }

  remove(user: User): Observable<Object> {
    return this.http.delete(this.URL_REMOVE, {
      params: {
        username: user.username
      }
    });
  }
}
