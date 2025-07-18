import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { DivisionService } from './division.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Roles('SCHOOL_ADMIN')
@ApiTags('divisions')
@Controller('division')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new division with optional class teacher assignment' })
  @ApiResponse({ status: 201, description: 'Division created successfully' })
  @ApiResponse({ status: 409, description: 'Division name already exists for standard or teacher already assigned' })
  async create(@Body() createDivisionDto: CreateDivisionDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.create(createDivisionDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all divisions for the tenant' })
  @ApiResponse({ status: 200, description: 'Divisions retrieved successfully' })
  async findAll(@Request() req, @Query('standardId') standardId?: string) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific division by ID' })
  @ApiResponse({ status: 200, description: 'Division retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.findOne(id, tenantId);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get division timetable schedule' })
  @ApiResponse({ status: 200, description: 'Division schedule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async getDivisionSchedule(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.getDivisionSchedule(id, tenantId);
  }

  @Get('standard/:standardId')
  @ApiOperation({ summary: 'Get all divisions for a specific standard' })
  @ApiResponse({ status: 200, description: 'Divisions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Standard does not belong to tenant' })
  async findByStandard(@Param('standardId') standardId: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.findByStandard(standardId, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a division and class teacher assignment' })
  @ApiResponse({ status: 200, description: 'Division updated successfully' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  @ApiResponse({ status: 409, description: 'Division name conflict or teacher already assigned' })
  async update(@Param('id') id: string, @Body() updateDivisionDto: UpdateDivisionDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.update(id, updateDivisionDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a division' })
  @ApiResponse({ status: 200, description: 'Division deleted successfully' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete division with students' })
  async remove(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.divisionService.remove(id, tenantId);
  }
}
