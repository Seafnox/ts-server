import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelUnitComponent } from './model-unit.component';

describe('ModelUnitComponent', () => {
  let component: ModelUnitComponent;
  let fixture: ComponentFixture<ModelUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
