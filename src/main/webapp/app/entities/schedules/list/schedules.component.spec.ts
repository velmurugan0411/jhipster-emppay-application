import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SchedulesService } from '../service/schedules.service';

import { SchedulesComponent } from './schedules.component';

describe('Schedules Management Component', () => {
  let comp: SchedulesComponent;
  let fixture: ComponentFixture<SchedulesComponent>;
  let service: SchedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'schedules', component: SchedulesComponent }]), HttpClientTestingModule],
      declarations: [SchedulesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SchedulesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SchedulesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SchedulesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.schedules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to schedulesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSchedulesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSchedulesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
