import { Injectable } from '@angular/core';

import { AnalyticsService, BenchgraphTrackingProperties } from './analytics.service';

@Injectable({ providedIn: 'root' })
export class SegmentService implements AnalyticsService {
  segment: any;

  constructor() {
    this.segment = (window as any).analytics;
  }

  trackEvent(event: string, properties?: BenchgraphTrackingProperties) {
    try {
      this.segment.track({
        event,
        properties: { benchgraph: { properties } },
      });
    } catch (error) {
      console.error(`Segment.track failed with error: ${error}`);
    }
  }
}
