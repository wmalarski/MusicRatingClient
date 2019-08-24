import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album, AlbumList } from '../../model/album'
import { Performer } from 'src/app/model/performer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private URL_ALBUMS = environment.api + '/albums';
  private URL_SEARCH = this.URL_ALBUMS + '/query';
  private URL_PERFORMER = this.URL_ALBUMS + '/performer'
  private URL_RANDOM = environment.api;

  constructor(private http: HttpClient) { }

  findByPage(size: number, page: number): Observable<AlbumList> {
    return this.http.get<AlbumList>(this.URL_ALBUMS, {
      params:{
        size: size.toString(),
        page: page.toString(),
      }});
  }

  findByPerformer(performer: Performer, size: number, page: number): Observable<AlbumList> {
    return this.http.get<AlbumList>(this.URL_PERFORMER, {
      params: {
        performerId: performer.performerId.toString(),
        size: size.toString(),
        page: page.toString(),
      }
    });
  }

  findByQuery(filterValue: string, size: number, page: number): Observable<AlbumList> {
    if (filterValue == "") {
      return this.findByPage(size, page);
    } else {
      return this.http.get<AlbumList>(this.URL_SEARCH, {
        params: {
          query: filterValue,
          size: size.toString(),
          page: page.toString()
        }
      });
    }
  }

  findRandom(): Observable<AlbumList> {
    return this.http.get<AlbumList>(this.URL_RANDOM);
  }

  findRandomHref(href: string): Observable<AlbumList> {
    return this.http.get<AlbumList>(href);
  }

  get(id: string): Observable<Album> {
    return this.http.get<Album>(this.URL_ALBUMS + '/' + id);
  }

  save(album: Album): Observable<Album> {
    return this.http.post(this.URL_ALBUMS, album);
  }

  remove(album: Album): Observable<Object>{
    return this.http.delete(this.URL_ALBUMS, {
      params: {
        albumId: album.albumId.toString()
      }
    });
  }
}
