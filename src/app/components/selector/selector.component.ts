import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { WorkloadType } from 'src/app/models/benchmark.model';
import { UiMessageType, UiService } from 'src/app/services/ui.service';
import { AppState } from 'src/app/state';
import {
  BenchmarkActions,
  BenchmarkSelectors,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsHardwareAlias,
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

  shouldShowHardwareAlias$ = this.settings$.pipe(
    map((settings) => !!settings?.hardwareAliases.find((hardwareAlias) => !!hardwareAlias.name)),
  );

  constructor(private readonly store: Store<AppState>, private uiService: UiService) {}

  updateCondition(condition: IBenchmarkSettingsCondition) {
    this.store.dispatch(BenchmarkActions.updateCondition({ condition: { ...condition, isActivated: true } }));
  }

  updateHardwareAlias(hardwareAlias: IBenchmarkSettingsHardwareAlias) {
    this.store.dispatch(
      BenchmarkActions.updateHardwareAlias({ hardwareAlias: { ...hardwareAlias, isActivated: true } }),
    );
  }

  updateWorkloadType(workloadType: IBenchmarkSettingsWorkloadType) {
    this.store.dispatch(BenchmarkActions.updateWorkloadType({ workloadType: { ...workloadType, isActivated: true } }));
  }

  updateSize(size: IBenchmarkSettingsSize) {
    this.store.dispatch(BenchmarkActions.updateDatasetSizes({ size: { ...size, isActivated: true } }));
  }

  updateCategory(
    category: IBenchmarkSettingsQueryCategory,
    categories: IBenchmarkSettingsQueryCategory[],
    isExpanded?: boolean,
  ) {
    if (category.isActivated && !isOneOtherCategoryActivated(categories, category) && isExpanded === undefined) {
      this.uiService.addMessage({ message: 'Atleast one query must be activated', type: UiMessageType.Warning });
      return;
    }
    this.store.dispatch(
      BenchmarkActions.updateCategory({ category: { ...category, isActivated: !category.isActivated }, isExpanded }),
    );
  }

  updateQuery(
    category: IBenchmarkSettingsQueryCategory,
    query: IBenchmarkSettingsQueryCategoryQuery,
    categories: IBenchmarkSettingsQueryCategory[],
  ) {
    if (category.isActivated && !isOneOtherQueryActivated(categories, query)) {
      this.uiService.addMessage({ message: 'Atleast one query must be activated', type: UiMessageType.Warning });
      return;
    }
    this.store.dispatch(
      BenchmarkActions.updateQuery({ category, query: { ...query, isActivated: !query.isActivated } }),
    );
  }
}

export const isOneOtherCategoryActivated = (
  categories: IBenchmarkSettingsQueryCategory[],
  currentCategory: IBenchmarkSettingsQueryCategory,
): boolean => {
  return !!categories.find(
    (category) =>
      category.name !== currentCategory.name &&
      category.isActivated &&
      category.queries.some((query) => query.isActivated),
  );
};

export const isOneOtherQueryActivated = (
  categories: IBenchmarkSettingsQueryCategory[],
  currentQuery: IBenchmarkSettingsQueryCategoryQuery,
): boolean => {
  return !!categories.find(
    (category) =>
      category.isActivated && category.queries.some((query) => query.name !== currentQuery.name && query.isActivated),
  );
};
