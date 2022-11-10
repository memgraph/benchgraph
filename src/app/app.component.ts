import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './state';
import { BenchmarkActions } from './state/benchmarks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store<AppState>, private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(BenchmarkActions.getBenchmarks());
  }
}
