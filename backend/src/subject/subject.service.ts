import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService){}

  async create(createSubjectDto: CreateSubjectDto, tenantId: string) {
    return this.prisma.subject.create({
      data: {
        ...createSubjectDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.subject.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }

  async findOne(id: string, tenantId?: string) {
    const subject =  await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    if (tenantId && subject.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this subject is forbidden');
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto, tenantId?: string) {
    const subject = await this.prisma.subject.findUnique({ where: {id}});
    if (!subject) throw new NotFoundException('Subject not found');
    if (tenantId && subject.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this subject is forbidden');
    }
    return this.prisma.subject.update({
      where: {id},
      data: updateSubjectDto,
    });
  }

  async remove(id: string, tenantId?: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    if (tenantId && subject.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this subject is forbidden');
    }
    return this.prisma.subject.delete({ where: { id } });
  }
}
