import * as BenchmarkActions from './benchmarks.actions';
import * as BenchmarkSelectors from './benchmarks.selectors';
import { EntityState } from '../state-entity';
import {
  DatasetSize,
  HardwareAlias,
  IBenchmark,
  QueryCategory,
  RunConfigCondition,
  RunConfigVendor,
  WorkloadType,
} from 'src/app/models/benchmark.model';

export { BenchmarkActions, BenchmarkSelectors };

export type BenchmarkEntity = EntityState<any>;

export interface IBenchmarkSetting {
  isActivated: boolean;
  tooltip?: string;
}

export type IBenchmarkSettingsHardwareAlias = {
  name: HardwareAlias;
} & IBenchmarkSetting;

export type IBenchmarkSettingsVendor = {
  name: RunConfigVendor;
} & IBenchmarkSetting;

export type IBenchmarkSettingsCondition = {
  name: RunConfigCondition;
} & IBenchmarkSetting;

export type IBenchmarkSettingsWorkloadType = {
  name: WorkloadType;
} & IBenchmarkSetting;

export type IBenchmarkSettingsSize = {
  name: DatasetSize;
} & IBenchmarkSetting;

export type IBenchmarkSettingsQueryCategoryQuery = {
  name: string;
} & IBenchmarkSetting;

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
  hardwareAliases: IBenchmarkSettingsHardwareAlias[];
  vendors: IBenchmarkSettingsVendor[];
  conditions: IBenchmarkSettingsCondition[];
  workloadTypes: IBenchmarkSettingsWorkloadType[];
  datasetSizes: IBenchmarkSettingsSize[];
  queryCategories: IBenchmarkSettingsQueryCategory[];
  maxTimes: IBenchmarkSettingsMaxTimes;
}

export interface BenchmarkState {
  benchmarks: IBenchmark[] | null;
  settings: IBenchmarkSettings | null;
  isSettingsInitialySet: boolean;
}
