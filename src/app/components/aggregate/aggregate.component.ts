import { Component, Input } from '@angular/core';
import { BehaviorSubject, map, withLatestFrom } from 'rxjs';
import { IBenchmark, isWorkloadRealistic, RunConfigVendor } from '../../models/benchmark.model';
import { filterNullish } from '../../services/filter-nullish';
import _ from 'lodash';
import { AppState } from '../../state';
import { Store } from '@ngrx/store';
import { BenchmarkSelectors } from '../../state/benchmarks';
import { arrayHasDuplicates } from 'src/app/services/remove-duplicates';

export interface IAggregateResultsAbsolute {
  vendor: RunConfigVendor;
  memory: number;
  throughput: number;
}

export type IAggregateResultsRelative = {
  relativeMemory: number;
  relativeMemoryToMax: number;
  relativeThroughput: number;
  relativeThroughputToMax: number;
};

export type IAggregateResults = IAggregateResultsAbsolute & IAggregateResultsRelative;

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
      const allResultsByVendor: IAggregateResultsAbsolute[] = benchmarks
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
      if (allResultsByVendor.length < 1) {
        return;
      }
      const groupedResults = _.groupBy(allResultsByVendor, 'vendor');
      const groupedResultsObject = Object.values(groupedResults);
      const peakResultPerVendor: IAggregateResultsAbsolute[] = groupedResultsObject.map((vendor) => {
        const throughputArray = vendor.map((result) => result.throughput);
        const throughputAverage = throughputArray.reduce((a, b) => a + b, 0) / throughputArray.length;
        const memoryArray = vendor.map((result) => result.memory);
        const memoryAverage = memoryArray.reduce((a, b) => a + b, 0) / memoryArray.length;
        return {
          vendor: vendor[0].vendor,
          memory: memoryAverage,
          throughput: throughputAverage,
        };
      });
      const bestMemoryVendor = peakResultPerVendor.reduce((prev, curr) => (prev.memory < curr.memory ? prev : curr));
      const worstThroughputVendor = peakResultPerVendor.reduce((prev, curr) =>
        prev.throughput < curr.throughput ? prev : curr,
      );
      const peakMemoryPerVendorWithRelativeTimes: IAggregateResults[] = peakResultPerVendor.map((result) => ({
        ...result,
        relativeMemory: result.vendor === bestMemoryVendor.vendor ? 1 : result.memory / bestMemoryVendor.memory,
        relativeMemoryToMax: settings?.maxTimes.memory ? (result.memory / settings?.maxTimes.memory) * 100 : 100,
        relativeThroughput:
          result.vendor === worstThroughputVendor.vendor ? 1 : result.throughput / worstThroughputVendor.throughput,
        relativeThroughputToMax: settings?.maxTimes.throughput
          ? (result.throughput / settings?.maxTimes.throughput) * 100
          : 100,
      }));
      return peakMemoryPerVendorWithRelativeTimes;
    }),
  );

  constructor(private readonly store: Store<AppState>) {}

  shouldShowDecimal(results: IAggregateResults[], resultsKey: keyof IAggregateResultsRelative) {
    const mappedResults = results.map((result) => Math.floor(result[resultsKey]));
    return arrayHasDuplicates(mappedResults);
  }

  getBackgroundColor(vendor: RunConfigVendor) {
    return backgroundColorByVendor[vendor];
  }
}
