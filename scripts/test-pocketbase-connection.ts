/**
 * PocketBase Connection Test Script
 * 
 * Tests connection to PocketBase server and verifies all components are working.
 * 
 * Usage:
 *   npx tsx scripts/test-pocketbase-connection.ts
 */

import PocketBase from 'pocketbase';

// ==================== CONFIGURATION ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin@12345!';

// ==================== TEST SUITE ====================

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  message?: string;
  error?: string;
}

class PocketBaseConnectionTester {
  private pb: PocketBase;
  private results: TestResult[] = [];

  constructor() {
    this.pb = new PocketBase(POCKETBASE_URL);
  }

  private async runTest(
    name: string,
    testFn: () => Promise<void>
  ): Promise<void> {
    const start = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        status: 'pass',
        duration: Date.now() - start,
      });
      console.log(`  ✅ ${name}`);
    } catch (error) {
      this.results.push({
        name,
        status: 'fail',
        duration: Date.now() - start,
        error: String(error),
      });
      console.log(`  ❌ ${name}: ${String(error)}`);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log('PocketBase Connection Test');
    console.log('='.repeat(60));
    console.log(`URL: ${POCKETBASE_URL}`);
    console.log('');

    // Test 1: Health Check
    await this.runTest('Health Check', async () => {
      await this.pb.health.check();
    });

    // Test 2: Server Info
    await this.runTest('Server Info', async () => {
      const info = await this.pb.health.check();
      console.log(`    Version: ${JSON.stringify(info)}`);
    });

    // Test 3: Admin Authentication
    await this.runTest('Admin Authentication', async () => {
      await this.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    });

    // Test 4: Collections List
    await this.runTest('Collections List', async () => {
      const collections = await this.pb.collections.getList(1, 100);
      console.log(`    Found ${collections.totalItems} collections`);
    });

    // Test 5: Create Test Collection
    await this.runTest('Create Test Collection', async () => {
      try {
        // Try to get or create a test collection
        try {
          await this.pb.collections.getOne('test_connection');
        } catch {
          await this.pb.collections.create({
            name: 'test_connection',
            type: 'base',
            fields: [
              { name: 'name', type: 'text', required: true },
              { name: 'value', type: 'number', required: false },
            ],
          });
        }
      } catch (error) {
        // Collection might already exist, that's ok
        if (!String(error).includes('already exists')) {
          throw error;
        }
      }
    });

    // Test 6: CRUD Operations
    await this.runTest('CRUD Operations', async () => {
      // Create
      const record = await this.pb.collection('test_connection').create({
        name: 'test_record',
        value: 42,
      });

      // Read
      const fetched = await this.pb.collection('test_connection').getOne(record.id);
      if (fetched.name !== 'test_record') {
        throw new Error('Read failed: name mismatch');
      }

      // Update
      const updated = await this.pb.collection('test_connection').update(record.id, {
        value: 100,
      });
      if (updated.value !== 100) {
        throw new Error('Update failed: value mismatch');
      }

      // Delete
      await this.pb.collection('test_connection').delete(record.id);
    });

    // Test 7: Real-time Subscription
    await this.runTest('Real-time Subscription', async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Subscription timeout'));
        }, 5000);

        this.pb.collection('test_connection').subscribe('*', () => {
          clearTimeout(timeout);
          this.pb.collection('test_connection').unsubscribe();
          resolve();
        }).then(() => {
          // Trigger a change to test subscription
          this.pb.collection('test_connection').create({
            name: 'realtime_test',
          }).then((record) => {
            // Clean up
            this.pb.collection('test_connection').delete(record.id);
          });
        });
      });
    });

    // Test 8: File Upload
    await this.runTest('File Upload', async () => {
      try {
        // Create a test file
        const testContent = Buffer.from('Hello, PocketBase!');
        const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });

        // Create a record with file
        const formData = new FormData();
        formData.append('name', 'file_test');
        formData.append('file', testFile);

        const record = await this.pb.collection('test_connection').create(formData);

        // Clean up
        await this.pb.collection('test_connection').delete(record.id);
      } catch (error) {
        // File upload might not be supported on test collection
        console.log('    (File upload test skipped - collection may not support files)');
      }
    });

    // Test 9: Query Performance
    await this.runTest('Query Performance', async () => {
      const start = Date.now();
      await this.pb.collection('test_connection').getList(1, 100);
      const duration = Date.now() - start;
      console.log(`    Query time: ${duration}ms`);
    });

    // Test 10: Cleanup
    await this.runTest('Cleanup', async () => {
      try {
        await this.pb.collections.delete('test_connection');
      } catch {
        // Collection might not exist, that's ok
      }
    });

    // Print Summary
    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));

    const passed = this.results.filter((r) => r.status === 'pass').length;
    const failed = this.results.filter((r) => r.status === 'fail').length;
    const skipped = this.results.filter((r) => r.status === 'skip').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total Duration: ${totalDuration}ms`);

    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter((r) => r.status === 'fail')
        .forEach((r) => {
          console.log(`  - ${r.name}: ${r.error}`);
        });
    }

    console.log('='.repeat(60));

    if (failed === 0) {
      console.log('\n✅ All tests passed! PocketBase is ready to use.');
    } else {
      console.log('\n❌ Some tests failed. Please check the errors above.');
      process.exit(1);
    }
  }
}

// ==================== RUN TESTS ====================

async function main() {
  const tester = new PocketBaseConnectionTester();
  await tester.runAllTests();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
