import * as BenchmarkActions from './benchmarks.actions';
import * as BenchmarkSelectors from './benchmarks.selectors';
import { EntityState } from '../state-entity';
import {
  DatasetSize,
  IBenchmark,
  QueryCategory,
  RunConfigCondition,
  RunConfigVendor,
  WorkloadType,
} from 'src/app/models/benchmark.model';

export { BenchmarkActions, BenchmarkSelectors };

export type BenchmarkEntity = EntityState<any>;

export interface IBenchmarkSettingsVendor {
  name: RunConfigVendor;
  isActivated: boolean;
}

export interface IBenchmarkSettingsCondition {
  name: RunConfigCondition;
  isActivated: boolean;
}

export interface IBenchmarkSettingsWorkloadType {
  name: WorkloadType;
  isActivated: boolean;
}

export interface IBenchmarkSettingsSize {
  name: DatasetSize;
  isActivated: boolean;
}

export interface IBenchmarkSettingsQueryCategoryQuery {
  name: string;
  isActivated: boolean;
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
