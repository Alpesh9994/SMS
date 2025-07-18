import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Put } from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CreateTimeTableConfigDto } from './dto/create-timetable-config.dto';
import { UpdateTimeTableConfigDto } from './dto/update-timetable-config.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Roles('SCHOOL_ADMIN')
@ApiTags('timetable')
@Controller('time-table')
export class TimeTableController {
  constructor(private readonly timeTableService: TimeTableService) {}

   @Post('config')
  @Roles(Role.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Create timetable configuration' })
  async createConfig(
    @Body() createConfigDto: CreateTimeTableConfigDto,
    @Request() req
  ) {
    return this.timeTableService.createConfig(createConfigDto, req.user.tenantId);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get timetable configuration' })
  async getConfig(@Request() req) {
    return this.timeTableService.getConfig(req.user.tenantId);
  }

  @Put('config')
  @Roles(Role.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Update timetable configuration' })
  async updateConfig(
    @Body() updateConfigDto: UpdateTimeTableConfigDto,
    @Request() req
  ) {
    return this.timeTableService.updateConfig(req.user.tenantId, updateConfigDto);
  }

  @Delete('config')
  @Roles(Role.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Delete timetable configuration' })
  async deleteConfig(@Request() req) {
    return this.timeTableService.deleteConfig(req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new timetable slot' })
  async create(@Body() createTimeTableDto: CreateTimeTableDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.create(createTimeTableDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timetable slots' })
  async findAll(@Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.findAll(tenantId);
  }

  @Get('division/:divisionId')
  @ApiOperation({ summary: 'Get timetable for a specific division' })
  async getDivisionTimeTable(@Param('divisionId') divisionId: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.getDivisionTimeTable(divisionId, tenantId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get timetable for a specific teacher' })
  async getTeacherTimeTable(@Param('teacherId') teacherId: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.getTeacherTimeTable(teacherId, tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific timetable slot' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a timetable slot' })
  async update(@Param('id') id: string, @Body() updateTimeTableDto: UpdateTimeTableDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.update(id, updateTimeTableDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a timetable slot' })
  async remove(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.timeTableService.remove(id, tenantId);
  }

}
