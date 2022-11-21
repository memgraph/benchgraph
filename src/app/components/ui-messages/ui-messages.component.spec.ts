import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiService } from 'src/app/core/services/ui.service';

import { UiMessagesComponent } from './ui-messages.component';

describe('UiMessagesComponent', () => {
  let component: UiMessagesComponent;
  let fixture: ComponentFixture<UiMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UiMessagesComponent],
      providers: [UiService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
