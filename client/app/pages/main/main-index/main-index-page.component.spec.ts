import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIndexPage } from './main-index-page.component';

describe('MainIndexPage', () => {
  let component: MainIndexPage;
  let fixture: ComponentFixture<MainIndexPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainIndexPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
