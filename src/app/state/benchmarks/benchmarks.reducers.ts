import { createReducer, on } from '@ngrx/store';
import { BenchmarkActions, BenchmarkState } from '.';

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

  on(BenchmarkActions.updateHardwareAlias, (state, { hardwareAlias }) => {
    if (!state.settings) {
      return state;
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        hardwareAliases: state.settings.hardwareAliases.map((stateHardwareAliase) => {
          if (hardwareAlias.name === stateHardwareAliase.name) {
            return {
              ...stateHardwareAliase,
              isActivated: hardwareAlias.isActivated,
            };
          }
          return {
            ...stateHardwareAliase,
            isActivated: !hardwareAlias.isActivated,
          };
        }),
      },
    };
  }),

  on(BenchmarkActions.updateWorkloadType, (state, { workloadType }) => {
    if (!state.settings) {
      return state;
    }
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
