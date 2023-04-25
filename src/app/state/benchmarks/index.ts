import * as BenchmarkActions from './benchmarks.actions';
import * as BenchmarkSelectors from './benchmarks.selectors';
import { EntityState } from '../state-entity';
import {
  // DatasetSize,
  Platform,
  IBenchmark,
  QueryCategory,
  RunConfigCondition,
  RunConfigVendor,
  WorkloadType,
  DatasetSize,
  DatasetName,
} from 'src/app/models/benchmark.model';

export { BenchmarkActions, BenchmarkSelectors };

export type BenchmarkEntity = EntityState<any>;

export interface IBenchmarkSetting {
  isActivated: boolean;
  tooltip?: string;
}

export type IBenchmarkSettingsPlatform = {
  name: Platform;
} & IBenchmarkSetting;

export type IBenchmarkSettingsVendor = {
  name: RunConfigVendor;
} & IBenchmarkSetting;

export type IBenchmarkSettingsNumberOfWorkers = {
  size: number;
} & IBenchmarkSetting;

export type IBenchmarkSettingsCondition = {
  name: RunConfigCondition;
} & IBenchmarkSetting;

export type IBenchmarkSettingsWorkloadType = {
  name: WorkloadType;
} & IBenchmarkSetting;

export type IBenchmarkSettingsDatasetName = {
  name: DatasetName;
} & IBenchmarkSetting;

export type IBenchmarkSettingsSize = {
  name: DatasetSize;
} & IBenchmarkSetting;

export type DatasetSizesPerName = Record<DatasetName, DatasetSize[]>;

export type WorkloadTypePerDataset = Record<DatasetName, WorkloadType[]>;

export type WorkloadTypePerCondition = Record<RunConfigCondition, WorkloadType[]>;

export type QueryCategoryPerDataset = Record<string, QueryCategoryWithQueries[]>;

export type IBenchmarkSettingsQueryCategoryQuery = {
  name: string;
} & IBenchmarkSetting;

export interface QueryCategoryWithQueries {
  name: QueryCategory;
  queries: string[];
}

export interface IBenchmarkSettingsQueryCategory {
  name: QueryCategory;
  isActivated: boolean;
  isExpanded: boolean;
  queries: IBenchmarkSettingsQueryCategoryQuery[];
}

export interface IBenchmarkSettingsMaxTimes {
  memory: number;
  throughput: number;
  latency: number;
}

export interface IBenchmarkSettings {
  platforms: IBenchmarkSettingsPlatform[];
  vendors: IBenchmarkSettingsVendor[];
  numberOfWorkers: IBenchmarkSettingsNumberOfWorkers[];
  conditions: IBenchmarkSettingsCondition[];
  workloadTypes: IBenchmarkSettingsWorkloadType[];
  workloadTypesPerDataset: WorkloadTypePerDataset;
  workloadTypesPerCondition: WorkloadTypePerCondition;
  datasetNames: IBenchmarkSettingsDatasetName[];
  datasetSizes: IBenchmarkSettingsSize[];
  datasetSizesPerName: DatasetSizesPerName;
  queryCategories: IBenchmarkSettingsQueryCategory[];
  queryCategoriesPerDataset: QueryCategoryPerDataset;
  maxTimes: IBenchmarkSettingsMaxTimes;
}

export interface BenchmarkState {
  benchmarks: IBenchmark[] | null;
  settings: IBenchmarkSettings | null;
  isSettingsInitialySet: boolean;
}
