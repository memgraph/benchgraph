import { Injectable } from '@angular/core';

import { AnalyticsService } from './analytics.service';

@Injectable({ providedIn: 'root' })
export class SegmentService implements AnalyticsService {
  constructor() {
    console.log('Using MOCK Segment service!');
  }

  trackEvent(event: string, properties?: any) {
    console.log(`[MOCK] Segment event: ${event}`, properties);
  }
}
