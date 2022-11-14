import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil, withLatestFrom } from 'rxjs';
import { DatasetSize, RunConfigCondition, WorkloadType } from '../../models/benchmark.model';
import { Unsubscribe } from '../../services/unsubscribe';
import { AppState } from '../../state';
import {
  BenchmarkActions,
  BenchmarkSelectors,
  IBenchmarkSettingsCondition,
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

          this.setConditionFromParams(params);
          this.setSizeFromParams(params);
          this.setWorkloadTypesFromParams(params);
          this.setQuerySelectionFromParams(params, settings?.queryCategories);
        }
      });

    this.store
      .select(BenchmarkSelectors.selectSettings)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((settings) => {
        const condition = settings?.conditions.find((condition) => condition.isActivated)?.name;
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
          datasetSize,
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

  setConditionFromParams(params: ParamMap) {
    const condition: IBenchmarkSettingsCondition = {
      isActivated: true,
      name: params.get('condition') as RunConfigCondition,
    };
    if (!condition.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateCondition({ condition }));
  }

  setSizeFromParams(params: ParamMap) {
    const size: IBenchmarkSettingsSize = {
      isActivated: true,
      name: params.get('datasetSize') as DatasetSize,
    };
    if (!size.name) {
      return;
    }
    this.store.dispatch(BenchmarkActions.updateDatasetSizes({ size }));
  }

  setWorkloadTypesFromParams(params: ParamMap) {
    const workloadType: IBenchmarkSettingsWorkloadType = {
      isActivated: true,
      name: params.get('workloadType') as WorkloadType,
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
}
