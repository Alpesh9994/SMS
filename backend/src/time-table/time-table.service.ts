import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DayOfWeek } from '@prisma/client';
import { CreateTimeTableConfigDto } from './dto/create-timetable-config.dto';
import { UpdateTimeTableConfigDto } from './dto/update-timetable-config.dto';

@Injectable()
export class TimeTableService {
  constructor(private prisma: PrismaService) {}

  // TimeTable Config Methods
  async createConfig(createConfigDto: CreateTimeTableConfigDto, tenantId: string) {
    // Check if config already exists for tenant
    const existingConfig = await this.prisma.timeTableConfig.findUnique({
      where: { tenantId }
    });

    if (existingConfig) {
      throw new ConflictException('Timetable configuration already exists for this tenant');
    }

    return this.prisma.timeTableConfig.create({
      data: {
        ...createConfigDto,
        breakSlots: createConfigDto.breakSlots as unknown as any[],
        tenantId,
      }
    });
  }

  async getConfig(tenantId: string) {
    const config = await this.prisma.timeTableConfig.findUnique({
      where: { tenantId }
    });

    if (!config) {
      throw new NotFoundException('Timetable configuration not found');
    }

    return config;
  }

  async updateConfig(tenantId: string, updateConfigDto: UpdateTimeTableConfigDto) {
    const config = await this.prisma.timeTableConfig.findUnique({
      where: { tenantId }
    });

    if (!config) {
      throw new NotFoundException('Timetable configuration not found');
    }

    return this.prisma.timeTableConfig.update({
      where: { tenantId },
      data: {
        ...updateConfigDto,
        breakSlots: updateConfigDto.breakSlots as unknown as any[]
      }
    });
  }

  async deleteConfig(tenantId: string) {
    const config = await this.prisma.timeTableConfig.findUnique({
      where: { tenantId }
    });

    if (!config) {
      throw new NotFoundException('Timetable configuration not found');
    }

    // Check if there are any timetable slots
    const slotsCount = await this.prisma.timetableSlot.count({
      where: { tenantId }
    });

    if (slotsCount > 0) {
      throw new ConflictException('Cannot delete config while timetable slots exist');
    }

    return this.prisma.timeTableConfig.delete({
      where: { tenantId }
    });
  }

  // Existing timetable methods with validation...
  private async validateTimeSlotWithConfig(
    createTimeTableDto: CreateTimeTableDto,
    tenantId: string
  ) {
    const config = await this.getConfig(tenantId);

    if (createTimeTableDto.periodNumber > config.periodsPerDay) {
      throw new BadRequestException(`Period number cannot exceed ${config.periodsPerDay}`);
    }

    if (createTimeTableDto.duration !== config.defaultDuration) {
      throw new BadRequestException(`Period duration must be ${config.defaultDuration} minutes`);
    }

    const isBreakTime = config.breakSlots.some((breakSlot: any) => 
      (createTimeTableDto.startTime >= breakSlot.startTime && 
       createTimeTableDto.startTime < breakSlot.endTime) ||
      (createTimeTableDto.endTime > breakSlot.startTime && 
       createTimeTableDto.endTime <= breakSlot.endTime)
    );

    if (isBreakTime) {
      throw new BadRequestException('Time slot overlaps with break time');
    }
  }

  async create(createTimeTableDto: CreateTimeTableDto, tenantId: string) {
    // Validate time slot against config
    await this.validateTimeSlotWithConfig(createTimeTableDto, tenantId);

    // Check if teacher is available at this time
    const teacherConflict = await this.prisma.timetableSlot.findFirst({
      where: {
        teacherId: createTimeTableDto.teacherId,
        dayOfWeek: createTimeTableDto.dayOfWeek,
        periodNumber: createTimeTableDto.periodNumber,
        tenantId,
      },
    });

    if (teacherConflict) {
      throw new ConflictException('Teacher is already assigned to another class at this time');
    }

    // Check if the subject is taught by the teacher
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        id: createTimeTableDto.teacherId,
        tenantId,
        subjects: {
          some: {
            id: createTimeTableDto.subjectId
          }
        }
      }
    });

    if (!teacher) {
      throw new ForbiddenException('Teacher is not assigned to teach this subject');
    }

    return this.prisma.timetableSlot.create({
      data: {
        ...createTimeTableDto,
        tenantId,
      },
      include: {
        division: {
          include: {
            standard: true
          }
        },
        subject: true,
        teacher: {
          include: {
            subjects: true
          }
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.timetableSlot.findMany({
      where: { tenantId },
      include: {
        division: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const timetableSlot = await this.prisma.timetableSlot.findFirst({
      where: { id, tenantId },
      include: {
        division: true,
        subject: true,
        teacher: true,
      },
    });

    if (!timetableSlot) {
      throw new NotFoundException(`Timetable slot with ID ${id} not found`);
    }

    return timetableSlot;
  }

  async update(id: string, updateTimeTableDto: UpdateTimeTableDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.timetableSlot.update({
      where: { id },
      data: updateTimeTableDto,
      include: {
        division: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.timetableSlot.delete({
      where: { id },
    });
  }

  async getDivisionTimeTable(divisionId: string, tenantId: string) {
    const timetable = await this.prisma.timetableSlot.findMany({
      where: {
        divisionId,
        tenantId,
      },
      include: {
        division: {
          include: {
            standard: true
          }
        },
        subject: true,
        teacher: {
          include: {
            subjects: true
          }
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { periodNumber: 'asc' },
      ],
    });

    // Group by day for better organization
    return Object.values(DayOfWeek).map(day => ({
      day,
      slots: timetable.filter(slot => slot.dayOfWeek === day)
        .sort((a, b) => a.periodNumber - b.periodNumber)
    }));
  }

  async getTeacherTimeTable(teacherId: string, tenantId: string) {
    const timetable = await this.prisma.timetableSlot.findMany({
      where: {
        teacherId,
        tenantId,
      },
      include: {
        division: {
          include: {
            standard: true
          }
        },
        subject: true,
        teacher: {
          include: {
            subjects: true
          }
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { periodNumber: 'asc' },
      ],
    });

    // Group by day for better organization
    return Object.values(DayOfWeek).map(day => ({
      day,
      slots: timetable.filter(slot => slot.dayOfWeek === day)
        .sort((a, b) => a.periodNumber - b.periodNumber)
    }));
  }
}
