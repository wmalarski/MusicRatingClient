import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../model/user';
import { MatPaginator, MatSort } from '@angular/material';
import { TokenStorageService } from '../services/auth/token-storage.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
 
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];
  columnsToDisplay = ['username', 'ratings', 'average'];
  allColumnsToDisplay = ['username', 'ratings', 'average', 'admin', 'user', 'remove']
  authorities: string[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  query: string = '';
  queryChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) { }
 
  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.authorities = this.tokenStorage.getAuthorities();
    }
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page, this.queryChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.query == '') {
            return this.userService.findAll(this.paginator.pageSize, this.paginator.pageIndex);            
          }
          return this.userService.findByName(this.query, this.paginator.pageSize, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.page.totalElements;
          if (this.resultsLength == 0) 
            return [];
          return data._embedded.userResponses;
        }),
        catchError((e) => {
          console.error('Error', e)
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(users => {
        this.users = users      
      });
  }

  applyFilter(filterValue: string) {
    if (this.query != filterValue) {
      this.query = filterValue;
      this.paginator.pageIndex = 0
      this.queryChanged.emit(null);
    }
    
  }
}