import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SchedulesDetailComponent } from './schedules-detail.component';

describe('Schedules Management Detail Component', () => {
  let comp: SchedulesDetailComponent;
  let fixture: ComponentFixture<SchedulesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ schedules: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SchedulesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SchedulesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load schedules on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.schedules).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
