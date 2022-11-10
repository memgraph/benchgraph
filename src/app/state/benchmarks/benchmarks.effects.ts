import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import {
  BenchmarkActions,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsMaxTimes,
  IBenchmarkSettingsQueryCategory,
  IBenchmarkSettingsSize,
  IBenchmarkSettingsVendor,
  IBenchmarkSettingsWorkloadType,
} from '.';
import MemgraphCold from '../../mocks/mock-results-memgraph-cold.json';
import MemgraphHot from '../../mocks/mock-results-memgraph-hot.json';
import Neo4jHot from '../../mocks/mock-results-neo4j-hot.json';
import Neo4jCold from '../../mocks/mock-results-neo4j-cold.json';
import {
  IBenchmark,
  isQueryIsolated,
  isWorkloadRealistic,
  IWorkloadIsolated,
  IWorkloadMixed,
} from 'src/app/models/benchmark.model';
import { removeDuplicatesFromArray } from 'src/app/services/remove-duplicates';

@Injectable()
export class BenchmarksEffects {
  constructor(private actions$: Actions, private store: Store) {}

  getBenchmarks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BenchmarkActions.getBenchmarks),
        tap((_) => {
          const benchmarks: IBenchmark[] = [
            MemgraphCold as IBenchmark,
            MemgraphHot as IBenchmark,
            Neo4jHot as IBenchmark,
            Neo4jCold as IBenchmark,
          ];
          this.store.dispatch(
            BenchmarkActions.setBenchmarks({
              benchmarks,
            }),
          );
          const vendors: IBenchmarkSettingsVendor[] = getVendors(benchmarks);
          const conditions: IBenchmarkSettingsCondition[] = getConditions(benchmarks);
          const workloadTypes: IBenchmarkSettingsWorkloadType[] = getWorkloadTypes(benchmarks);
          const datasetSizes: IBenchmarkSettingsSize[] = getDatasetSizes(benchmarks);
          const queryCategories: IBenchmarkSettingsQueryCategory[] = getQueryCategories(benchmarks);
          const maxTimes: IBenchmarkSettingsMaxTimes = getMaxTimes(benchmarks);
          this.store.dispatch(
            BenchmarkActions.setSettings({
              settings: { vendors, conditions, datasetSizes, queryCategories, maxTimes, workloadTypes },
            }),
          );
        }),
      ),
    { dispatch: false },
  );
}

const getVendors = (benchmarks: IBenchmark[]): IBenchmarkSettingsVendor[] => {
  const vendorsArray = benchmarks.map((benchmark) => benchmark.runConfig.vendor);
  const vendorsSet = new Set(vendorsArray);
  const backToArray = [...vendorsSet];
  const returnVendors: IBenchmarkSettingsVendor[] = backToArray.map((name) => {
    return {
      name,
      isActivated: true,
    };
  });
  return returnVendors;
};

const getConditions = (benchmarks: IBenchmark[]): IBenchmarkSettingsCondition[] => {
  const benchmarksArray = benchmarks.map((benchmark) => benchmark.runConfig.condition);
  const returnBenchmarks: IBenchmarkSettingsCondition[] = removeDuplicatesFromArray(benchmarksArray).map((name, i) => {
    return {
      name,
      isActivated: i === 0 ? true : false,
    };
  });
  return returnBenchmarks;
};

const getWorkloadTypes = (benchmarks: IBenchmark[]): IBenchmarkSettingsWorkloadType[] => {
  const workloadTypesArray = benchmarks
    .map((benchmark) => benchmark.datasets.map((dataset) => dataset.workloads.map((workload) => workload.type)))
    .flat(2);
  const returnWorkloadTypes: IBenchmarkSettingsWorkloadType[] = removeDuplicatesFromArray(workloadTypesArray).map(
    (name, i) => {
      return {
        name,
        isActivated: i === 0 ? true : false,
      };
    },
  );
  return returnWorkloadTypes;
};

const getDatasetSizes = (benchmarks: IBenchmark[]): IBenchmarkSettingsSize[] => {
  const datasetSizesArray = benchmarks.map((benchmark) => benchmark.datasets.map((dataset) => dataset.size)).flat();
  const returnDatasetSizes: IBenchmarkSettingsSize[] = removeDuplicatesFromArray(datasetSizesArray).map((name, i) => {
    return {
      name,
      isActivated: i === 0 ? true : false,
    };
  });
  return returnDatasetSizes;
};

// This one is not very optimized
const getQueryCategories = (benchmarks: IBenchmark[]): IBenchmarkSettingsQueryCategory[] => {
  const queriesArray = benchmarks
    .map((benchmark) =>
      benchmark.datasets
        .map((dataset) =>
          dataset.workloads
            .filter((workload) => !isWorkloadRealistic(workload))
            .map((workload) => (workload as IWorkloadIsolated | IWorkloadMixed).queries),
        )
        .flat(2),
    )
    .flat()
    .map((query) => ({ category: query.category, name: query.name }));
  const categories = removeDuplicatesFromArray(queriesArray.map((query) => query.category).flat());
  const returnArray: IBenchmarkSettingsQueryCategory[] = categories.map((name) => {
    const queriesByCategory = removeDuplicatesFromArray(
      queriesArray.filter((query) => query.category === name).map((query) => query.name),
    );
    return {
      isActivated: true,
      name,
      isExpanded: false,
      queries: queriesByCategory.map((query) => ({
        isActivated: true,
        name: query,
      })),
    };
  });
  return returnArray;
};

const getMaxTimes = (benchmarks: IBenchmark[]): IBenchmarkSettingsMaxTimes => {
  let maxMemory = 0;
  let maxThroughput = 0;
  let maxLatency = 0;

  benchmarks.forEach((benchmark) =>
    benchmark.datasets.forEach((dataset) =>
      dataset.workloads.forEach((workload) => {
        if (isWorkloadRealistic(workload)) {
          const queryMemory = workload.stats.database.memory;
          const queryThroughput = workload.stats.throughput;
          if (queryMemory > maxMemory) {
            maxMemory = queryMemory;
          }
          if (queryThroughput > maxThroughput) {
            maxThroughput = queryThroughput;
          }
        } else {
          workload.queries.forEach((query) => {
            const queryMemory = query.stats.database.memory;
            const queryThroughput = query.stats.throughput;
            let queryLatency = 0;
            if (isQueryIsolated(query)) {
              queryLatency = query.stats.queryStatistics.mean * 1000;
            }
            if (queryMemory > maxMemory) {
              maxMemory = queryMemory;
            }
            if (queryThroughput > maxThroughput) {
              maxThroughput = queryThroughput;
            }
            if (queryLatency > maxLatency) {
              maxLatency = queryLatency;
            }
          });
        }
      }),
    ),
  );

  return { memory: maxMemory, throughput: maxThroughput, latency: maxLatency };
};
