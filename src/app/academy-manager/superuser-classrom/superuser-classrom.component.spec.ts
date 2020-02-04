import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperuserClassromComponent } from './superuser-classrom.component';

describe('SuperuserClassromComponent', () => {
  let component: SuperuserClassromComponent;
  let fixture: ComponentFixture<SuperuserClassromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperuserClassromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperuserClassromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
