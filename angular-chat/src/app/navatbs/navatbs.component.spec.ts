import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavatbsComponent } from './navatbs.component';

describe('NavatbsComponent', () => {
  let component: NavatbsComponent;
  let fixture: ComponentFixture<NavatbsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavatbsComponent]
    });
    fixture = TestBed.createComponent(NavatbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
