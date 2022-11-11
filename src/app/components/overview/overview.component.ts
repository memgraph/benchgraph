import { AfterContentInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import {
  IBenchmark,
  IPercentages,
  IQueryIsolated,
  IQueryMixed,
  isQueryIsolated,
  isQueryMixed,
  isWorkloadIsolated,
  isWorkloadMixed,
  isWorkloadRealistic,
  IWorkload,
  IWorkloadIsolated,
  IWorkloadMixed,
  QueryCategory,
  RunConfigVendor,
} from 'src/app/models/benchmark.model';
import { AppState } from 'src/app/state';
import { BenchmarkSelectors } from 'src/app/state/benchmarks';
import _ from 'lodash';
import { filterNullish } from 'src/app/services/filter-nullish';
import { ActivatedRoute, Params, Router } from '@angular/router';

export enum ITab {
  AGGREGATE = 'Aggregate Results',
  GLOBAL = 'Global Results',
  DETAILED = 'Detailed Results',
}

export interface IStat {
  value: number;
  isWeakest: boolean;
  relativeValue: number;
}

export interface IStatsResultTypes {
  memory: IStat;
  throughput: IStat;
}

export type IStatsResultTypesIsolated = IStatsResultTypes & { latency: IStat };

export enum ResultType {
  MEMORY = 'memory',
  THROUGHPUT = 'throughput',
  LATENCY = 'latency',
}

export const RESULT_TYPE_BY_KEY: Record<keyof IStatsResultTypesIsolated, string> = {
  [ResultType.LATENCY]: 'Latency',
  [ResultType.MEMORY]: 'Peak Memory',
  [ResultType.THROUGHPUT]: 'Throughput',
};

export const STAT_VENDOR_KEYS: (keyof IStatsResultTypesIsolated)[] = [
  ResultType.MEMORY,
  ResultType.THROUGHPUT,
  ResultType.LATENCY,
];

export const STAT_VENDOR_KEYS_WITHOUT_LATENCY: (keyof IStatsResultTypes)[] = [ResultType.MEMORY, ResultType.THROUGHPUT];

export type IStatsByVendor = {
  vendor: RunConfigVendor;
  percentages: IPercentages | undefined;
} & IStatsResultTypes;

export type IStatsByVendorIsolated = {
  vendor: RunConfigVendor;
} & IStatsResultTypesIsolated;

export function isStatsByVendorIsolated(
  result: IStatsByVendor | IStatsByVendorIsolated,
): result is IStatsByVendorIsolated {
  return 'latency' in result;
}

export type IStatsByVendorExtendedMixed = IStatsByVendor & { queryName: string; category: QueryCategory };
export type IStatsByVendorExtendedIsolated = IStatsByVendorIsolated & { queryName: string; category: QueryCategory };
export type IStatsByVendorExtendedRealistic = IStatsByVendor & { queryName: string };

export function isStatsByVendorExtendedIsolated(
  result: IStatsByVendorExtendedMixed | IStatsByVendorExtendedIsolated | IStatsByVendorExtendedRealistic,
): result is IStatsByVendorExtendedIsolated {
  return 'latency' in result && 'category' in result;
}

export function isStatsByVendorExtendedMixed(
  result: IStatsByVendorExtendedMixed | IStatsByVendorExtendedIsolated | IStatsByVendorExtendedRealistic,
): result is IStatsByVendorExtendedMixed {
  return !('latency' in result) && 'category' in result;
}

export function isStatsByVendorExtendedRealistic(
  result: IStatsByVendorExtendedMixed | IStatsByVendorExtendedIsolated | IStatsByVendorExtendedRealistic,
): result is IStatsByVendorExtendedRealistic {
  return !('latency' in result) && !('category' in result);
}

export interface IQuery {
  queryName: string;
  statsByVendor: (IStatsByVendor | IStatsByVendorIsolated)[];
}

export interface IQueriesByCategory {
  category?: QueryCategory;
  queries: IQuery[];
}

export const PERCENTAGES_NAME_BY_KEY: Record<keyof IPercentages, string> = {
  analyticalPerc: 'Analytical',
  queryPerc: 'Query',
  updatePerc: 'Update',
  readPerc: 'Read',
  writePerc: 'Write',
  numOfQueries: 'Number of Queries',
};

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements AfterContentInit {
  currentTab_ = new BehaviorSubject<ITab>(ITab.AGGREGATE);
  currentTab$ = this.currentTab_.asObservable();

  tabs = [ITab.AGGREGATE, ITab.GLOBAL, ITab.DETAILED];

  settings$ = this.store.select(BenchmarkSelectors.selectSettings);

  activatedConditions$ = this.settings$.pipe(
    map((settings) =>
      settings?.conditions.filter((condition) => condition.isActivated).map((condition) => condition.name),
    ),
  );

  activatedVendors$ = this.settings$.pipe(
    map((settings) => settings?.vendors.filter((vendor) => vendor.isActivated).map((vendor) => vendor.name)),
  );

  activatedDatasetSizes$ = this.settings$.pipe(
    map((settings) => settings?.datasetSizes.filter((size) => size.isActivated).map((size) => size.name)),
  );

  activatedWorkloadTypes$ = this.settings$.pipe(
    map((settings) => settings?.workloadTypes.filter((type) => type.isActivated).map((type) => type.name)),
  );

  activatedQueryCategories$ = this.settings$.pipe(
    map((settings) =>
      settings?.queryCategories.filter((category) => {
        if (category.isActivated) {
          const filteredQueries = category.queries.filter((query) => query.isActivated);
          return {
            ...category,
            queries: filteredQueries,
          };
        }
        return false;
      }),
    ),
  );

  presentedBenchmarks$: Observable<IBenchmark[] | undefined> = combineLatest([
    this.store.select(BenchmarkSelectors.selectBenchmarks),
    this.activatedConditions$,
    this.activatedVendors$,
    this.activatedDatasetSizes$,
    this.activatedQueryCategories$,
    this.activatedWorkloadTypes$,
  ]).pipe(
    map(
      ([
        benchmarks,
        activatedConditions,
        activatedVendors,
        activatedSizes,
        activatedQueryCategories,
        activatedWorkloadTypes,
      ]) =>
        benchmarks
          ?.filter(
            (benchmark) =>
              activatedConditions?.includes(benchmark.runConfig.condition) &&
              activatedVendors?.includes(benchmark.runConfig.vendor),
          )
          .map((benchmark) => {
            const filteredDatasetsBySize = benchmark.datasets.filter((dataset) =>
              activatedSizes?.includes(dataset.size),
            );
            const filteredDatasetByQueries = filteredDatasetsBySize.map((dataset) => {
              const filteredWorkloadsByType = dataset.workloads.filter((workload) =>
                activatedWorkloadTypes?.includes(workload.workloadType),
              );
              const filteredWorkloads = filteredWorkloadsByType.map((workload) => {
                if (isWorkloadRealistic(workload)) {
                  return workload;
                }
                const filteredQueries: (IQueryMixed | IQueryIsolated)[] = workload.queries.filter(
                  (query: IQueryMixed | IQueryIsolated) => {
                    const currentCategory = activatedQueryCategories?.find(
                      (category) => category.name === query.category,
                    );
                    if (currentCategory) {
                      const isActivatedQuery = currentCategory.queries.some(
                        (categoryQuery) => categoryQuery.isActivated && categoryQuery.name === query.name,
                      );
                      if (isActivatedQuery) {
                        if (isQueryMixed(query)) {
                          return query;
                        }
                        if (isQueryIsolated(query)) {
                          return query;
                        }
                      }
                    }
                    return false;
                  },
                );
                return mergeWorkload(workload, filteredQueries);
              });
              return { ...dataset, workloads: filteredWorkloads };
            });
            return {
              ...benchmark,
              datasets: filteredDatasetByQueries,
            };
          }),
    ),
  );

  detailedQueries$ = this.presentedBenchmarks$.pipe(
    filterNullish(),
    map((benchmarks) => {
      const allResultsByVendor: (
        | IStatsByVendorExtendedMixed
        | IStatsByVendorExtendedRealistic
        | IStatsByVendorExtendedIsolated
      )[] = benchmarks
        ?.map((benchmark) =>
          benchmark.datasets.map((datasets) =>
            datasets.workloads.map((workload) => {
              if (isWorkloadRealistic(workload)) {
                return {
                  vendor: benchmark.runConfig.vendor,
                  memory: { value: workload.stats.database.memory, isWeakest: true, relativeValue: 1 },
                  throughput: { value: workload.stats.throughput, isWeakest: true, relativeValue: 1 },
                  queryName: JSON.stringify(workload.percentages),
                  percentages: workload.percentages,
                };
              }
              if (isWorkloadIsolated(workload)) {
                return workload.queries.map((query) => ({
                  vendor: benchmark.runConfig.vendor,
                  memory: { value: query.stats.database.memory, isWeakest: true, relativeValue: 1 },
                  throughput: { value: query.stats.throughput, isWeakest: true, relativeValue: 1 },
                  latency: { value: query.stats.queryStatistics.mean * 1000, isWeakest: true, relativeValue: 1 },
                  queryName: query.name,
                  category: query.category,
                }));
              }
              return workload.queries.map((query) => ({
                vendor: benchmark.runConfig.vendor,
                memory: { value: query.stats.database.memory, isWeakest: true, relativeValue: 1 },
                throughput: { value: query.stats.throughput, isWeakest: true, relativeValue: 1 },
                queryName: query.name,
                category: query.category,
                percentages: workload.percentages,
              }));
            }),
          ),
        )
        .flat(3);
      const groupedByName = _.groupBy(allResultsByVendor, 'queryName');
      const groupedByNamesObject = Object.values(groupedByName);
      const groupedByNamesToType = groupedByNamesObject.map((results) => {
        const weakestMemory = results.reduce((a, b) => (a.memory.value > b.memory.value ? a : b));
        const weakestThroughput = results.reduce((a, b) => (a.throughput.value < b.throughput.value ? a : b));
        const weakestLatency = results.reduce((a, b) => {
          if (isStatsByVendorExtendedIsolated(a) && isStatsByVendorExtendedIsolated(b)) {
            return (a as IStatsByVendorIsolated).latency.value > (b as IStatsByVendorIsolated).latency.value ? a : b;
          }
          return a;
        });
        const statsByVendorWithRelativeValues = results.map((result) => {
          let percentages: IPercentages | undefined;
          if (!isStatsByVendorExtendedIsolated(result)) {
            percentages = result.percentages;
          }
          let returnValue: IStatsByVendor | IStatsByVendorIsolated = {
            vendor: result.vendor,
            memory: {
              value: result.memory.value,
              isWeakest: weakestMemory.vendor === result.vendor,
              relativeValue:
                weakestMemory.vendor === result.vendor ? 1 : weakestMemory.memory.value / result.memory.value,
            },
            throughput: {
              value: result.throughput.value,
              isWeakest: weakestThroughput.vendor === result.vendor,
              relativeValue:
                weakestThroughput.vendor === result.vendor
                  ? 1
                  : result.throughput.value / weakestThroughput.throughput.value,
            },
            percentages,
          };
          if (isStatsByVendorExtendedIsolated(result)) {
            const latency = {
              value: result.latency.value,
              isWeakest: weakestLatency.vendor === result.vendor,
              relativeValue:
                weakestLatency.vendor === result.vendor
                  ? 1
                  : (weakestLatency as IStatsByVendorIsolated).latency.value / result.latency.value,
            };
            returnValue = { ...returnValue, latency };
          }
          return returnValue;
        });
        let category: QueryCategory | undefined;
        if (isStatsByVendorExtendedIsolated(results[0]) || isStatsByVendorExtendedMixed(results[0])) {
          category = results[0].category;
        }
        return {
          queryName: results[0].queryName,
          category: category,
          statsByVendor: statsByVendorWithRelativeValues,
        };
      });
      const groupedByCategory = _.groupBy(groupedByNamesToType, 'category');
      const groupedByCategoryObject = Object.values(groupedByCategory);
      const detailedQueries: IQueriesByCategory[] = groupedByCategoryObject.map((object) => ({
        category: object[0].category,
        queries: object.map((stats) => ({
          queryName: stats.queryName,
          statsByVendor: stats.statsByVendor,
        })),
      }));
      return detailedQueries;
    }),
  );

  ITab = ITab;
  constructor(private readonly store: Store<AppState>, private router: Router, private route: ActivatedRoute) {}

  ngAfterContentInit(): void {
    const tabFromParams = this.route.snapshot.queryParamMap.get('tab') as ITab | null;
    if (tabFromParams) {
      this.currentTab_.next(tabFromParams);
    }
  }

  changeCurrentTab(newTab: ITab) {
    const queryParams: Params = {
      tab: newTab,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
    this.currentTab_.next(newTab);
  }
}

const mergeWorkload = (
  workload: IWorkloadIsolated | IWorkloadMixed,
  queries: (IQueryMixed | IQueryIsolated)[],
): IWorkload => {
  const mergedWorkload: IWorkloadIsolated | IWorkloadMixed = {
    ...workload,
    queries: [],
  };

  if (isWorkloadIsolated(mergedWorkload)) {
    queries.forEach((query) => {
      if (isQueryIsolated(query)) {
        mergedWorkload.queries.push(query);
      }
    });
  }

  if (isWorkloadMixed(mergedWorkload)) {
    queries.forEach((query) => {
      if (isQueryMixed(query)) {
        mergedWorkload.queries.push(query);
      }
    });
  }

  return mergedWorkload;
};

export const generateNameByPercentages = (percentages: IPercentages, delimiter = '+'): string => {
  let generatedName = '';
  if (percentages.analyticalPerc > 0) {
    generatedName += ` ${delimiter} ${percentages.analyticalPerc}% Analytical`;
  }
  if (percentages.readPerc > 0) {
    generatedName += ` ${delimiter} ${percentages.readPerc}% Read`;
  }
  if (percentages.updatePerc > 0) {
    generatedName += ` ${delimiter} ${percentages.updatePerc}% Update`;
  }
  if (percentages.writePerc > 0) {
    generatedName += ` ${delimiter} ${percentages.writePerc}% Write`;
  }
  return generatedName;
};
