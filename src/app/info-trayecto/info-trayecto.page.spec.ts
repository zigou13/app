import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTrayectoPage } from './info-trayecto.page';

describe('InfoTrayectoPage', () => {
  let component: InfoTrayectoPage;
  let fixture: ComponentFixture<InfoTrayectoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTrayectoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTrayectoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
