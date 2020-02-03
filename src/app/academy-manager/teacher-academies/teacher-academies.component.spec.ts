import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAcademiesComponent } from './teacher-academies.component';

describe('TeacherAcademiesComponent', () => {
  let component: TeacherAcademiesComponent;
  let fixture: ComponentFixture<TeacherAcademiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherAcademiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAcademiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
