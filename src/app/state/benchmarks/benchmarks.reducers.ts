import { createReducer, on } from '@ngrx/store';
import { IBenchmark } from 'src/app/models/benchmark.model';
import { BenchmarkActions, BenchmarkState } from '.';
import { getQueryCategories } from './benchmarks.effects';

const initialState: BenchmarkState = {
  benchmarks: null,
  settings: null,
  isSettingsInitialySet: false,
};

const _benchmarksReducer = createReducer(
  initialState,

  on(BenchmarkActions.setBenchmarks, (state, { benchmarks }) => ({
    ...state,
    benchmarks: benchmarks,
  })),

  on(BenchmarkActions.setSettings, (state, { settings }) => ({
    ...state,
    settings: settings,
    isSettingsInitialySet: true,
  })),

  on(BenchmarkActions.updateCondition, (state, { condition }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        conditions: state.settings.conditions.map((stateCondition) => {
          if (condition.name === stateCondition.name) {
            return {
              ...stateCondition,
              isActivated: condition.isActivated,
            };
          }
          return {
            ...stateCondition,
            isActivated: !condition.isActivated,
          };
        }),
      },
    };
  }),

  on(BenchmarkActions.updatePlatform, (state, { platform }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        platforms: state.settings.platforms.map((statePlatforme) => {
          if (platform.name === statePlatforme.name) {
            return {
              ...statePlatforme,
              isActivated: platform.isActivated,
            };
          }
          return {
            ...statePlatforme,
            isActivated: !platform.isActivated,
          };
        }),
      },
    };
  }),

  on(BenchmarkActions.updateWorkloadType, (state, { workloadType }) => {
    if (!state.settings) {
      return state;
    }
    const benchmarkByWorkloadType = state.benchmarks?.map((benchmark) => ({
      ...benchmark,
      datasets: benchmark.datasets.map((dataset) => ({
        ...dataset,
        workloads: dataset.workloads.filter((workload) => workload.workloadType === workloadType.name),
      })),
    })) as IBenchmark[] | undefined;
    return {
      ...state,
      settings: {
        ...state.settings,
        workloadTypes: state.settings.workloadTypes.map((stateWorkloadType) => {
          if (workloadType.name === stateWorkloadType.name) {
            return {
              ...stateWorkloadType,
              isActivated: workloadType.isActivated,
            };
          }
          return {
            ...stateWorkloadType,
            isActivated: !workloadType.isActivated,
          };
        }),
        queryCategories: benchmarkByWorkloadType
          ? getQueryCategories(benchmarkByWorkloadType)
          : state.settings.queryCategories,
      },
    };
  }),

  on(BenchmarkActions.updateVendor, (state, { vendor }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        vondors: state.settings.vendors.map((stateVendor) => {
          if (vendor.name === stateVendor.name) {
            return {
              ...stateVendor,
              isActivated: vendor.isActivated,
            };
          }
          return stateVendor;
        }),
      },
    };
  }),

  on(BenchmarkActions.updateNumberOfWorkers, (state, { numberOfWorkers }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        numberOfWorkers: numberOfWorkers
          ? state.settings.numberOfWorkers.map((stateNumberOfWorkers) => {
              if (numberOfWorkers.size === stateNumberOfWorkers.size) {
                return {
                  ...stateNumberOfWorkers,
                  isActivated: numberOfWorkers.isActivated,
                };
              }
              return {
                ...stateNumberOfWorkers,
                isActivated: !numberOfWorkers.isActivated,
              };
            })
          : state.settings.numberOfWorkers.some((stateNumberOfWorkers) => stateNumberOfWorkers.size === 24)
          ? state.settings.numberOfWorkers.map((stateNumberOfWorkers) => {
              if (stateNumberOfWorkers.size === 24) {
                return {
                  ...stateNumberOfWorkers,
                  isActivated: true,
                };
              }
              return {
                ...stateNumberOfWorkers,
                isActivated: false,
              };
            })
          : state.settings.numberOfWorkers,
      },
    };
  }),

  on(BenchmarkActions.updateDatasetSizes, (state, { size }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        datasetSizes: state.settings.datasetSizes.map((stateSize) => {
          if (size.name === stateSize.name) {
            return {
              ...stateSize,
              isActivated: size.isActivated,
            };
          }
          return {
            ...stateSize,
            isActivated: !size.isActivated,
          };
        }),
      },
    };
  }),

  on(BenchmarkActions.updateDatasetNames, (state, { datasetNameSetting }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        datasetNames: state.settings.datasetNames.map((stateName) => {
          if (datasetNameSetting.name === stateName.name) {
            return {
              ...stateName,
              isActivated: datasetNameSetting.isActivated,
            };
          }
          return {
            ...stateName,
            isActivated: !datasetNameSetting.isActivated,
          };
        }),
      },
    };
  }),

  on(BenchmarkActions.updateCategory, (state, { category, isExpanded }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        queryCategories: state.settings.queryCategories.map((stateCategory) => {
          if (category.name === stateCategory.name) {
            if (isExpanded !== undefined) {
              return {
                ...stateCategory,
                isExpanded: !isExpanded,
              };
            }
            return {
              ...category,
              isActivated: category.isActivated,
            };
          }
          return stateCategory;
        }),
      },
    };
  }),

  on(BenchmarkActions.updateQuery, (state, { category, query }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        queryCategories: state.settings.queryCategories.map((stateCategory) => {
          if (category.name === stateCategory.name) {
            return {
              ...stateCategory,
              queries: stateCategory.queries.map((stateQuery) => {
                if (stateQuery.name === query.name) {
                  return {
                    ...query,
                    isActivated: query.isActivated,
                  };
                }
                return stateQuery;
              }),
            };
          }
          return stateCategory;
        }),
      },
    };
  }),
);

export function benchmarksReducer(state = initialState, action: any): BenchmarkState {
  return _benchmarksReducer(state, action);
}
