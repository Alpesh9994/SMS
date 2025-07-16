import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTenantDto) {
    return this.prisma.tenant.create({ data });
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTenantDto) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async remove(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
        throw new NotFoundException(`Tenant with id ${id} not found`);
    }
    return this.prisma.tenant.delete({ where: { id } });
  }
}
