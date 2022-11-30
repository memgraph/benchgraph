import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SegmentService } from 'src/app/services/segment.service';
import { UtilService } from 'src/app/services/util.service';

export enum SidenavSize {
  OPENED = 'Opened',
  COLLAPSED = 'Collapsed',
}

export interface ISidenavLink {
  title: string;
  url: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  sidenavSize_ = new BehaviorSubject<SidenavSize>(SidenavSize.COLLAPSED);
  sidenavSize$ = this.sidenavSize_.asObservable();

  SidenavSize = SidenavSize;

  sidenavGitHubLinks: ISidenavLink[] = [
    {
      title: 'Methodology',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#fire-mgbench-benchmark-for-graph-databases',
    },
    {
      title: 'Reproduce & Validate Results',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#reproducibility-and-validation',
    },
    {
      title: 'Query List',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#query-list',
    },
    { title: 'Raw Benchmark Results', url: 'https://github.com/memgraph/benchgraph/tree/main/results' },
    {
      title: 'Contribute',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#raised_hands-contributions',
    },
    { title: 'Report Mistakes', url: 'https://github.com/memgraph/memgraph/issues' },
  ];

  sidenavDocsLinks: ISidenavLink[] = [
    {
      title: 'Read Graph Database vs Relational Database',
      url: 'https://memgraph.com/blog/graph-database-vs-relational-database',
    },
  ];

  constructor(private readonly utilService: UtilService, private segmentService: SegmentService) {}

  changeSidenavSize(sidenavSize: SidenavSize) {
    this.sidenavSize_.next(sidenavSize);
  }

  openLink(url: string) {
    this.segmentService.trackEvent('Link Clicked', { linkUrl: url });
  }
}
