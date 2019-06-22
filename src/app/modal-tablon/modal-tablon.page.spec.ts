import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTablonPage } from './modal-tablon.page';

describe('ModalTablonPage', () => {
  let component: ModalTablonPage;
  let fixture: ComponentFixture<ModalTablonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTablonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTablonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
