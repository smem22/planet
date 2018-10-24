import { Component, Input, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ResourcesService } from '../resources.service';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../shared/state.service';

@Component({
  selector: 'planet-resources-viewer',
  templateUrl: './resources-viewer.component.html',
  styleUrls: [ './resources-viewer.scss' ]
})
export class ResourcesViewerComponent implements OnChanges, OnDestroy {

  @Input() resourceId: string;
  @Input() resource: any;
  @Input() fetchRating = true;
  @Output() resourceUrl = new EventEmitter<any>();
  mediaType: string;
  contentType: string;
  resourceSrc: string;
  parent = this.route.snapshot.data.parent;
  pdfSrc: any;
  private onDestroy$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private resourcesService: ResourcesService,
    private route: ActivatedRoute,
    private stateService: StateService
  ) { }

  get urlPrefix() {
    let domain = environment.couchAddress + '/resources/';
    if (this.parent) {
      domain = 'http://' + this.stateService.configuration.parentDomain + '/resources/';
    }
    return domain;
  }

  ngOnChanges() {
    if (this.resource === undefined || this.resource._id !== this.resourceId) {
      this.resourcesService.resourcesListener(this.parent).pipe(takeUntil(this.onDestroy$))
        .subscribe((resources) => {
          this.setResource(resources.find((r: any) => r._id === this.resourceId));
        });
      this.resourcesService.requestResourcesUpdate(this.parent, this.fetchRating);
    } else {
      this.setResource(this.resource);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setResource(resource: any) {
    this.resource = resource;
    // openWhichFile is used to label which file to start with for HTML resources
    const filename = resource.openWhichFile || Object.keys(resource._attachments)[0];
    this.mediaType = resource.mediaType;
    this.contentType = resource._attachments[filename].content_type;
    this.resourceSrc = this.urlPrefix + resource._id + '/' + filename;
    if (!this.mediaType) {
      const mediaTypes = [ 'image', 'pdf', 'audio', 'video', 'zip' ];
      this.mediaType = mediaTypes.find((type) => this.contentType.indexOf(type) > -1) || 'other';
    }
    if (this.mediaType === 'pdf' || this.mediaType === 'HTML') {
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.resourceSrc);
    }
    // Emit resource src so parent component can use for links
    this.resourceUrl.emit(this.resourceSrc);
  }

}
