import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { PrismaService } from '../prisma/prisma.service';
import { BatchEnrollmentDto } from './dto/batch-enrollment.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { Prisma } from '@prisma/client';
import { StudentPromotionDto } from './dto/student-promotion.dto';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            student: {
              create: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createBatch', () => {
    it('should create multiple students successfully', async () => {
      // Mock data
      const tenantId = 'school-123';
      const batchDto: BatchEnrollmentDto = {
        students: [
          {
            name: 'Student One',
            dateOfBirth: new Date('2010-01-01'),
            admissionDate: new Date('2023-04-01'),
            currentStandardId: 'std-1',
            currentDivisionId: 'div-1',
          },
          {
            name: 'Student Two',
            dateOfBirth: new Date('2011-02-02'),
            admissionDate: new Date('2023-04-01'),
            currentStandardId: 'std-1',
            currentDivisionId: 'div-1',
          },
        ],
      };

      // Mock implementations
      jest.spyOn(service as any, 'generateRollNumber').mockResolvedValue('10-A-001');
      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          student: {
            create: jest.fn().mockImplementation((data) => ({
              id: `student-${Math.random().toString(36).substr(2, 9)}`,
              ...data.data,
            })),
          },
        });
      });

      // Execute
      const result = await service.createBatch(tenantId, batchDto);

      // Assertions
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Student One');
      expect(result[1].name).toBe('Student Two');
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should rollback transaction on error', async () => {
      // Mock data
      const tenantId = 'school-123';
      const batchDto: BatchEnrollmentDto = {
        students: [
          {
            name: 'Valid Student',
            dateOfBirth: new Date('2010-01-01'),
            admissionDate: new Date('2023-04-01'),
            currentStandardId: 'std-1',
            currentDivisionId: 'div-1',
          },
          {
            name: 'Invalid Student',
            dateOfBirth: new Date('2011-02-02'),
            admissionDate: new Date('2023-04-01'),
            currentStandardId: 'invalid-id',
            currentDivisionId: 'invalid-id',
          },
        ],
      };

      // Mock implementations
      jest.spyOn(service as any, 'generateRollNumber').mockResolvedValueOnce('10-A-001');
      jest.spyOn(service as any, 'generateRollNumber').mockRejectedValueOnce(new Error('DB error'));

      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        try {
          return await callback({
            student: {
              create: jest.fn()
                .mockImplementationOnce(() => ({
                  id: 'valid-student-id',
                  name: 'Valid Student',
                }))
                .mockImplementationOnce(() => {
                  throw new Error('DB error');
                }),
            },
          });
        } catch (error) {
          throw error;
        }
      });

      // Execute and assert
      await expect(service.createBatch(tenantId, batchDto)).rejects.toThrow('DB error');
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('promoteStudents', () => {
    it('should promote multiple students successfully', async () => {
      const tenantId = 'tenant-123';
      const promotionDto: StudentPromotionDto = {
        studentIds: ['student-1', 'student-2'],
        targetStandardId: 'std-2',
        targetDivisionId: 'div-2',
      };

      // Mock implementations
      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          student: {
            findUnique: jest.fn()
              .mockResolvedValueOnce({ id: 'student-1', name: 'Student One' })
              .mockResolvedValueOnce({ id: 'student-2', name: 'Student Two' }),
            update: jest.fn()
              .mockResolvedValueOnce({
                id: 'student-1',
                currentStandardId: 'std-2',
                currentDivisionId: 'div-2',
              })
              .mockResolvedValueOnce({
                id: 'student-2',
                currentStandardId: 'std-2',
                currentDivisionId: 'div-2',
              }),
          },
        });
      });

      // Execute
      const result = await service.promoteStudents(tenantId, promotionDto);

      // Assertions
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('student-1');
      expect(result[0].currentStandardId).toBe('std-2');
      expect(result[1].id).toBe('student-2');
      expect(result[1].currentStandardId).toBe('std-2');
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if student not found', async () => {
      const tenantId = 'tenant-123';
      const promotionDto: StudentPromotionDto = {
        studentIds: ['student-1'],
        targetStandardId: 'std-2',
        targetDivisionId: 'div-2',
      };

      // Mock implementations
      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          student: {
            findUnique: jest.fn().mockResolvedValue(null), // Student not found
          },
        });
      });

      // Execute and assert
      await expect(service.promoteStudents(tenantId, promotionDto)).rejects.toThrow(NotFoundException);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
