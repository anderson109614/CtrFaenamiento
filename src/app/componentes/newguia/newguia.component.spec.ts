import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewguiaComponent } from './newguia.component';

describe('NewguiaComponent', () => {
  let component: NewguiaComponent;
  let fixture: ComponentFixture<NewguiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewguiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewguiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
