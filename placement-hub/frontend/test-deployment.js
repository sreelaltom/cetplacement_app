// Test simple health check and all endpoints
const API_BASE_URL = "https://cetplacement-backend.vercel.app";

async function testSimpleHealth() {
  try {
    console.log("Testing simple health check...");
    const response = await fetch(`${API_BASE_URL}/simple-health/`);
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Simple health data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("❌ Error response:", text);
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function testAPIHealth() {
  try {
    console.log("\nTesting API health check...");
    const response = await fetch(`${API_BASE_URL}/api/health/`);
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API health data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("❌ Error response:", text);
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function testCompanies() {
  try {
    console.log("\nTesting companies endpoint...");
    const response = await fetch(`${API_BASE_URL}/api/companies/`);
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Companies data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("❌ Error response:", text.substring(0, 200) + "...");
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function runTests() {
  console.log("Testing deployment after vercel.json fix...\n");
  await testSimpleHealth();
  await testAPIHealth();
  await testCompanies();
}

runTests();
