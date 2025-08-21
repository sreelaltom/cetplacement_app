// Simple API test script to verify production endpoints
const API_BASE_URL = "https://cetplacement-backend.vercel.app/api";

async function testEndpoint(path, name) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    const status = response.status;

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name}: Status ${status} - OK`);
      if (data.results) {
        console.log(
          `   - Found ${data.results.length} items (total: ${data.count})`
        );
      } else if (Array.isArray(data)) {
        console.log(`   - Found ${data.length} items`);
      } else {
        console.log(
          `   - Response: ${JSON.stringify(data).substring(0, 100)}...`
        );
      }
    } else {
      console.log(`❌ ${name}: Status ${status} - ${response.statusText}`);
    }
  } catch (error) {
    console.log(`💥 ${name}: Network error - ${error.message}`);
  }
}

async function runTests() {
  console.log("Testing Production API Endpoints...\n");

  await testEndpoint("/health/", "Health Check");
  await testEndpoint("/companies/", "Companies List");
  await testEndpoint("/experiences/", "Interview Experiences");
  await testEndpoint("/subjects/", "Subjects List");
  await testEndpoint("/posts/", "Posts List");
  await testEndpoint("/branches/", "Branches List");

  console.log("\nAPI testing complete!");
}

runTests();
