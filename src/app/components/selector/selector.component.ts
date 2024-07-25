import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { RunConfigVendor, WorkloadType } from 'src/app/models/benchmark.model';
import { SegmentService } from 'src/app/services/segment.service';
import { UiMessageType, UiService } from 'src/app/services/ui.service';
import { AppState } from 'src/app/state';
import {
  BenchmarkActions,
  BenchmarkSelectors,
  IBenchmarkSettingsCondition,
  IBenchmarkSettingsDatasetName,
  IBenchmarkSettingsNumberOfWorkers,
  IBenchmarkSettingsPlatform,
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
  @Output() collapseClicked = new EventEmitter<boolean>();
  @Input() isCollapsed: boolean | null = false;

  settings$ = this.store.select(BenchmarkSelectors.selectSettings);

  datasetSizes$ = this.settings$.pipe(
    map((settings) => {
      const activatedDatasetName = settings?.datasetNames.find((datasetName) => datasetName.isActivated)?.name;
      if (!activatedDatasetName) {
        return;
      }
      const availableDatasetSizes = settings.datasetSizesPerName[activatedDatasetName];
      return settings.datasetSizes.filter((datasetSize) => availableDatasetSizes.includes(datasetSize.name));
    }),
  );

  workloadTypes$ = this.settings$.pipe(
    map((settings) => {
      const activatedDatasetName = settings?.datasetNames.find((datasetName) => datasetName.isActivated)?.name;
      const activatedCondition = settings?.conditions.find((condition) => condition.isActivated)?.name;
      if (!activatedDatasetName || !activatedCondition) {
        return;
      }
      const availableWorkloadTypesPerDataset = settings.workloadTypesPerDataset[activatedDatasetName];
      const availableWorkloadTypesPerCondition = settings.workloadTypesPerCondition[activatedCondition];
      return settings.workloadTypes.filter(
        (workloadType) =>
          availableWorkloadTypesPerDataset.includes(workloadType.name) &&
          availableWorkloadTypesPerCondition.includes(workloadType.name),
      );
    }),
  );

  queryCategories$ = this.settings$.pipe(
    map((settings) => {
      const activatedDatasetName = settings?.datasetNames.find((datasetName) => datasetName.isActivated)?.name;
      if (!activatedDatasetName) {
        return;
      }
      const availableQueryCategoryPerDataset = settings.queryCategoriesPerDataset[activatedDatasetName];
      return settings?.queryCategories
        .filter((queryCategory) =>
          availableQueryCategoryPerDataset
            .map((queryCategoryPerDataset) => queryCategoryPerDataset.name)
            .includes(queryCategory.name),
        )
        .map((queryCategory) => {
          const queries = queryCategory.queries.filter((query) =>
            availableQueryCategoryPerDataset
              .find((availableCategory) => availableCategory.name === queryCategory.name)
              ?.queries.includes(query.name),
          );
          return { ...queryCategory, queries };
        });
    }),
  );
  isRealisticActivated$ = this.settings$.pipe(
    map(
      (settings) =>
        !!settings?.workloadTypes.find(
          (workloadType) => workloadType.isActivated && workloadType.name === WorkloadType.REALISTIC,
        ),
    ),
  );

  shouldShowPlatform$ = this.settings$.pipe(
    map((settings) => !!settings?.platforms.find((platform) => !!platform.name)),
  );

  contributeLink = 'https://github.com/memgraph/memgraph/tree/master/tests/mgbench#raised_hands-contributions';

  tooltipByVendor: Record<RunConfigVendor, string> = {
    [RunConfigVendor.MEMGRAPH]: 'Memgraph 2.16',
    [RunConfigVendor.NEO4J]: 'Neo4j Community Edition v5.19',
  };

  constructor(
    private readonly store: Store<AppState>,
    private uiService: UiService,
    private segmentService: SegmentService,
  ) {}

  updateCondition(condition: IBenchmarkSettingsCondition) {
    this.store.dispatch(BenchmarkActions.updateCondition({ condition: { ...condition, isActivated: true } }));
  }

  updateWorker(worker: IBenchmarkSettingsNumberOfWorkers) {
    this.store.dispatch(BenchmarkActions.updateNumberOfWorkers({ numberOfWorkers: { ...worker, isActivated: true } }));
  }

  updatePlatform(platform: IBenchmarkSettingsPlatform) {
    this.store.dispatch(BenchmarkActions.updatePlatform({ platform: { ...platform, isActivated: true } }));
  }

  updateWorkloadType(workloadType: IBenchmarkSettingsWorkloadType) {
    this.store.dispatch(BenchmarkActions.updateWorkloadType({ workloadType: { ...workloadType, isActivated: true } }));
  }

  updateName(datasetNameSetting: IBenchmarkSettingsDatasetName) {
    this.store.dispatch(
      BenchmarkActions.updateDatasetNames({ datasetNameSetting: { ...datasetNameSetting, isActivated: true } }),
    );
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

  collapse(isCollapsed: boolean) {
    this.collapseClicked.next(isCollapsed);
  }

  openLink(url: string) {
    this.segmentService.trackEvent('Link Clicked', { linkUrl: url });
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
