import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BenchmarkState } from '.';

export const benchmarkFeatureKey = 'benchmarks';

export const selectBenchmarksState = createFeatureSelector<BenchmarkState>(benchmarkFeatureKey);

export const selectBenchmarks = createSelector(selectBenchmarksState, (state: BenchmarkState) => state.benchmarks);
export const selectSettings = createSelector(selectBenchmarksState, (state: BenchmarkState) => state.settings);
export const selectIsSettingsInitialySet = createSelector(
  selectBenchmarksState,
  (state: BenchmarkState) => state.isSettingsInitialySet,
);
