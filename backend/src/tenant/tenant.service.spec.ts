import { Test, TestingModule } from '@nestjs/testing';
import { TenantService, PrismaService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

const mockPrismaService = {
  tenant: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TenantService', () => {
  let service: TenantService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    prisma = module.get<PrismaService>(PrismaService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tenant', async () => {
    const dto: CreateTenantDto = { name: 'A', address: 'B', adminEmail: 'a@b.com' };
    const result = { id: '1', ...dto, logo: null, config: null, createdAt: new Date() };
    prisma.tenant.create.mockResolvedValue(result);
    expect(await service.create(dto)).toEqual(result);
    expect(prisma.tenant.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return all tenants', async () => {
    const tenants = [{ id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() }];
    prisma.tenant.findMany.mockResolvedValue(tenants);
    expect(await service.findAll()).toEqual(tenants);
  });

  it('should return one tenant', async () => {
    const tenant = { id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    prisma.tenant.findUnique.mockResolvedValue(tenant);
    expect(await service.findOne('1')).toEqual(tenant);
  });

  it('should update a tenant', async () => {
    const dto: UpdateTenantDto = { name: 'Updated' };
    const updated = { id: '1', name: 'Updated', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    prisma.tenant.update.mockResolvedValue(updated);
    expect(await service.update('1', dto)).toEqual(updated);
    expect(prisma.tenant.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
  });

  it('should delete a tenant', async () => {
    const deleted = { id: '1', name: 'A', address: 'B', adminEmail: 'a@b.com', logo: null, config: null, createdAt: new Date() };
    prisma.tenant.delete.mockResolvedValue(deleted);
    expect(await service.remove('1')).toEqual(deleted);
    expect(prisma.tenant.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
