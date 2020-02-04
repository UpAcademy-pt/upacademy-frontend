import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyViewComponent } from './academy-view.component';

describe('AcademyViewComponent', () => {
  let component: AcademyViewComponent;
  let fixture: ComponentFixture<AcademyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
