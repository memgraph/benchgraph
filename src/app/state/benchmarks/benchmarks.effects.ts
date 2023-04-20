import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import {
  BenchmarkActions,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsPlatform,
  IBenchmarkSettingsMaxTimes,
  IBenchmarkSettingsQueryCategory,
  IBenchmarkSettingsSize,
  IBenchmarkSettingsVendor,
  IBenchmarkSettingsWorkloadType,
  IBenchmarkSettingsDatasetName,
  DatasetSizesPerName,
  IBenchmarkSettingsNumberOfWorkers,
  WorkloadTypePerDataset,
  BenchmarkSelectors,
  WorkloadTypePerCondition,
  QueryCategoryWithQueries,
} from '.';
// import MemgraphCold from '../../../../results/memgraph_cold.json';
// import MemgraphHot from '../../../../results/memgraph_hot.json';
// import Neo4jHot from '../../../../results/neo4j_hot.json';
// import Neo4jCold from '../../../../results/neo4j_cold.json';
import benchmarksJson from '../../../../results/benchmarks.json';
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
  IBenchmarks,
  IQueryStatistics,
  isQueryIsolated,
  isWorkloadRealistic,
  IWorkloadIsolated,
  IWorkloadMixed,
  QueryCategory,
} from 'src/app/models/benchmark.model';
import { removeDuplicatesFromArray } from 'src/app/services/remove-duplicates';
import {
  TOOLTIP_OF_CONDITION,
  TOOLTIP_OF_DATASET_SIZE,
  TOOLTIP_OF_PLATFORM,
  TOOLTIP_OF_WORKLOAD_TYPE,
} from 'src/app/components/overview/overview.component';
import { WorkloadType } from 'src/app/models/benchmark.model';

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
          // const benchmarks: IBenchmark[] = [
          //   MemgraphCold as IBenchmark,
          //   MemgraphHot as IBenchmark,
          //   Neo4jCold as IBenchmark,
          //   Neo4jHot as IBenchmark,
          // ];
          const benchmarks = benchmarksJson as IBenchmarks;
          this.store.dispatch(
            BenchmarkActions.setBenchmarks({
              benchmarks: benchmarks.benchmarks,
            }),
          );
          const platforms: IBenchmarkSettingsPlatform[] = getPlatforms(benchmarks.benchmarks);
          const vendors: IBenchmarkSettingsVendor[] = getVendors(benchmarks.benchmarks);
          const numberOfWorkers: IBenchmarkSettingsNumberOfWorkers[] = getNumberOfWorkers(benchmarks.benchmarks);
          const conditions: IBenchmarkSettingsCondition[] = getConditions(benchmarks.benchmarks);
          const workloadTypes: IBenchmarkSettingsWorkloadType[] = getWorkloadTypes(benchmarks.benchmarks);
          const datasetNames: IBenchmarkSettingsDatasetName[] = getDatasetNames(benchmarks.benchmarks);
          const datasetSizes: IBenchmarkSettingsSize[] = getDatasetSizes(benchmarks.benchmarks);
          const datasetSizesPerName = getDatasetSizesPerName(benchmarks.benchmarks);
          const workloadTypesPerDataset = getWorkloadTypesPerDataset(benchmarks.benchmarks);
          const workloadTypesPerCondition = getWorkloadTypesPerCondition(benchmarks.benchmarks);
          const queryCategories: IBenchmarkSettingsQueryCategory[] = getQueryCategories(benchmarks.benchmarks);
          const queryCategoriesPerDataset = getQueryCategoriesPerDatasetName(benchmarks.benchmarks);
          const maxTimes: IBenchmarkSettingsMaxTimes = getMaxTimes(benchmarks.benchmarks);
          this.store.dispatch(
            BenchmarkActions.setSettings({
              settings: {
                platforms,
                vendors,
                numberOfWorkers,
                workloadTypesPerDataset,
                workloadTypesPerCondition,
                queryCategoriesPerDataset,
                conditions,
                datasetNames,
                datasetSizes,
                datasetSizesPerName,
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

  updateDatasetNames$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BenchmarkActions.updateDatasetNames),
        withLatestFrom(this.store.select(BenchmarkSelectors.selectSettings)),
        tap(([payload, settings]) => {
          if (!settings) {
            return;
          }

          const activatedWorkloadType = settings.workloadTypes.find((workloadType) => workloadType.isActivated);
          if (activatedWorkloadType) {
            const validWorkloadTypes = settings.workloadTypesPerDataset[payload.datasetNameSetting.name];
            const isValidWorkloadTypeActivated = validWorkloadTypes.includes(activatedWorkloadType?.name);
            if (!isValidWorkloadTypeActivated) {
              const firstValidWorkloadType = settings.workloadTypes.find(
                (workloadType) => validWorkloadTypes[0] === workloadType.name,
              );
              if (firstValidWorkloadType) {
                this.store.dispatch(
                  BenchmarkActions.updateWorkloadType({
                    workloadType: { ...firstValidWorkloadType, isActivated: true },
                  }),
                );
              }
            }
          }

          const activatedDatasetSize = settings.datasetSizes.find((datasetSize) => datasetSize.isActivated);
          if (activatedDatasetSize) {
            const validDatasetSizes = settings.datasetSizesPerName[payload.datasetNameSetting.name];
            const isValidDatasetSizeActivated = validDatasetSizes.includes(activatedDatasetSize?.name);
            if (!isValidDatasetSizeActivated) {
              const firstValidDatasetSize = settings.datasetSizes.find(
                (datasetSize) => validDatasetSizes[0] === datasetSize.name,
              );
              if (firstValidDatasetSize) {
                this.store.dispatch(
                  BenchmarkActions.updateDatasetSizes({
                    size: {
                      ...firstValidDatasetSize,
                      isActivated: true,
                    },
                  }),
                );
              }
            }
          }
        }),
      ),
    { dispatch: false },
  );

  updateCondition$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BenchmarkActions.updateCondition),
        withLatestFrom(this.store.select(BenchmarkSelectors.selectSettings)),
        tap(([payload, settings]) => {
          if (!settings) {
            return;
          }

          const activatedWorkloadType = settings.workloadTypes.find((workloadType) => workloadType.isActivated);
          if (!activatedWorkloadType) {
            return;
          }
          const validWorkloadTypes = settings.workloadTypesPerCondition[payload.condition.name];
          const isValidWorkloadTypeActivated = validWorkloadTypes.includes(activatedWorkloadType?.name);
          if (isValidWorkloadTypeActivated) {
            return;
          }
          const firstValidWorkloadType = settings.workloadTypes.find(
            (workloadType) => validWorkloadTypes[0] === workloadType.name,
          );
          if (!firstValidWorkloadType) {
            return;
          }
          this.store.dispatch(
            BenchmarkActions.updateWorkloadType({
              workloadType: { ...firstValidWorkloadType, isActivated: true },
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

const getNumberOfWorkers = (benchmarks: IBenchmark[]) => {
  const numberOFWorkersArray = benchmarks.map((benchmark) => benchmark.runConfig.numberWorkers);
  const returnNumberOfWorkers: IBenchmarkSettingsNumberOfWorkers[] = removeDuplicatesFromArray(
    numberOFWorkersArray,
  ).map((size, i) => {
    return {
      size,
      isActivated: i === 0 ? true : false,
    };
  });
  return returnNumberOfWorkers;
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

const getPlatforms = (benchmarks: IBenchmark[]): IBenchmarkSettingsPlatform[] => {
  const benchmarksArray = benchmarks.map((benchmark) => benchmark.runConfig.platform);
  const returnBenchmarks: IBenchmarkSettingsPlatform[] = removeDuplicatesFromArray(benchmarksArray).map((name, i) => {
    return {
      name,
      isActivated: i === 0 ? true : false,
      tooltip: TOOLTIP_OF_PLATFORM[name],
    };
  });
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

const getDatasetNames = (benchmarks: IBenchmark[]): IBenchmarkSettingsDatasetName[] => {
  const datasetNamesArray = benchmarks.map((benchmark) => benchmark.datasets.map((dataset) => dataset.name)).flat();
  const returnDatasetNames: IBenchmarkSettingsDatasetName[] = removeDuplicatesFromArray(datasetNamesArray).map(
    (name, i) => {
      return {
        name,
        isActivated: i === 0 ? true : false,
      };
    },
  );
  return returnDatasetNames;
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

const getDatasetSizesPerName = (benchmarks: IBenchmark[]) => {
  const datasetSizeName = benchmarks.map((benchmark) =>
    benchmark.datasets.map((dataset) => ({ name: dataset.name, size: dataset.size })),
  );

  const datasetSizes: DatasetSizesPerName = { pokec: [], ldbc_bi: [], ldbc_interactive: [] };
  datasetSizeName.forEach((innerArr) => {
    innerArr.forEach((obj) => {
      const { name, size } = obj;
      if (!datasetSizes[name]) {
        datasetSizes[name] = [];
      }
      if (!datasetSizes[name].includes(size)) {
        datasetSizes[name].push(size);
      }
    });
  });
  return datasetSizes;
};

const getWorkloadTypesPerDataset = (benchmarks: IBenchmark[]) => {
  const workloadTypeAndDataset = benchmarks.map((benchmark) =>
    benchmark.datasets.map((dataset) =>
      dataset.workloads.map((workload) => ({ dataset: dataset.name, workload: workload.workloadType })),
    ),
  );

  const workloadTypes: WorkloadTypePerDataset = { pokec: [], ldbc_bi: [], ldbc_interactive: [] };

  workloadTypeAndDataset.forEach((innerArr) => {
    innerArr.forEach((objArr) => {
      objArr.forEach((obj) => {
        const { dataset, workload } = obj;
        if (!workloadTypes[dataset]) {
          workloadTypes[dataset] = [];
        }
        if (!workloadTypes[dataset].includes(workload)) {
          workloadTypes[dataset].push(workload);
        }
      });
    });
  });

  return workloadTypes;
};

const getWorkloadTypesPerCondition = (benchmarks: IBenchmark[]) => {
  const workloadTypeAndCondition = benchmarks.map((benchmark) =>
    benchmark.datasets.map((dataset) =>
      dataset.workloads.map((workload) => ({
        condition: benchmark.runConfig.condition,
        workload: workload.workloadType,
      })),
    ),
  );

  const workloadTypes: WorkloadTypePerCondition = { hot: [], cold: [], vulcanic: [] };

  workloadTypeAndCondition.forEach((innerArr) => {
    innerArr.forEach((objArr) => {
      objArr.forEach((obj) => {
        const { condition, workload } = obj;
        if (!workloadTypes[condition]) {
          workloadTypes[condition] = [];
        }
        if (!workloadTypes[condition].includes(workload)) {
          workloadTypes[condition].push(workload);
        }
      });
    });
  });

  return workloadTypes;
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

export const getQueryCategoriesPerDatasetName = (
  benchmarks: IBenchmark[],
): Record<string, QueryCategoryWithQueries[]> => {
  const queryCategories: Record<string, QueryCategoryWithQueries[]> = {};

  benchmarks.forEach((benchmark) => {
    benchmark.datasets.forEach((dataset) => {
      const datasetName = dataset.name;
      const queries = (
        dataset.workloads.filter((workload) => workload.workloadType !== WorkloadType.REALISTIC) as (
          | IWorkloadIsolated
          | IWorkloadMixed
        )[]
      ).flatMap((workload) => workload.queries);
      let queryCategoriesWithQueries: QueryCategoryWithQueries[] = [];
      queries.forEach((query) => {
        const queryCategoryWithQueriesIndex = queryCategoriesWithQueries.findIndex(
          (category) => category.name === query.category,
        );
        if (queryCategoryWithQueriesIndex < 0) {
          queryCategoriesWithQueries.push({ name: query.category, queries: [query.name] });
        } else {
          queryCategoriesWithQueries[queryCategoryWithQueriesIndex].queries.push(query.name);
        }
      });

      queryCategoriesWithQueries = removeDuplicatesFromArray(queryCategoriesWithQueries);

      if (!queryCategories[datasetName]) {
        queryCategories[datasetName] = queryCategoriesWithQueries;
      } else {
        queryCategories[datasetName].push(...queryCategoriesWithQueries);
      }
    });
  });
  for (const key in queryCategories) {
    if (queryCategories[key]) {
      const reducedQueryCategories = Object.values(
        queryCategories[key].reduce((acc, { name, queries }) => {
          if (!acc[name]) {
            acc[name] = { name, queries: new Set(queries) };
          } else {
            queries.forEach((query) => acc[name].queries.add(query));
          }
          return acc;
        }, {} as Record<string, { name: QueryCategory; queries: Set<string> }>),
      ).map(({ name, queries }) => ({ name, queries: Array.from(queries) }));
      queryCategories[key] = reducedQueryCategories;
    }
  }
  return queryCategories;
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
