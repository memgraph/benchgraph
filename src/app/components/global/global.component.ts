import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import {
  generateNameByPercentages,
  getBackgroundColor,
  IQueriesByCategory,
  IQuery,
  isStatsByVendorIsolated,
  IStatsResultTypes,
  IStatsResultTypesIsolated,
  PERCENTAGES_NAME_BY_KEY,
  ResultType,
  RESULT_TYPE_BY_KEY,
  STAT_VENDOR_KEYS,
  STAT_VENDOR_KEYS_WITHOUT_LATENCY,
  TOOLTIP_OF_RESULT_TYPE,
} from '../overview/overview.component';
import { IPercentages, QueryCategory, WorkloadType } from '../../models/benchmark.model';
import { filterNullish } from '../../services/filter-nullish';
import { removeDuplicatesFromArray } from '../../services/remove-duplicates';
import { IBenchmarkSettings } from '../../state/benchmarks';
import { Unsubscribe } from 'src/app/services/unsubscribe';
import { Clipboard } from '@angular/cdk/clipboard';
import { LATENCY_PERCENTILE } from 'src/app/state/benchmarks/benchmarks.effects';
import { UiMessageType, UiService } from 'src/app/services/ui.service';

const categoryNameByCategory: Record<QueryCategory, string> = {
  [QueryCategory.AGGREGATE]: 'Aggregate Queries',
  [QueryCategory.ANALYTICAL]: 'Analytical Queries',
  [QueryCategory.READ]: 'Read Queries',
  [QueryCategory.UPDATE]: 'Update Queries',
  [QueryCategory.WRITE]: 'Write Queries',
};

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss'],
})
export class GlobalComponent extends Unsubscribe implements AfterContentInit, OnChanges {
  private detailedQueries_ = new BehaviorSubject<IQueriesByCategory[] | undefined | null>(undefined);
  detailedQueries$ = this.detailedQueries_.pipe(filterNullish());
  @Input() set detailedQueries(value: IQueriesByCategory[] | null | undefined) {
    this.detailedQueries_.next(value);
  }

  @Input() settings: IBenchmarkSettings | null | undefined;

  private onScroll_ = new BehaviorSubject<Event | undefined | null>(undefined);
  onScroll$ = this.onScroll_.pipe(filterNullish());
  @Input() set onScroll(value: Event | null | undefined) {
    this.onScroll_.next(value);
  }

  @Output() closeBanner = new EventEmitter<void>();

  vendors$ = this.detailedQueries$.pipe(
    map((detailedQueries) =>
      removeDuplicatesFromArray(
        detailedQueries
          .map((detailedQuery) => detailedQuery.queries.map((query) => query.statsByVendor.map((stat) => stat.vendor)))
          .flat(3),
      ),
    ),
  );

  anchorQuery_ = new BehaviorSubject<string | null>('');
  anchorQuery$ = this.anchorQuery_.asObservable();

  statVendorKeys: (keyof IStatsResultTypes)[] | (keyof IStatsResultTypesIsolated)[] = [];

  ResultType = ResultType;
  isStatsByVendorIsolated = isStatsByVendorIsolated;
  getBackgroundColor = getBackgroundColor;
  resultTypeByKey = RESULT_TYPE_BY_KEY;

  shouldShowRealistic = true;
  shouldShowIsolated = true;
  activatedResultType = this.statVendorKeys[0];

