import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  const mockTenantService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        { provide: TenantService, useValue: mockTenantService },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a tenant', async () => {
    const dto: CreateTenantDto = { name: 'A', address: 'B', adminEmail: 'a@b.com' };
    const result = { id: '1', ...dto, logo: null, config: null, createdAt: new Date() };
    mockTenantService.create.mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
    expect(mockTenantService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all tenants', async () => {
    const tenants = [{ id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() }];
    mockTenantService.findAll.mockResolvedValue(tenants);
    expect(await controller.findAll()).toEqual(tenants);
  });

  it('should return one tenant', async () => {
    const tenant = { id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    mockTenantService.findOne.mockResolvedValue(tenant);
    expect(await controller.findOne('1')).toEqual(tenant);
  });

  it('should update a tenant', async () => {
    const dto: UpdateTenantDto = { name: 'Updated' };
    const updated = { id: '1', name: 'Updated', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    mockTenantService.update.mockResolvedValue(updated);
    expect(await controller.update('1', dto)).toEqual(updated);
    expect(mockTenantService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a tenant', async () => {
    const deleted = { id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    mockTenantService.remove.mockResolvedValue(deleted);
    expect(await controller.remove('1')).toEqual(deleted);
    expect(mockTenantService.remove).toHaveBeenCalledWith('1');
  });
});
