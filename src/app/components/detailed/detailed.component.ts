import { AfterContentInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map } from 'rxjs';
import {
  getBackgroundColor,
  IQueriesByCategory,
  isStatsByVendorIsolated,
  IStatsByVendor,
  IStatsByVendorIsolated,
  IStatsResultTypes,
  IStatsResultTypesIsolated,
  PERCENTAGES_NAME_BY_KEY,
  ResultType,
  RESULT_TYPE_BY_KEY,
  STAT_VENDOR_KEYS,
  STAT_VENDOR_KEYS_WITHOUT_LATENCY,
} from '../overview/overview.component';
import { IPercentages, WorkloadType } from '../../models/benchmark.model';
import { filterNullish } from '../../services/filter-nullish';
import { AppState } from '../../state';
import { IBenchmarkSettings } from '../../state/benchmarks';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.scss'],
})
export class DetailedComponent implements OnChanges, AfterContentInit {
  private detailedQueries_ = new BehaviorSubject<IQueriesByCategory[] | undefined | null>(undefined);
  detailedQueries$ = this.detailedQueries_.pipe(
    filterNullish(),
    map((detailedQueries) => detailedQueries.map((detQueries) => detQueries.queries).flat()),
  );
  @Input() set detailedQueries(value: IQueriesByCategory[] | null | undefined) {
    this.detailedQueries_.next(value);
  }

  @Input() settings: IBenchmarkSettings | null | undefined;

  statVendorKeys: (keyof IStatsResultTypes)[] | (keyof IStatsResultTypesIsolated)[] = [];

  shouldShowLatency = true;
  shouldShowRealistic = true;

  ResultType = ResultType;
  isStatsByVendorIsolated = isStatsByVendorIsolated;
  getBackgroundColor = getBackgroundColor;
  resultTypeByKey = RESULT_TYPE_BY_KEY;

  orangeSelect = ResultType.MEMORY;
  blackSelect = ResultType.THROUGHPUT;

  anchorQuery_ = new BehaviorSubject<string | null>('');
  anchorQuery$ = this.anchorQuery_.asObservable();

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const settingsChange: IBenchmarkSettings | null | undefined = changes['settings'].currentValue;
    if (settingsChange) {
      const isIsolatedActivated = settingsChange.workloadTypes.find(
        (workloadType) => workloadType.isActivated === true && workloadType.name === WorkloadType.ISOLATED,
      );
      const isRealisticActivated = settingsChange.workloadTypes.find(
        (workloadType) => workloadType.isActivated === true && workloadType.name === WorkloadType.REALISTIC,
      );
      this.statVendorKeys = STAT_VENDOR_KEYS_WITHOUT_LATENCY;
      this.shouldShowLatency = false;
      if (isIsolatedActivated) {
        this.statVendorKeys = STAT_VENDOR_KEYS;
        this.shouldShowLatency = true;
      }
      this.shouldShowRealistic = false;
      if (isRealisticActivated) {
        this.shouldShowRealistic = true;
      }
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
  }

  anchorQuery(queryName: string) {
    const queryParams: Params = {
      anchor: queryName,
    };
    this.anchorQuery_.next(queryName);
    const anchoredElement = document.getElementById(queryName);
    anchoredElement?.scrollIntoView();
    this.unhighlightQuery();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  orangeChange(event: Event) {
    const currentValue = (<HTMLTextAreaElement>event.target).value as ResultType | null;
    if (currentValue) {
      if (currentValue === this.blackSelect) {
        this.blackSelect = this.orangeSelect;
      }
      this.orangeSelect = currentValue;
    }
  }

  blackChange(event: Event) {
    const currentValue = (<HTMLTextAreaElement>event.target).value as ResultType | null;
    if (currentValue) {
      if (currentValue === this.orangeSelect) {
        this.orangeSelect = this.blackSelect;
      }
      this.blackSelect = currentValue;
    }
  }

  getChartWidth(
    statByVendor: IStatsByVendorIsolated | IStatsByVendor,
    statsByVendor: (IStatsByVendorIsolated | IStatsByVendor)[],
    resultType: ResultType,
  ) {
    const value = this.getValueByResultType(statByVendor, resultType);
    const totalValue = this.getTotalStatValue(statsByVendor, resultType);
    return (value / totalValue) * 100;
  }

  getValueByResultType(statByVendor: IStatsByVendorIsolated | IStatsByVendor, resultType: ResultType) {
    if (isStatsByVendorIsolated(statByVendor)) {
      return statByVendor[resultType].value;
    }
    if (resultType !== ResultType.LATENCY) {
      return statByVendor[resultType].value;
    }
    return 1;
  }

  getTotalStatValue(statsByVendor: (IStatsByVendorIsolated | IStatsByVendor)[], resultType: ResultType) {
    let total = 0;
    statsByVendor.forEach((statByVendor) => {
      total += this.getValueByResultType(statByVendor, resultType);
    });
    return total;
  }

  getPercentageName(percentageKey: keyof IPercentages) {
    return PERCENTAGES_NAME_BY_KEY[percentageKey];
  }

  unhighlightQuery() {
    setTimeout(() => {
      this.anchorQuery_.next(null);
    }, 3000);
  }
}
