import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SchoolList } from './school-list';
import { SchoolService } from './school.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

const mockSchools = [
  { id: '1', name: 'School 1', address: 'Addr 1', adminEmail: 'a@a.com', createdAt: '', config: {}, logo: '' },
  { id: '2', name: 'School 2', address: 'Addr 2', adminEmail: 'b@b.com', createdAt: '', config: {}, logo: '' },
];

describe('SchoolList', () => {
  let component: SchoolList;
  let fixture: ComponentFixture<SchoolList>;
  let schoolServiceSpy: jasmine.SpyObj<SchoolService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    schoolServiceSpy = jasmine.createSpyObj('SchoolService', ['getSchools', 'deleteSchool']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SchoolList],
      providers: [
        { provide: SchoolService, useValue: schoolServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load schools on init', () => {
    schoolServiceSpy.getSchools.and.returnValue(of(mockSchools));
    component.ngOnInit();
    expect(component.schools.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading schools', () => {
    schoolServiceSpy.getSchools.and.returnValue(throwError(() => new Error('fail')));
    component.loadSchools();
    expect(component.loading).toBeFalse();
  });

  it('should navigate to add school', () => {
    component.addSchool();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/school/new']);
  });

  it('should navigate to edit school', () => {
    component.editSchool('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/school', '123', 'edit']);
  });

  it('should delete school after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    schoolServiceSpy.deleteSchool.and.returnValue(of(mockSchools[0]));
    schoolServiceSpy.getSchools.and.returnValue(of([]));
    component.deleteSchool('1');
    expect(schoolServiceSpy.deleteSchool).toHaveBeenCalledWith('1');
  });

  it('should not delete school if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteSchool('1');
    expect(schoolServiceSpy.deleteSchool).not.toHaveBeenCalled();
  });

  it('should handle error on delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error'); // Suppress error output
    schoolServiceSpy.deleteSchool.and.returnValue(throwError(() => new Error('fail')));
    component.deleteSchool('1');
    expect(schoolServiceSpy.deleteSchool).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalled();
  });
});
