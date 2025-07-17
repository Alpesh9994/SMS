import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from './subject.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  subject: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
  },
};

describe('SubjectService', () => {
  let service: SubjectService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subject', async () => {
      const dto: CreateSubjectDto = { name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1' };
      const result = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.create.mockResolvedValue(result);
      
      expect(await service.create(dto, '1')).toEqual(result);
      expect(prisma.subject.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          tenantId: '1',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all subjects without tenantId filter', async () => {
      const subjects = [{ id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() }];
      
      prisma.subject.findMany.mockResolvedValue(subjects);
      
      expect(await service.findAll()).toEqual(subjects);
      expect(prisma.subject.findMany).toHaveBeenCalledWith({ where: {} });
    });

    it('should return subjects filtered by tenantId', async () => {
      const subjects = [{ id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() }];
      
      prisma.subject.findMany.mockResolvedValue(subjects);
      
      expect(await service.findAll('1')).toEqual(subjects);
      expect(prisma.subject.findMany).toHaveBeenCalledWith({ where: { tenantId: '1' } });
    });
  });

  describe('findOne', () => {
    it('should return a subject by id', async () => {
      const subject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.findUnique.mockResolvedValue(subject);
      
      expect(await service.findOne('1')).toEqual(subject);
      expect(prisma.subject.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when subject not found', async () => {
      prisma.subject.findUnique.mockResolvedValue(null);
      
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('1')).rejects.toThrow('Subject not found');
    });

    it('should throw ForbiddenException when tenantId does not match', async () => {
      const subject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.findUnique.mockResolvedValue(subject);
      
      await expect(service.findOne('1', '2')).rejects.toThrow(ForbiddenException);
      await expect(service.findOne('1', '2')).rejects.toThrow('Access to this subject is forbidden');
    });
  });

  describe('update', () => {
    it('should update a subject', async () => {
      const dto: UpdateSubjectDto = { name: 'Updated Math' };
      const existingSubject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      const updatedSubject = { ...existingSubject, name: 'Updated Math' };
      
      prisma.subject.findUnique.mockResolvedValue(existingSubject);
      prisma.subject.update.mockResolvedValue(updatedSubject);
      
      expect(await service.update('1', dto)).toEqual(updatedSubject);
      expect(prisma.subject.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(prisma.subject.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
    });

    it('should throw NotFoundException when subject not found', async () => {
      const dto: UpdateSubjectDto = { name: 'Updated Math' };
      
      prisma.subject.findUnique.mockResolvedValue(null);
      
      await expect(service.update('1', dto)).rejects.toThrow(NotFoundException);
      await expect(service.update('1', dto)).rejects.toThrow('Subject not found');
    });

    it('should throw ForbiddenException when tenantId does not match', async () => {
      const dto: UpdateSubjectDto = { name: 'Updated Math' };
      const existingSubject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.findUnique.mockResolvedValue(existingSubject);
      
      await expect(service.update('1', dto, '2')).rejects.toThrow(ForbiddenException);
      await expect(service.update('1', dto, '2')).rejects.toThrow('Access to this subject is forbidden');
    });
  });

  describe('remove', () => {
    it('should delete a subject', async () => {
      const subject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.findUnique.mockResolvedValue(subject);
      prisma.subject.delete.mockResolvedValue(subject);
      
      expect(await service.remove('1')).toEqual(subject);
      expect(prisma.subject.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(prisma.subject.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when subject not found', async () => {
      prisma.subject.findUnique.mockResolvedValue(null);
      
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      await expect(service.remove('1')).rejects.toThrow('Subject not found');
    });

    it('should throw ForbiddenException when tenantId does not match', async () => {
      const subject = { id: '1', name: 'Math', code: 'MATH101', description: 'Mathematics', tenantId: '1', createdAt: new Date(), updatedAt: new Date() };
      
      prisma.subject.findUnique.mockResolvedValue(subject);
      
      await expect(service.remove('1', '2')).rejects.toThrow(ForbiddenException);
      await expect(service.remove('1', '2')).rejects.toThrow('Access to this subject is forbidden');
    });
  });
});
