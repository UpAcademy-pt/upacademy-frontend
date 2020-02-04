import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAcademyComponent } from './teacher-academy.component';

describe('TeacherAcademyComponent', () => {
  let component: TeacherAcademyComponent;
  let fixture: ComponentFixture<TeacherAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
