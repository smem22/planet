import { Component, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { StateService } from '../../shared/state.service';

@Component({
  selector: 'planet-myplanet-table',
  templateUrl: './myplanet-table.component.html'
})
export class MyPlanetTableComponent implements OnChanges, AfterViewInit {

  @Input() data = [];
  myPlanets = new MatTableDataSource();
  displayedColumns = [ 'id', 'name', 'lastSynced', 'version' ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private stateService: StateService
  ) {
    if (this.stateService.configuration.planetType === 'center') {
      this.displayedColumns.push('createdOn');
    }
  }

  ngOnChanges() {
    this.myPlanets.data = this.data;
  }

  ngAfterViewInit() {
    this.myPlanets.paginator = this.paginator;
  }

}
