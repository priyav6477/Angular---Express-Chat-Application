import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFriendRequestComponent } from './display-friend-request.component';

describe('DisplayFriendRequestComponent', () => {
  let component: DisplayFriendRequestComponent;
  let fixture: ComponentFixture<DisplayFriendRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayFriendRequestComponent]
    });
    fixture = TestBed.createComponent(DisplayFriendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
