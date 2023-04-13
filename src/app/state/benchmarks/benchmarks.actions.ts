import { createAction, props } from '@ngrx/store';
import { IBenchmark } from 'src/app/models/benchmark.model';
import {
  IBenchmarkSettings,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsDatasetName,
  IBenchmarkSettingsNumberOfWorkers,
  IBenchmarkSettingsPlatform,
  IBenchmarkSettingsQueryCategory,
  IBenchmarkSettingsQueryCategoryQuery,
  IBenchmarkSettingsSize,
  IBenchmarkSettingsVendor,
  IBenchmarkSettingsWorkloadType,
} from '.';

export const getBenchmarks = createAction('[Benchmarks] Get Benchmarks');
export const setBenchmarks = createAction('[Benchmarks] Set Benchmarks', props<{ benchmarks: IBenchmark[] }>());
export const setSettings = createAction('[Benchmarks] Set Settings', props<{ settings: IBenchmarkSettings }>());
export const updateCondition = createAction(
  '[Benchmarks] Update Condition',
  props<{ condition: IBenchmarkSettingsCondition }>(),
);
export const updatePlatform = createAction(
  '[Benchmarks] Update Platform',
  props<{ platform: IBenchmarkSettingsPlatform }>(),
);
export const updateWorkloadType = createAction(
  '[Benchmarks] Update Workload Type',
  props<{ workloadType: IBenchmarkSettingsWorkloadType }>(),
);
export const updateVendor = createAction('[Benchmarks] Update Vendor', props<{ vendor: IBenchmarkSettingsVendor }>());

export const updateNumberOfWorkers = createAction(
  '[Benchmarks] Update Number of Workers',
  props<{ numberOfWorkers: IBenchmarkSettingsNumberOfWorkers }>(),
);

export const updateDatasetNames = createAction(
  '[Benchmarks] Update Dataset Name',
  props<{ datasetNameSetting: IBenchmarkSettingsDatasetName }>(),
);

export const updateDatasetSizes = createAction('[Benchmarks] Update Size', props<{ size: IBenchmarkSettingsSize }>());

export const updateCategory = createAction(
  '[Benchmarks] Update Category',
  props<{ category: IBenchmarkSettingsQueryCategory; isExpanded?: boolean }>(),
);

export const updateQuery = createAction(
  '[Benchmarks] Update Query',
  props<{ category: IBenchmarkSettingsQueryCategory; query: IBenchmarkSettingsQueryCategoryQuery }>(),
);
