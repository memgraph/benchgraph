import { Component, Input } from '@angular/core';
import { BehaviorSubject, map, withLatestFrom } from 'rxjs';
import { IBenchmark, isWorkloadRealistic, RunConfigVendor } from '../models/benchmark.model';
import { filterNullish } from '../services/filter-nullish';
import _ from 'lodash';
import { AppState } from '../state';
import { Store } from '@ngrx/store';
import { BenchmarkSelectors } from '../state/benchmarks';

export interface IAggregateResults {
  vendor: RunConfigVendor;
  memory: number;
  throughput: number;
}

export type IAggregateResultsRelative = {
  relativeMemory: number;
  relativeMemoryToMax: number;
  relativeThroughput: number;
  relativeThroughputToMax: number;
} & IAggregateResults;

const backgroundColorByVendor: Record<RunConfigVendor, string> = {
  [RunConfigVendor.MEMGRAPH]: '#FDAE70',
  [RunConfigVendor.NEO4J]: '#231F20',
};

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss'],
})
export class AggregateComponent {
  private presentedBenchmarks_ = new BehaviorSubject<IBenchmark[] | null | undefined>(undefined);
  presentedBenchmarks$ = this.presentedBenchmarks_.pipe(filterNullish());
  @Input() set presentedBenchmarks(value: IBenchmark[] | null | undefined) {
    this.presentedBenchmarks_.next(value);
  }

  aggregateResults$ = this.presentedBenchmarks$.pipe(
    withLatestFrom(this.store.select(BenchmarkSelectors.selectSettings)),
    map(([benchmarks, settings]) => {
      const allResultsByVendor: IAggregateResults[] = benchmarks
        .map((benchmark) =>
          benchmark.datasets.map((datasets) =>
            datasets.workloads.map((workload) => {
              if (isWorkloadRealistic(workload)) {
                return {
                  vendor: benchmark.runConfig.vendor,
                  memory: workload.stats.database.memory,
                  throughput: workload.stats.throughput,
                };
              }
              return workload.queries.map((query) => ({
                vendor: benchmark.runConfig.vendor,
                memory: query.stats.database.memory,
                throughput: query.stats.throughput,
              }));
            }),
          ),
        )
        .flat(3);
      const groupedResults = _.groupBy(allResultsByVendor, 'vendor');
      const groupedResultsObject = Object.values(groupedResults);
      const peakResultPerVendor: IAggregateResults[] = groupedResultsObject.map((vendor) => {
        const throughputArray = vendor.map((result) => result.throughput);
        const throughputAverage = throughputArray.reduce((a, b) => a + b, 0) / throughputArray.length;
        return {
          vendor: vendor[0].vendor,
          memory: Math.min(...vendor.map((result) => result.memory)),
          throughput: throughputAverage,
        };
      });
      const bestMemoryVendor = peakResultPerVendor.reduce((prev, curr) => (prev.memory < curr.memory ? prev : curr));
      const bestThroughputVendor = peakResultPerVendor.reduce((prev, curr) =>
        prev.throughput > curr.throughput ? prev : curr,
      );
      const peakMemoryPerVendorWithRelativeTimes: IAggregateResultsRelative[] = peakResultPerVendor.map((result) => ({
        ...result,
        relativeMemory: result.vendor === bestMemoryVendor.vendor ? 1 : result.memory / bestMemoryVendor.memory,
        relativeMemoryToMax: settings?.maxTimes.memory ? (result.memory / settings?.maxTimes.memory) * 100 : 100,
        relativeThroughput:
          result.vendor === bestThroughputVendor.vendor ? 1 : result.throughput / bestThroughputVendor.throughput,
        relativeThroughputToMax: settings?.maxTimes.throughput
          ? (result.throughput / settings?.maxTimes.throughput) * 100
          : 100,
      }));
      return peakMemoryPerVendorWithRelativeTimes;
    }),
  );

  constructor(private readonly store: Store<AppState>) {}

  getBackgroundColor(vendor: RunConfigVendor) {
    return backgroundColorByVendor[vendor];
  }
}