  latencyPercentile = LATENCY_PERCENTILE;
  tooltipOfResultType = TOOLTIP_OF_RESULT_TYPE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private uiService: UiService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    const settingsChange: IBenchmarkSettings | null | undefined = changes['settings']?.currentValue;
    if (settingsChange) {
      const isIsolatedActivated = settingsChange.workloadTypes.find(
        (workloadType) => workloadType.isActivated === true && workloadType.name === WorkloadType.ISOLATED,
      );
      const isRealisticActivated = settingsChange.workloadTypes.find(
        (workloadType) => workloadType.isActivated === true && workloadType.name === WorkloadType.REALISTIC,
      );
      this.statVendorKeys = STAT_VENDOR_KEYS_WITHOUT_LATENCY;
      this.shouldShowIsolated = false;
      if (isIsolatedActivated) {
        this.shouldShowIsolated = true;
        this.statVendorKeys = STAT_VENDOR_KEYS;
      }
      this.shouldShowRealistic = false;
      if (isRealisticActivated) {
        this.shouldShowRealistic = true;
      }
      this.activatedResultType = this.statVendorKeys[0];
    }
  }

  ngAfterContentInit(): void {
    const anchorQuery = this.route.snapshot.queryParamMap.get('anchor');
    if (anchorQuery) {
      const queryParams: Params = {
        anchor: null,
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
      this.anchorQuery_.next(anchorQuery);
      setTimeout(() => {
        const anchoredElement = document.getElementById(anchorQuery);
        anchoredElement?.scrollIntoView();
      }, 100);
      this.unhighlightQuery();
    }
    this.listenForNavigationChanges();
  }

  listenForNavigationChanges() {
    this.onScroll$.pipe(takeUntil(this.unsubscribe$)).subscribe((onScroll) => {
      if (onScroll) {
        this.statVendorKeys.forEach((vendor) => {
          const element = document.getElementById(vendor);
          const position = element?.getBoundingClientRect();

          if (position) {
            // checking for partial visibility
            if (position.top < window.innerHeight && position.bottom >= 0) {
              this.activatedResultType = vendor;
            }
          }
        });
      }
    });
  }

  unhighlightQuery() {
    setTimeout(() => {
      this.anchorQuery_.next(null);
    }, 3000);
  }

  getQueryIndex(detailedQueries: IQueriesByCategory[], categoryIndex: number, queryIndex: number) {
    let returnIndex = 0;
    for (let i = 0; i < detailedQueries.length; i++) {
      if (i === categoryIndex) {
        returnIndex += queryIndex;
        break;
      }
      returnIndex += detailedQueries[i].queries.length;
    }
    return returnIndex + 1;
  }

  getCategoryName(detailedQuery: IQueriesByCategory) {
    let returnName = '';
    if ('category' in detailedQuery) {
      returnName += categoryNameByCategory[detailedQuery.category as QueryCategory];

      const statsByVendor = detailedQuery.queries[0].statsByVendor[0];
      if (!isStatsByVendorIsolated(statsByVendor) && statsByVendor.percentages) {
        returnName += generateNameByPercentages(statsByVendor.percentages);
      }
    }
    return returnName;
  }

  getQueryName(query: IQuery) {
    let returnName = '';
    const statsByVendor = query.statsByVendor[0];
    if (!isStatsByVendorIsolated(statsByVendor) && statsByVendor.percentages) {
      returnName += generateNameByPercentages(statsByVendor.percentages, '/');
    }
    return returnName;
  }

  anchorQuery(
    resultType: keyof IStatsResultTypes | keyof IStatsResultTypesIsolated,
    detailedQuery: IQueriesByCategory,
    queryIndex: number,
  ) {
    const category = 'category' in detailedQuery && detailedQuery.category ? detailedQuery.category : '';
    const anchorQuery = `${resultType + category + queryIndex}`;
    const queryParams: Params = {
      anchor: anchorQuery,
    };
    this.anchorQuery_.next(anchorQuery);
    const anchoredElement = document.getElementById(anchorQuery);
    anchoredElement?.scrollIntoView();
    this.unhighlightQuery();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
    this.clipboard.copy(window.location.href);
    this.uiService.addMessage({ message: 'URL copied', type: UiMessageType.Success });
  }

  getPercentageName(percentageKey: keyof IPercentages) {
    return PERCENTAGES_NAME_BY_KEY[percentageKey];
  }

  changeActivatedResultType(resultType: keyof IStatsResultTypesIsolated) {
    this.closeBanner.next();
    this.activatedResultType = resultType;
    const activatedElement = document.getElementById(resultType);
    activatedElement?.scrollIntoView();
  }
}
