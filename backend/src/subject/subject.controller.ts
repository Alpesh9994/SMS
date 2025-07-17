import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Roles('SCHOOL_ADMIN')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  
  @Post()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'Subject created successfully'})
  async create(@Body() data: CreateSubjectDto, @Request() req){
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.subjectService.create(data, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects for the tenant' })
  async findAll(@Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.subjectService.findAll(tenantId);
  }
 
  @Get(':id')
  @ApiOperation({ summary: 'Get a subject by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.subjectService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subject by ID' })
  async update(@Param('id') id: string, @Body() data: UpdateSubjectDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.subjectService.update(id, data, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subject by ID' })
  async remove(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.subjectService.remove(id, tenantId);
  }

  
  
}
