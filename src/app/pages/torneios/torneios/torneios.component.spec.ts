import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorneiosComponent } from './torneios.component';

describe('TorneiosComponent', () => {
  let component: TorneiosComponent;
  let fixture: ComponentFixture<TorneiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorneiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TorneiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
