import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { PerformerService } from '../services/performer/performer.service';
import { Performer } from '../model/performer';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { PerformerDetailComponent } from '../performer-detail/performer-detail.component';
import { TokenStorageService } from '../services/auth/token-storage.service';

@Component({
  selector: 'app-performer-list',
  templateUrl: './performer-list.component.html',
  styleUrls: ['./performer-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PerformerListComponent implements OnInit {

  selectedPerformer: Performer | null;
  performers: Performer[];
  columnsToDisplay = ['name', 'average', 'albumCount', 'ratingsCount'];
  authorities: string[] = [];
  opened: boolean;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  query: string = '';
  queryChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatDrawer) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PerformerDetailComponent) performerDetail: PerformerDetailComponent;

  constructor(
    private performerService: PerformerService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.authorities = this.tokenStorage.getAuthorities();
    }
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page, this.queryChanged, this.performerDetail.albumListChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.performerService.findByName(this.query, this.paginator.pageSize, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.performers;
        }),
        catchError((e) => {
          console.error('Error', e)
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(performers => {
        this.performers = performers      
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
