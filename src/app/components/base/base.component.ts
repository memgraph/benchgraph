import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, takeUntil, withLatestFrom } from 'rxjs';
import { DatasetName, DatasetSize, Platform, RunConfigCondition, WorkloadType } from '../../models/benchmark.model';
import { Unsubscribe } from '../../services/unsubscribe';
import { AppState } from '../../state';
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
} from '../../state/benchmarks';

export interface IParamCategory {
  index: number;
  queries: number[];
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent extends Unsubscribe implements OnInit {
  isCollapsed_ = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.isCollapsed_.asObservable();

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(BenchmarkSelectors.selectIsSettingsInitialySet)
      .pipe(takeUntil(this.unsubscribe$), withLatestFrom(this.store.select(BenchmarkSelectors.selectSettings)))
      .subscribe(([isSet, settings]) => {
        if (isSet) {
          const params = this.route.snapshot.queryParamMap;

          this.setPlatformFromParams(params);
          this.setConditionFromParams(params);
          this.setNumberOfWorkersFromParams(params);
          this.setDatasetNameFromParams(params);
          this.setSizeFromParams(params);
          this.setWorkloadTypesFromParams(params);
          this.setQuerySelectionFromParams(params, settings?.queryCategories);
        }
      });

    this.store
      .select(BenchmarkSelectors.selectSettings)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((settings) => {
        const platform = settings?.platforms.find((platform) => platform.isActivated)?.name;
        const condition = settings?.conditions.find((condition) => condition.isActivated)?.name;
        const numberOfWorkers = settings?.numberOfWorkers.find((condition) => condition.isActivated)?.size;
        const datasetName = settings?.datasetNames.find((dataset) => dataset.isActivated)?.name;
        const datasetSize = settings?.datasetSizes.find((dataset) => dataset.isActivated)?.name;
        const workloadType = settings?.workloadTypes.find((workloadType) => workloadType.isActivated)?.name;

        const querySelection: IParamCategory[] = [];
        settings?.queryCategories.forEach((queryCategory, i) => {
          if (queryCategory.isActivated) {
            const queries: number[] = [];
            queryCategory.queries.forEach((query, i) => {
              if (query.isActivated) {
                queries.push(i);
              }
            });
            querySelection.push({ index: i, queries });
          }
        });
        const queryParams: Params = {
          condition,
          numberOfWorkers,
          datasetName,
          datasetSize,
          platform,
          workloadType,
          querySelection: JSON.stringify(querySelection),
        };
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge',
        });
      });
  }

  setPlatformFromParams(params: ParamMap) {
    const platform: IBenchmarkSettingsPlatform = {
      isActivated: true,
      name: (params.get('platform') as Platform) ?? Platform.INTEL,
    };
    if (!platform.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updatePlatform({ platform }));
  }

  setConditionFromParams(params: ParamMap) {
    const condition: IBenchmarkSettingsCondition = {
      isActivated: true,
      name: (params.get('condition') as RunConfigCondition) ?? RunConfigCondition.COLD,
    };
    if (!condition.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateCondition({ condition }));
  }

  setNumberOfWorkersFromParams(params: ParamMap) {
    const numberOfWorkers: IBenchmarkSettingsNumberOfWorkers = {
      isActivated: true,
      size: Number(params.get('numberOfWorkers')),
    };
    if (!numberOfWorkers.size) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateNumberOfWorkers({ numberOfWorkers }));
  }

  setDatasetNameFromParams(params: ParamMap) {
    const datasetNameSetting: IBenchmarkSettingsDatasetName = {
      isActivated: true,
      name: (params.get('datasetName') as DatasetName) ?? DatasetName.POKEC,
    };
    if (!datasetNameSetting.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateDatasetNames({ datasetNameSetting }));
  }

  setSizeFromParams(params: ParamMap) {
    const size: IBenchmarkSettingsSize = {
      isActivated: true,
      name: (params.get('datasetSize') as DatasetSize) ?? DatasetSize.SMALL,
    };
    if (!size.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateDatasetSizes({ size }));
  }

  setWorkloadTypesFromParams(params: ParamMap) {
    const workloadType: IBenchmarkSettingsWorkloadType = {
      isActivated: true,
      name: (params.get('workloadType') as WorkloadType) ?? WorkloadType.ISOLATED,
    };
    if (!workloadType.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateWorkloadType({ workloadType }));
  }

  setQuerySelectionFromParams(params: ParamMap, queryCategories: IBenchmarkSettingsQueryCategory[] | undefined) {
    const paramCategories = params.get('querySelection');
    if (!paramCategories) {
      return;
    }
    const parsedParamCategories: IParamCategory[] = JSON.parse(paramCategories);
    queryCategories?.forEach((queryCategory, i) => {
      const categoryFromParam = parsedParamCategories.find((category) => category.index === i);
      const queries: IBenchmarkSettingsQueryCategoryQuery[] = queryCategory.queries.map((query, j) => {
        const queryFromParam = categoryFromParam?.queries.find((query) => query === j);
        const isIndexZero = queryFromParam === 0;
        const isCategoryDisabled = !!categoryFromParam;
        const isActivated = isIndexZero || !isCategoryDisabled || !!queryFromParam;
        return {
          ...query,
          isActivated,
        };
      });
      this.store.dispatch(
        BenchmarkActions.updateCategory({
          category: { ...queryCategory, isActivated: !!categoryFromParam, queries: queries ?? queryCategory.queries },
        }),
      );
    });
  }

  collapseClicked(isCollapsed: boolean) {
    this.isCollapsed_.next(isCollapsed);
  }
}
