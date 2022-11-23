import { Injectable } from '@angular/core';
import { AnalyticsService, BenchgraphTrackingProperties } from './analytics.service';

declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}

@Injectable({ providedIn: 'root' })
export class SegmentService implements AnalyticsService {
  /**
   * Track a custom event.
   * @param event Event action. Should be of format "Noun Verb" where the verb is usually in past tense.
   *               (https://segment.com/docs/getting-started/04-full-install/#event-naming-best-practices)
   * @param properties Tracking data as defined by the interface.
   */
  trackEvent(event: string, properties?: BenchgraphTrackingProperties) {
    try {
      window.analytics.track(event, properties);
    } catch (error) {
      console.error(`Segment.track failed with error: ${error}`);
    }
  }
}
