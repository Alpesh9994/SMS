import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { StandardService } from './standard.service';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';


@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Roles('SCHOOL_ADMIN')
@ApiTags('standards')
@Controller('standard')
export class StandardController {
  constructor(private readonly standardService: StandardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new standard' })
  @ApiResponse({ status: 201, description: 'Standard created successfully' })
  @ApiResponse({ status: 409, description: 'Standard level already exists for tenant' })
  async create(@Body() createStandardDto: CreateStandardDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.standardService.create(createStandardDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all standards for the tenant' })
  @ApiResponse({ status: 200, description: 'Standards retrieved successfully' })
  async findAll(@Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.standardService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific standard by ID' })
  @ApiResponse({ status: 200, description: 'Standard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.standardService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a standard' })
  @ApiResponse({ status: 200, description: 'Standard updated successfully' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  @ApiResponse({ status: 409, description: 'Standard level conflict' })
  async update(@Param('id') id: string, @Body() updateStandardDto: UpdateStandardDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.standardService.update(id, updateStandardDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a standard' })
  @ApiResponse({ status: 200, description: 'Standard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete standard with students or divisions' })
  async remove(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.standardService.remove(id, tenantId);
  }
  
}
