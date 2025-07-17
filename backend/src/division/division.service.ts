import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DivisionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDivisionDto: CreateDivisionDto, tenantId: string) {
    const { standardId, classTeacherId, ...divisionData } = createDivisionDto;
    
    // verify standard belongs to tenant
    const standard = await this.prisma.standard.findUnique({
      where: { id: standardId }
    });

    if (!standard || standard.tenantId !== tenantId) {
      throw new ForbiddenException('Standard does not belong to your tenant');
    }

    // Check if division name already exists for this standard
    const existingDivision = await this.prisma.division.findFirst({
      where: {
        name: divisionData.name,
        standardId
      }
    });

    if (existingDivision) {
      throw new ConflictException(`Division ${divisionData.name} already exists for this standard`);
    }

    // Verify class teacher belongs to tenant (if provided)
    if (classTeacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: classTeacherId }
      });

      if (!teacher || teacher.tenantId !== tenantId) {
        throw new ForbiddenException('Teacher does not belong to your tenant');
      }

      //  check if teacher is already assigned as class teacher 
      const existingAssignment = await this.prisma.division.findFirst({
        where: { classTeacherId }
      });

      if (existingAssignment) {
        throw new ConflictException('Teacher is already assigned as class teacher to another division');
      }
    }

    return this.prisma.division.create({
      data: {
        ...divisionData,
        standardId,
        classTeacherId,
        tenantId
      },
      include: {
        standard: true,
        classTeacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.division.findMany({
      where: tenantId ? {
        standard: {
          tenantId
        }
      } : {},
      include: {
        standard: true,
        classTeacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: [
        { standard: { level: 'asc' } },
        { name: 'asc' }
      ]
    });
  }

  async findByStandard(standardId: string, tenantId?: string) {
    // Verify standard belongs to tenant
    if (tenantId) {
      const standard = await this.prisma.standard.findUnique({
        where: { id: standardId }
      });

      if (!standard || standard.tenantId !== tenantId) {
        throw new ForbiddenException('Standard does not belong to your tenant');
      }
    }

    return this.prisma.division.findMany({
      where: { standardId },
      include: {
        standard: true,
        classTeacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string, tenantId?: string) {
    const division = await this.prisma.division.findUnique({
      where: { id },
      include: {
        standard: true,
        classTeacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subjects: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        students: {
          select: {
            id: true,
            name: true,
            rollNumber: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    if (tenantId && division.standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this division is forbidden');
    }

    return division;
  }

  async update(id: string, updateDivisionDto: UpdateDivisionDto, tenantId?: string) {
    const division = await this.prisma.division.findUnique({
      where: { id },
      include: { standard: true }
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    if (tenantId && division.standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this division is forbidden');
    }

    const { standardId, classTeacherId, ...divisionData } = updateDivisionDto;

    // Verify new standard belongs to tenant (if changing standard)
    if (standardId && standardId !== division.standardId) {
      const standard = await this.prisma.standard.findUnique({
        where: { id: standardId }
      });

      if (!standard || (tenantId && standard.tenantId !== tenantId)) {
        throw new ForbiddenException('Standard does not belong to your tenant');
      }
    }

    // Check for name conflict (if changing name or standard)
    if (divisionData.name || standardId) {
      const targetStandardId = standardId || division.standardId;
      const targetName = divisionData.name || division.name;

      const existingDivision = await this.prisma.division.findFirst({
        where: {
          name: targetName,
          standardId: targetStandardId
        }
      });

      if (existingDivision && existingDivision.id !== id) {
        throw new ConflictException(`Division ${targetName} already exists for this standard`);
      }
    }

    // Verify class teacher belongs to tenant (if provided)
    if (classTeacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: classTeacherId }
      });

      if (!teacher || (tenantId && teacher.tenantId !== tenantId)) {
        throw new ForbiddenException('Teacher does not belong to your tenant');
      }

      // Check if teacher is already assigned as class teacher (excluding current division)
      const existingAssignment = await this.prisma.division.findFirst({
        where: { 
          classTeacherId,
          id: { not: id }
        }
      });

      if (existingAssignment) {
        throw new ConflictException('Teacher is already assigned as class teacher to another division');
      }
    }

    return this.prisma.division.update({
      where: { id },
      data: {
        ...divisionData,
        ...(standardId && { standardId }),
        ...(classTeacherId !== undefined && { classTeacherId })
      },
      include: {
        standard: true,
        classTeacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });
  }

  async remove(id: string, tenantId?: string) {
    const division = await this.prisma.division.findUnique({
      where: { id },
      include: {
        standard: true,
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    if (tenantId && division.standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this division is forbidden');
    }

    // Check if division has students
    if (division._count.students > 0) {
      throw new ConflictException('Cannot delete division with enrolled students');
    }

    return this.prisma.division.delete({ where: { id } });
  }
}
