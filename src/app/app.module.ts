import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SelectorComponent } from './components/selector/selector.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UtilService } from './services/util.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './state';
import { EffectsModule } from '@ngrx/effects';
import { BenchmarksEffects } from './state/benchmarks/benchmarks.effects';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { GlobalComponent } from './components/global/global.component';
import { DetailedComponent } from './components/detailed/detailed.component';
import { BaseComponent } from './components/base/base.component';
import { TooltipIconComponent } from './components/tooltip-icon/tooltip-icon.component';
import { UiService } from './services/ui.service';
import { UiMessagesComponent } from './components/ui-messages/ui-messages.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    SelectorComponent,
    OverviewComponent,
    AggregateComponent,
    GlobalComponent,
    DetailedComponent,
    BaseComponent,
    TooltipIconComponent,
    UiMessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([BenchmarksEffects]),
  ],
  providers: [UtilService, UiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
