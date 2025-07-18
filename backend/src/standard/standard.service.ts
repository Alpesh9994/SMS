import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class StandardService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createStandardDto: CreateStandardDto, tenantId: string) {
    
    const existingStandard = await this.prisma.standard.findUnique({
      where: {
        level_tenantId: {
          level: createStandardDto.level,
          tenantId
        }
      }
    });

    if (existingStandard) {
      throw new ConflictException(`Standard ${createStandardDto.level} already exists for this tenant`);
    }

    return this.prisma.standard.create({
      data: {
        ...createStandardDto,
        tenantId
      },
      include: {
        divisions: {
          include: {
            classTeacher: true
          }
        },
        _count: {
          select: {
            students: true,
            divisions: true
          }
        }
      }
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.standard.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        divisions: {
          include: {
            classTeacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            students: true,
            divisions: true
          }
        }
      },
      orderBy: {
        level: 'asc'
      }
    });
  }

  async findOne(id: string, tenantId?: string) {
    const standard = await this.prisma.standard.findUnique({
      where: { id },
      include: {
        divisions: {
          include: {
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
        },
        _count: {
          select: {
            students: true,
            divisions: true
          }
        }
      }
    });

    if (!standard) {
      throw new NotFoundException(`Standard not found`);
    }

    if (tenantId && standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this standard is forbidden');
    }

    return standard;
  }

  async update(id: string, updateStandardDto: UpdateStandardDto, tenantId?: string) {
    const standard = await this.prisma.standard.findUnique({ where: { id } });
    
    if (!standard) {
      throw new NotFoundException('Standard not found');
    }
    
    if (tenantId && standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this standard is forbidden');
    }

    // check for level conflict if updating level
    if (updateStandardDto.level && updateStandardDto.level !== standard.level) {
      const existingStandard = await this.prisma.standard.findUnique({
        where: {
          level_tenantId: {
            level: updateStandardDto.level,
            tenantId: standard.tenantId
          }
        }
      });

      if (existingStandard) {
        throw new ConflictException(`Standard ${updateStandardDto.level} already exists for this tenant`);
      }
    }
    
    return this.prisma.standard.update({
      where: { id },
      data: updateStandardDto,
      include: {
        divisions: {
          include: {
            classTeacher: true
          }
        },
        _count: {
          select: {
            students: true,
            divisions: true
          }
        }
      }
    });
  }

  async remove(id: string, tenantId?: string) {
    const standard = await this.prisma.standard.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            divisions: true
          }
        }
      }
    });
    
    if (!standard) {
      throw new NotFoundException('Standard not found');
    }
    
    if (tenantId && standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this standard is forbidden');
    }
    
    // Check if standard has students or divisions
    if (standard._count.students > 0) {
      throw new ConflictException('Cannot delete standard with enrolled students');
    }

    if (standard._count.divisions > 0) {
      throw new ConflictException('Cannot delete standard with existing divisions');
    }
    
    return this.prisma.standard.delete({ where: { id } });
  }

  async getDivisionsWithSchedule(id: string, tenantId?: string) {
    const standard = await this.prisma.standard.findUnique({
      where: { id },
      include: {
        divisions: {
          include: {
            classTeacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            timetableSlots: {
              include: {
                subject: {
                  select: {
                    id: true,
                    name: true,
                    code: true
                  }
                },
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: [
                { dayOfWeek: 'asc' },
                { periodNumber: 'asc' }
              ]
            }
          }
        }
      }
    });

    if (!standard) {
      throw new NotFoundException('Standard not found');
    }

    if (tenantId && standard.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this standard is forbidden');
    }

    // Transform the data to group timetable slots by division and day
    const divisionsWithSchedule = standard.divisions.map(division => {
      const scheduleByDay = Object.values(DayOfWeek).map(day => ({
        day,
        slots: division.timetableSlots
          .filter(slot => slot.dayOfWeek === day)
          .sort((a, b) => a.periodNumber - b.periodNumber)
      }));

      return {
        id: division.id,
        name: division.name,
        classTeacher: division.classTeacher,
        schedule: scheduleByDay
      };
    });

    return {
      standardInfo: {
        id: standard.id,
        level: standard.level,
        category: standard.category
      },
      divisions: divisionsWithSchedule
    };
  }

}
