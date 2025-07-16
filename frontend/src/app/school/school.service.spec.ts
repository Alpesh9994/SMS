import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchoolService, School } from './school.service';

const mockSchool: School = {
  id: '1',
  name: 'Test School',
  address: '123 Main St',
  logo: '',
  adminEmail: 'admin@test.com',
  config: { board: 'CBSE', medium: 'English' },
  createdAt: '2024-01-01T00:00:00Z',
};

describe('SchoolService', () => {
  let service: SchoolService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/tenant';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SchoolService],
    });
    service = TestBed.inject(SchoolService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch schools', () => {
    service.getSchools().subscribe((schools) => {
      expect(schools.length).toBe(1);
      expect(schools[0].name).toBe('Test School');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockSchool]);
  });

  it('should add a school', () => {
    service.addSchool(mockSchool).subscribe((school) => {
      expect(school.name).toBe('Test School');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSchool);
    req.flush(mockSchool);
  });

  it('should edit a school', () => {
    service.editSchool('1', { name: 'Updated School' }).subscribe((school) => {
      expect(school.name).toBe('Updated School');
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ name: 'Updated School' });
    req.flush({ ...mockSchool, name: 'Updated School' });
  });

  it('should delete a school', () => {
    service.deleteSchool('1').subscribe((school) => {
      expect(school.id).toBe('1');
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockSchool);
  });
}); 