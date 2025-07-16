import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SchoolForm } from './school-form';
import { SchoolService } from '../school.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('SchoolForm', () => {
  let component: SchoolForm;
  let fixture: ComponentFixture<SchoolForm>;
  let schoolServiceSpy: jasmine.SpyObj<SchoolService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  const mockSchool = {
    id: '1',
    name: 'Test School',
    address: '123 Main St',
    logo: '',
    adminEmail: 'admin@test.com',
    config: { board: 'CBSE', medium: 'English' },
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    schoolServiceSpy = jasmine.createSpyObj('SchoolService', ['getSchools', 'addSchool', 'editSchool']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: { paramMap: { get: jasmine.createSpy() } }
    };

    await TestBed.configureTestingModule({
      imports: [SchoolForm, ReactiveFormsModule],
      providers: [
        { provide: SchoolService, useValue: schoolServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.schoolForm.setValue({
      name: '',
      address: '',
      logo: '',
      adminEmail: '',
      board: '',
      medium: ''
    });
    expect(component.schoolForm.invalid).toBeTrue();
  });

  it('should validate email format', () => {
    component.schoolForm.patchValue({ adminEmail: 'invalid-email' });
    expect(component.schoolForm.get('adminEmail')?.invalid).toBeTrue();
    component.schoolForm.patchValue({ adminEmail: 'valid@email.com' });
    expect(component.schoolForm.get('adminEmail')?.valid).toBeTrue();
  });

  it('should call addSchool on submit if no id', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    schoolServiceSpy.addSchool.and.returnValue(of(mockSchool));
    component.schoolForm.setValue({
      name: 'Test',
      address: 'Addr',
      logo: '',
      adminEmail: 'a@a.com',
      board: 'CBSE',
      medium: 'English'
    });
    component.onSubmit();
    expect(schoolServiceSpy.addSchool).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/school']);
  });

  it('should call editSchool on submit if id exists', fakeAsync(() => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue('1');
    schoolServiceSpy.getSchools.and.returnValue(of([mockSchool]));
    schoolServiceSpy.editSchool.and.returnValue(of(mockSchool));
    component.ngOnInit();
    tick();
    component.schoolForm.setValue({
      name: 'Test',
      address: 'Addr',
      logo: '',
      adminEmail: 'a@a.com',
      board: 'CBSE',
      medium: 'English'
    });
    component.onSubmit();
    expect(schoolServiceSpy.editSchool).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/school']);
  }));

  it('should handle error on addSchool', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    spyOn(console, 'error');
    schoolServiceSpy.addSchool.and.returnValue(throwError(() => new Error('fail')));
    component.schoolForm.setValue({
      name: 'Test',
      address: 'Addr',
      logo: '',
      adminEmail: 'a@a.com',
      board: 'CBSE',
      medium: 'English'
    });
    component.onSubmit();
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error on editSchool', fakeAsync(() => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue('1');
    schoolServiceSpy.getSchools.and.returnValue(of([mockSchool]));
    spyOn(console, 'error');
    schoolServiceSpy.editSchool.and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    tick();
    component.schoolForm.setValue({
      name: 'Test',
      address: 'Addr',
      logo: '',
      adminEmail: 'a@a.com',
      board: 'CBSE',
      medium: 'English'
    });
    component.onSubmit();
    expect(console.error).toHaveBeenCalled();
  }));

  it('should navigate back on onBackClick', () => {
    component.onBackClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/school']);
  });
});
