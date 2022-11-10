import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { BenchmarkState } from './benchmarks';
import { benchmarksReducer } from './benchmarks/benchmarks.reducers';

export interface AppState {
  benchmarks: BenchmarkState;
}

export const reducers: ActionReducerMap<AppState> = {
  benchmarks: benchmarksReducer,
};

export const reducerToken = new InjectionToken<ActionReducerMap<AppState>>('Reducers');

export const reducerProvider = [{ provide: reducerToken, useValue: reducers }];
