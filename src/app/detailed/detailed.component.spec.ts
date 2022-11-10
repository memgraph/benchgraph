import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedComponent } from './detailed.component';

describe('DetailedComponent', () => {
  let component: DetailedComponent;
  let fixture: ComponentFixture<DetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
