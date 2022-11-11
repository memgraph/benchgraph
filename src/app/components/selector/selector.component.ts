import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { WorkloadType } from 'src/app/models/benchmark.model';
import { AppState } from 'src/app/state';
import {
  BenchmarkActions,
  BenchmarkSelectors,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsQueryCategory,
  IBenchmarkSettingsQueryCategoryQuery,
  IBenchmarkSettingsSize,
  IBenchmarkSettingsWorkloadType,
} from 'src/app/state/benchmarks';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent {
  settings$ = this.store.select(BenchmarkSelectors.selectSettings);
  isRealisticActivated$ = this.settings$.pipe(
    map(
      (settings) =>
        !!settings?.workloadTypes.find(
          (workloadType) => workloadType.isActivated && workloadType.name === WorkloadType.REALISTIC,
        ),
    ),
  );

  constructor(private readonly store: Store<AppState>) {}

  updateCondition(condition: IBenchmarkSettingsCondition) {
    this.store.dispatch(BenchmarkActions.updateCondition({ condition: { ...condition, isActivated: true } }));
  }

  updateWorkloadType(workloadType: IBenchmarkSettingsWorkloadType) {
    this.store.dispatch(BenchmarkActions.updateWorkloadType({ workloadType: { ...workloadType, isActivated: true } }));
  }

  updateSize(size: IBenchmarkSettingsSize) {
    this.store.dispatch(BenchmarkActions.updateDatasetSizes({ size: { ...size, isActivated: true } }));
  }

  updateCategory(category: IBenchmarkSettingsQueryCategory, isExpanded?: boolean) {
    this.store.dispatch(
      BenchmarkActions.updateCategory({ category: { ...category, isActivated: !category.isActivated }, isExpanded }),
    );
  }

  updateQuery(category: IBenchmarkSettingsQueryCategory, query: IBenchmarkSettingsQueryCategoryQuery) {
    this.store.dispatch(
      BenchmarkActions.updateQuery({ category, query: { ...query, isActivated: !query.isActivated } }),
    );
  }
}
