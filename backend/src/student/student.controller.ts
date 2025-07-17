import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatchEnrollmentDto } from './dto/batch-enrollment.dto';
import { StudentPromotionDto } from './dto/student-promotion.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Roles('SCHOOL_ADMIN')
@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createStudentDto: CreateStudentDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.create(tenantId, createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students for the tenant' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async findAll(@Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific student by ID' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - student does not belong to tenant' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.findOne(tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - student does not belong to tenant' })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.update(tenantId, id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - student does not belong to tenant' })
  async remove(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.remove(tenantId, id);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Enroll multiple students at once' })
  @ApiResponse({ status: 201, description: 'Students enrolled successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createBatch(@Body() batchEnrollmentDto: BatchEnrollmentDto, @Request() req) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.createBatch(tenantId, batchEnrollmentDto);
  }

  @Post('promote')
  @ApiOperation({ summary: 'Promote students to new standard/division' })
  @ApiResponse({ status: 200, description: 'Students promoted successfully' })
  async promote(
    @Body() promotionDto: StudentPromotionDto,
    @Request() req
  ) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new ForbiddenException('No tenant context');
    return this.studentService.promoteStudents(tenantId, promotionDto);
  }
}
