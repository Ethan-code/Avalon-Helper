import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacyHelperComponent } from './legacy-helper.component';

describe('LegacyHelperComponent', () => {
  let component: LegacyHelperComponent;
  let fixture: ComponentFixture<LegacyHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegacyHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegacyHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
