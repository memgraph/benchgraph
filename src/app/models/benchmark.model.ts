// vendor, condition, platform, workers, datasetName, datasetSize, workloadType
// numberWorkers: 24, 48, 96, 192 // bolje dinamicki
// condition: hot, cold, vulcanic
// platform: AMD, INTEL
// datasetsName: ldbc_interactive (samo isolated), ldbc_bi (samo isolated), pokec

export interface IBenchmarks {
  benchmarks: IBenchmark[];
}

export interface IBenchmark {
  runConfig: {
    vendor: RunConfigVendor;
    condition: RunConfigCondition;
    platform: Platform;
    numberWorkers: number;
  };
  datasets: {
    name: DatasetName;
    size: DatasetSize;
    workloads: IWorkload[];
  }[];
}

export interface IWorkloadIsolated {
  workloadType: WorkloadType.ISOLATED;
  queries: IQueryIsolated[];
}

export interface IQueryIsolated {
  name: string;
  category: QueryCategory;
  stats: IStatsWithQuery;
}

export function isWorkloadIsolated(workload: IWorkload): workload is IWorkloadIsolated {
  return workload.workloadType === WorkloadType.ISOLATED;
}

export function isQueryIsolated(query: IWorkloadQuery): query is IQueryIsolated {
  return 'queryStatistics' in query.stats;
}

export interface IWorkloadMixed {
  workloadType: WorkloadType.MIXED;
  queries: IQueryMixed[];
  percentages: IPercentages;
}

export interface IQueryMixed {
  name: string;
  category: QueryCategory;
  stats: IStats;
}

export function isWorkloadMixed(workload: IWorkload): workload is IWorkloadMixed {
  return workload.workloadType === WorkloadType.MIXED;
}

export function isQueryMixed(query: IWorkloadQuery): query is IQueryMixed {
  return !('queryStatistics' in query.stats);
}

export interface IWorkloadRealistic {
  workloadType: WorkloadType.REALISTIC;
  percentages: IPercentages;
  stats: IStats;
}

export function isWorkloadRealistic(workload: IWorkload): workload is IWorkloadRealistic {
  return workload.workloadType === WorkloadType.REALISTIC;
}

export type IWorkload = IWorkloadIsolated | IWorkloadMixed | IWorkloadRealistic;
export type IWorkloadQuery = IQueryIsolated | IQueryMixed;

export interface IPercentages {
  numOfQueries: number; // 1000
  writePerc: number; // 10
  readPerc: number; // 20
  updatePerc: number; // 10
  analyticalPerc: number; // 50
  queryPerc: number; // 10
}

export interface IStats {
  executedQueries: number; // Number of executed queries
  duration: number; // Total execution time
  numWorkers: number;
  retries: number;
  throughput: number;
  database: {
    cpu: number; // Seconds
    memory: number; // Bytes
  };
}

export interface IQueryStatistics {
  iterations: number;
  min: number;
  max: number;
  mean: number;
  p99: number;
  p95: number;
  p90: number;
  p75: number;
  p50: number;
}

export type IStatsWithQuery = IStats & { queryStatistics: IQueryStatistics };

export enum RunConfigVendor {
  MEMGRAPH = 'Memgraph',
  NEO4J = 'Neo4j',
}

export enum RunConfigCondition {
  HOT = 'hot',
  COLD = 'cold',
  VULCANIC = 'vulcanic',
}

export enum Platform {
  AMD = 'AMD',
  INTEL = 'INTEL',
}

export enum DatasetSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  SF_1 = 'sf1',
  SF_01 = 'sf0.1',
}

export enum DatasetName {
  POKEC = 'pokec',
  LDBC_BI = 'ldbc_bi',
  LDBC_INTERACTIVE = 'ldbc_interactive',
}

export enum WorkloadType {
  ISOLATED = 'isolated',
  MIXED = 'mixed',
  REALISTIC = 'realistic',
}

export enum QueryCategory {
  READ = 'read',
  WRITE = 'write',
  AGGREGATE = 'aggregate',
  ANALYTICAL = 'analytical',
  UPDATE = 'update',
}
