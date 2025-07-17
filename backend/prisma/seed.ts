import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (only for tables that exist)
  console.log('🧹 Clearing existing data...');
  
  // Only clear existing tables - new tables will be created during migration
  try {
    await prisma.subject.deleteMany();
    console.log('  ✅ Cleared subjects');
  } catch (e) {
    console.log('  ⚠️ Subjects table not found, skipping...');
  }
  
  try {
    await prisma.user.deleteMany();
    console.log('  ✅ Cleared users');
  } catch (e) {
    console.log('  ⚠️ Users table not found, skipping...');
  }
  
  try {
    await prisma.tenant.deleteMany();
    console.log('  ✅ Cleared tenants');
  } catch (e) {
    console.log('  ⚠️ Tenants table not found, skipping...');
  }

  // Create Tenants
  console.log('📚 Creating tenants...');
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Adarsh High School',
      address: '123 Education Street, Learning City, LC 12345',
      logo: 'https://example.com/adarsh-logo.png',
      adminEmail: 'admin@adarsh.edu',
      config: {
        theme: 'blue',
        maxStudents: 1000,
        academicYear: '2024-2025'
      }
    }
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Adarsh High School',
      address: '456 Knowledge Avenue, Study Town, ST 67890',
      logo: 'https://example.com/adarsh-logo.png',
      adminEmail: 'admin@adarsh.edu',
      config: {
        theme: 'green',
        maxStudents: 800,
        academicYear: '2024-2025'
      }
    }
  });

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('admin@adarsh', 10);
  const superAdminPassword = await bcrypt.hash('Super@admin', 10);

  // Super Admin (no tenant)
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'super@admin.com',
      password: superAdminPassword,
      role: Role.SUPER_ADMIN
    }
  });

  // School Admins
  const schoolAdmin1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'admin@adarsh.edu',
      password: hashedPassword,
      role: Role.SCHOOL_ADMIN,
      tenantId: tenant1.id
    }
  });

  // Create Subjects
  console.log('📖 Creating subjects...');
  
  // Subjects for Adarsh High School
  const mathSubject1 = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      code: 'MATH101',
      tenantId: tenant1.id
    }
  });

  const englishSubject1 = await prisma.subject.create({
    data: {
      name: 'English Literature',
      code: 'ENG101',
      tenantId: tenant1.id
    }
  });

  const scienceSubject1 = await prisma.subject.create({
    data: {
      name: 'Physics',
      code: 'PHY101',
      tenantId: tenant1.id
    }
  });

  const historySubject1 = await prisma.subject.create({
    data: {
      name: 'World History',
      code: 'HIST101',
      tenantId: tenant1.id
    }
  });

  // Subjects for Adarsh High School
  const mathSubject2 = await prisma.subject.create({
    data: {
      name: 'Advanced Mathematics',
      code: 'MATH201',
      tenantId: tenant2.id
    }
  });

  const englishSubject2 = await prisma.subject.create({
    data: {
      name: 'Creative Writing',
      code: 'ENG201',
      tenantId: tenant2.id
    }
  });

  const scienceSubject2 = await prisma.subject.create({
    data: {
      name: 'Chemistry',
      code: 'CHEM101',
      tenantId: tenant2.id
    }
  });

  const artSubject2 = await prisma.subject.create({
    data: {
      name: 'Fine Arts',
      code: 'ART101',
      tenantId: tenant2.id
    }
  });

  // Note: Teachers, Standards, Divisions, Students, and Timetable Slots
  // will be created through the application UI following the workflow:
  // Subject → Teacher → Standard & Division → Student → Timetable

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 Tenants created');
  console.log('- 1 Super Admin created (system-level)');
  console.log('- 2 School Admins created (1 per tenant)');
  console.log('- 6 Subjects created (3 per tenant)');
  console.log('\n🎯 Next Steps:');
  console.log('- Run the application and test user authentication');
  console.log('- Verify tenant isolation works correctly');
  console.log('- Test role-based access control');
  console.log('- Use the UI to create Teachers, Standards, Divisions, Students, and Timetables');
  console.log('- Continue with frontend development');
  console.log('\n🔐 Login credentials:');
  console.log('Super Admin: super@admin.com / Super@admin');
  console.log('School Admin: admin@adarsh.edu / admin@adarsh');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
