export interface BenchgraphTrackingProperties {
  linkUrl?: string;
}

export abstract class AnalyticsService {
  /**
   * Track a custom event.
   * @param event Event action. Should be of format "Noun Verb" where the verb is usually in past tense.
   *               (https://segment.com/docs/getting-started/04-full-install/#event-naming-best-practices)
   * @param properties Tracking data as defined by the interface.
   */
  abstract trackEvent(event: string, properties?: any): any;
}
