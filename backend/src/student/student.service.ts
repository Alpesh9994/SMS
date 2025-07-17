import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { BatchEnrollmentDto } from './dto/batch-enrollment.dto';
import { StudentPromotionDto } from './dto/student-promotion.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createStudentDto: CreateStudentDto) {
    try {
      const rollNumber = await this.generateRollNumber(
        tenantId,
        createStudentDto.currentStandardId,
        createStudentDto.currentDivisionId
      );

      return this.prisma.student.create({
        data: {
          ...createStudentDto,
          tenantId,
          rollNumber,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  private async generateRollNumber(
    tenantId: string,
    standardId: string,
    divisionId: string
  ): Promise<string> {
    // Get the last student and class details in a single transaction
    const [lastStudent, standard, division] = await this.prisma.$transaction([
      this.prisma.student.findFirst({
        where: {
          tenantId,
          currentStandardId: standardId,
          currentDivisionId: divisionId,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.standard.findUniqueOrThrow({ 
        where: { id: standardId } 
      }),
      this.prisma.division.findUniqueOrThrow({ 
        where: { id: divisionId } 
      }),
    ]);

    // Generate sequential number
    const sequence = lastStudent 
      ? parseInt(lastStudent.rollNumber.split('-').pop() || '0') + 1 
      : 1;

    return `${standard.level}-${division.name}-${sequence.toString().padStart(3, '0')}`;
  }

  async findAll(tenantId: string) {
    return this.prisma.student.findMany({
      where: { tenantId },
      include: {
        currentStandard: true,
        currentDivision: true,
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id, tenantId },
      include: {
        currentStandard: true,
        currentDivision: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(tenantId: string, id: string, updateStudentDto: UpdateStudentDto) {
    try {
      return await this.prisma.student.update({
        where: { id, tenantId },
        data: updateStudentDto,
      });
    } catch (error) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async remove(tenantId: string, id: string) {
    try {
      return await this.prisma.student.delete({
        where: { id, tenantId },
      });
    } catch (error) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async createBatch(tenantId: string, batchEnrollmentDto: BatchEnrollmentDto) {
    return this.prisma.$transaction(async (prisma) => {
      const createdStudents = [] as Awaited<ReturnType<typeof prisma.student.create>>[];
      for (const studentData of batchEnrollmentDto.students) {
        const rollNumber = await this.generateRollNumber(
          tenantId,
          studentData.currentStandardId,
          studentData.currentDivisionId
        );
        
        // Explicitly type the create input
        const studentCreateInput: Prisma.StudentCreateInput = {
          name: studentData.name,
          dateOfBirth: studentData.dateOfBirth,
          admissionDate: studentData.admissionDate,
          rollNumber,
          tenant: { connect: { id: tenantId } },
          currentStandard: { connect: { id: studentData.currentStandardId } },
          currentDivision: { connect: { id: studentData.currentDivisionId } },
        };
  
        const student = await prisma.student.create({
          data: studentCreateInput
        });
        createdStudents.push(student);
      }
      return createdStudents;
    });
  }

  async promoteStudents(tenantId: string, promotionDto: StudentPromotionDto) {
    return this.prisma.$transaction(async (prisma) => {
      const promotedStudents = [] as Awaited<ReturnType<typeof prisma.student.update>>[];
      for (const studentId of promotionDto.studentIds) {
        const student = await prisma.student.findUnique({
          where: { id: studentId, tenantId }
        });
        
        if (!student) throw new NotFoundException(`Student ${studentId} not found`);
        
        const updatedStudent = await prisma.student.update({
          where: { id: studentId },
          data: {
            currentStandard: { connect: { id: promotionDto.targetStandardId } },
            currentDivision: { connect: { id: promotionDto.targetDivisionId } },
          }
        });
        
        promotedStudents.push(updatedStudent);
      }
      return promotedStudents;
    });
  }
}
