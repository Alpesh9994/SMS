import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto, tenantId: string) {
    const { subjectIds, ...teacherData } = createTeacherDto;
    
    // Verify all subjects belong to the same tenant
    const subjects = await this.prisma.subject.findMany({
      where: {
        id: { in: subjectIds },
        tenantId
      }
    });
    
    if (subjects.length !== subjectIds.length) {
      throw new ForbiddenException('One or more subjects do not belong to your tenant');
    }
    
    return this.prisma.teacher.create({
      data: {
        ...teacherData,
        tenantId,
        subjects: {
          connect: subjectIds.map(id => ({ id }))
        }
      },
      include: {
        subjects: true,
        classDivisions: true,
        timetableSlots: true,
      }
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.teacher.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        subjects: true,
        classDivisions: {
          include: {
            standard: true
          }
        },
        timetableSlots: true,
      }
    });
  }

  async findOne(id: string, tenantId?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: true,
        classDivisions: {
          include: {
            standard: true
          }
        },
        timetableSlots: true,
      }
    });
    
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    
    if (tenantId && teacher.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this teacher is forbidden');
    }
    
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto, tenantId?: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    
    if (tenantId && teacher.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this teacher is forbidden');
    }
    
    const { subjectIds, ...teacherData } = updateTeacherDto;
    
    // If updating subjects, verify they belong to the same tenant
    if (subjectIds) {
      const subjects = await this.prisma.subject.findMany({
        where: {
          id: { in: subjectIds },
          tenantId: teacher.tenantId
        }
      });
      
      if (subjects.length !== subjectIds.length) {
        throw new ForbiddenException('One or more subjects do not belong to your tenant');
      }
    }
    
    return this.prisma.teacher.update({
      where: { id },
      data: {
        ...teacherData,
        ...(subjectIds && {
          subjects: {
            set: subjectIds.map(id => ({ id }))
          }
        })
      },
      include: {
        subjects: true,
        classDivisions: {
          include: {
            standard: true
          }
        },
        timetableSlots: true,
      }
    });
  }

  async remove(id: string, tenantId?: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    
    if (tenantId && teacher.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this teacher is forbidden');
    }
    
    return this.prisma.teacher.delete({ where: { id } });
  }

  async getTeacherSchedule(id: string, tenantId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        timetableSlots: {
          include: {
            division: {
              include: {
                standard: true
              }
            },
            subject: true
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { periodNumber: 'asc' }
          ]
        }
      }
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (tenantId && teacher.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this teacher is forbidden');
    }

    return teacher.timetableSlots;
  }
}
