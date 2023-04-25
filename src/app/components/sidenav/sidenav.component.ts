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

export const REPRODUCE_LINK = 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#prerequisites';

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
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#fire-benchgraph-benchmark-for-graph-databases',
    },
    {
      title: 'Validate Results',
      url: REPRODUCE_LINK,
    },
    {
      title: 'Query List',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#query-list',
    },
    { title: 'Raw Benchmark Results', url: 'https://github.com/memgraph/benchgraph/tree/main/results/benchmarks.json' },
    {
      title: 'Contribute',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#raised_hands-contributions',
    },
    { title: 'Report Mistakes', url: 'https://github.com/memgraph/memgraph/issues' },
    {
      title: 'Changelog',
      url: 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#changelog-benchgraph-public-benchmark',
    },
  ];

  sidenavDocsLinks: ISidenavLink[] = [
    {
      title: 'Introduction to Benchgraph and its Architecture',
      url: 'https://memgraph.com/blog/introduction-to-benchgraph-and-its-architecture',
    },
    {
      title: 'How to Benchmark Memgraph [or Neo4J] with Benchgraph?',
      url: 'https://memgraph.com/blog/benchmark-memgraph-or-neo4j-with-benchgraph',
    },
    {
      title: 'Memgraph vs. Neo4j: A Performance Comparison',
      url: 'http://memgraph.com/blog/memgraph-vs-neo4j-performance-benchmark-comparison',
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
