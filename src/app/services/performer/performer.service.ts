import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformerList, Performer, PerformerForm } from '../../model/performer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformerService {

  private URL_PERFORMERS = environment.api + '/performers';
  private URL_SEARCH = this.URL_PERFORMERS + "/query";

  constructor(private http: HttpClient) { }

  findByPage(pageSize: number, pageIndex: number): Observable<PerformerList> {
    return this.http.get<PerformerList>(this.URL_PERFORMERS, {
      params:{
        size: pageSize.toString(),
        page: pageIndex.toString(),
      }});
  }

  findByName(query: string, pageSize: number, pageIndex: number): Observable<PerformerList> {
    if (query == "") {
      return this.findByPage(pageSize, pageIndex);
    } else {
      return this.http.get<PerformerList>(this.URL_SEARCH, {
        params: {
          query: query,
          size: pageSize.toString(),
          page: pageIndex.toString()
        }
      })
    }
  }

  getById(id: string): Observable<Performer> {
    return this.http.get<Performer>(this.URL_PERFORMERS + '/' + id);
  }

  save(performerForm: PerformerForm): Observable<Performer> {
    return this.http.post(this.URL_PERFORMERS, performerForm);
  }

  update(performerForm: PerformerForm): Observable<Performer> {
    return this.http.put(this.URL_PERFORMERS, performerForm);
  }

  remove(performer: Performer): Observable<Object> {
    return this.http.delete(this.URL_PERFORMERS, {
      params: {
        performerId: performer.performerId.toString()
      }
    });
  }
}
