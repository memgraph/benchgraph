import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import {
  BenchmarkActions,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsHardwareAlias,
  IBenchmarkSettingsMaxTimes,
  IBenchmarkSettingsQueryCategory,
  IBenchmarkSettingsSize,
  IBenchmarkSettingsVendor,
  IBenchmarkSettingsWorkloadType,
} from '.';
import MemgraphCold from '../../../../results/memgraph_cold.json';
import MemgraphHot from '../../../../results/memgraph_hot.json';
import Neo4jHot from '../../../../results/neo4j_hot.json';
import Neo4jCold from '../../../../results/neo4j_cold.json';
// import IntelMemgraphCold from '../../mocks/mock-results-intel-memgraph-cold.json';
// import IntelMemgraphHot from '../../mocks/mock-results-intel-memgraph-hot.json';
// import IntelNeo4jHot from '../../mocks/mock-results-intel-neo4j-cold.json';
// import IntelNeo4jCold from '../../mocks/mock-results-intel-neo4j-hot.json';
// import RyzenMemgraphCold from '../../mocks/mock-results-ryzen-memgraph-cold.json';
// import RyzenMemgraphHot from '../../mocks/mock-results-ryzen-memgraph-hot.json';
// import RyzenNeo4jHot from '../../mocks/mock-results-ryzen-neo4j-cold.json';
// import RyzenNeo4jCold from '../../mocks/mock-results-ryzen-neo4j-hot.json';
import {
  IBenchmark,
  IQueryStatistics,
  isQueryIsolated,
  isWorkloadRealistic,
  IWorkloadIsolated,
  IWorkloadMixed,
} from 'src/app/models/benchmark.model';
import { removeDuplicatesFromArray } from 'src/app/services/remove-duplicates';
import {
  TOOLTIP_OF_CONDITION,
  TOOLTIP_OF_DATASET_SIZE,
  TOOLTIP_OF_WORKLOAD_TYPE,
} from 'src/app/components/overview/overview.component';

export const LATENCY_PERCENTILE: keyof IQueryStatistics = 'p99';

@Injectable()
export class BenchmarksEffects {
  constructor(private actions$: Actions, private store: Store) {}

  getBenchmarks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BenchmarkActions.getBenchmarks),
        tap((_) => {
          // const benchmarks: IBenchmark[] = [
          //   IntelMemgraphCold as IBenchmark,
          //   IntelMemgraphHot as IBenchmark,
          //   IntelNeo4jHot as IBenchmark,
          //   IntelNeo4jCold as IBenchmark,
          //   RyzenMemgraphCold as IBenchmark,
          //   RyzenMemgraphHot as IBenchmark,
          //   RyzenNeo4jHot as IBenchmark,
          //   RyzenNeo4jCold as IBenchmark,
          // ];
          const benchmarks: IBenchmark[] = [
            MemgraphCold as IBenchmark,
            MemgraphHot as IBenchmark,
            Neo4jCold as IBenchmark,
            Neo4jHot as IBenchmark,
          ];
          this.store.dispatch(
            BenchmarkActions.setBenchmarks({
              benchmarks,
            }),
          );
          const hardwareAliases: IBenchmarkSettingsHardwareAlias[] = getHardwareAliases(benchmarks);
          const vendors: IBenchmarkSettingsVendor[] = getVendors(benchmarks);
          const conditions: IBenchmarkSettingsCondition[] = getConditions(benchmarks);
          const workloadTypes: IBenchmarkSettingsWorkloadType[] = getWorkloadTypes(benchmarks);
          const datasetSizes: IBenchmarkSettingsSize[] = getDatasetSizes(benchmarks);
          const queryCategories: IBenchmarkSettingsQueryCategory[] = getQueryCategories(benchmarks);
          const maxTimes: IBenchmarkSettingsMaxTimes = getMaxTimes(benchmarks);
          this.store.dispatch(
            BenchmarkActions.setSettings({
              settings: {
                hardwareAliases,
                vendors,
                conditions,
                datasetSizes,
                queryCategories,
                maxTimes,
                workloadTypes,
              },
            }),
          );
        }),
      ),
    { dispatch: false },
  );
}

const getVendors = (benchmarks: IBenchmark[]): IBenchmarkSettingsVendor[] => {
  const vendorsArray = benchmarks.map((benchmark) => benchmark.runConfig.vendor);
  const returnVendors: IBenchmarkSettingsVendor[] = removeDuplicatesFromArray(vendorsArray).map((name) => {
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
      tooltip: TOOLTIP_OF_CONDITION[name],
    };
  });
  return returnBenchmarks;
};

const getHardwareAliases = (benchmarks: IBenchmark[]): IBenchmarkSettingsHardwareAlias[] => {
  const benchmarksArray = benchmarks.map((benchmark) => benchmark.runConfig.hardwareAlias);
  const returnBenchmarks: IBenchmarkSettingsHardwareAlias[] = removeDuplicatesFromArray(benchmarksArray).map(
    (name, i) => {
      return {
        name,
        isActivated: i === 0 ? true : false,
      };
    },
  );
  return returnBenchmarks;
};

const getWorkloadTypes = (benchmarks: IBenchmark[]): IBenchmarkSettingsWorkloadType[] => {
  const workloadTypesArray = benchmarks
    .map((benchmark) => benchmark.datasets.map((dataset) => dataset.workloads.map((workload) => workload.workloadType)))
    .flat(2);
  const returnWorkloadTypes: IBenchmarkSettingsWorkloadType[] = removeDuplicatesFromArray(workloadTypesArray).map(
    (name, i) => {
      return {
        name,
        isActivated: i === 0 ? true : false,
        tooltip: TOOLTIP_OF_WORKLOAD_TYPE[name],
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
      tooltip: TOOLTIP_OF_DATASET_SIZE[name],
    };
  });
  return returnDatasetSizes;
};

// This one is not very optimized
export const getQueryCategories = (benchmarks: IBenchmark[]): IBenchmarkSettingsQueryCategory[] => {
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
              queryLatency = query.stats.queryStatistics[LATENCY_PERCENTILE] * 1000;
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
