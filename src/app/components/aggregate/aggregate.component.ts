import { Component, Input } from '@angular/core';
import { BehaviorSubject, map, withLatestFrom } from 'rxjs';
import { IBenchmark, isWorkloadRealistic, RunConfigVendor } from '../../models/benchmark.model';
import { filterNullish } from '../../services/filter-nullish';
import _ from 'lodash';
import { AppState } from '../../state';
import { Store } from '@ngrx/store';
import { BenchmarkSelectors } from '../../state/benchmarks';
import { arrayHasDuplicates } from 'src/app/services/remove-duplicates';
import { REPRODUCE_LINK } from '../sidenav/sidenav.component';
import { SegmentService } from 'src/app/services/segment.service';

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
        const throughputArray = vendor.filter((result) => result.throughput !== 0).map((result) => result.throughput);
        const throughputAverage = throughputArray.reduce((a, b) => a + b, 0) / throughputArray.length;
        const memoryArray = vendor.filter((result) => result.memory !== 0).map((result) => result.memory);
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
      const highestMemoryVendor = peakResultPerVendor.reduce((prev, curr) => (prev.memory > curr.memory ? prev : curr));
      const highestThroughputVendor = peakResultPerVendor.reduce((prev, curr) =>
        prev.throughput > curr.throughput ? prev : curr,
      );
      const peakMemoryPerVendorWithRelativeTimes: IAggregateResults[] = peakResultPerVendor.map((result) => {
        const relativeMemory = result.vendor === bestMemoryVendor.vendor ? 1 : result.memory / bestMemoryVendor.memory;
        const relativeThroughput =
          result.vendor === worstThroughputVendor.vendor ? 1 : result.throughput / worstThroughputVendor.throughput;
        let relativeThroughputToMax = 100;
        if (result.vendor !== highestThroughputVendor.vendor) {
          relativeThroughputToMax = 100 / (highestThroughputVendor.throughput / result.throughput);
        }
        if (relativeThroughputToMax < 0.15) {
          relativeThroughputToMax = 0.15;
        }
        let relativeMemoryToMax = 100;
        if (result.vendor !== highestMemoryVendor.vendor) {
          relativeMemoryToMax = 100 / (highestMemoryVendor.memory / result.memory);
        }
        return {
          ...result,
          relativeMemory,
          relativeMemoryToMax,
          relativeThroughput,
          relativeThroughputToMax,
        };
      });
      return peakMemoryPerVendorWithRelativeTimes;
    }),
  );

  reproduceLink = REPRODUCE_LINK;

  constructor(private readonly store: Store<AppState>, private segmentService: SegmentService) {}

  shouldShowDecimal(results: IAggregateResults[], resultsKey: keyof IAggregateResultsRelative) {
    const mappedResults = results.map((result) => Math.floor(result[resultsKey]));
    return arrayHasDuplicates(mappedResults);
  }

  getBackgroundColor(vendor: RunConfigVendor) {
    return backgroundColorByVendor[vendor];
  }

  openLink(url: string) {
    this.segmentService.trackEvent('Link Clicked', { linkUrl: url });
  }
}
