// Test if we can get a specific company by ID
const API_BASE_URL = "https://cetplacement-backend.vercel.app/api";

async function testSpecificCompany() {
  try {
    // First, let's test a health check to make sure API is up
    console.log("Testing health check...");
    const healthResponse = await fetch(`${API_BASE_URL}/health/`);
    const healthData = await healthResponse.json();
    console.log("Health check:", healthData);

    // Try to get company by ID 1
    console.log("\nTesting company ID 1...");
    const companyResponse = await fetch(`${API_BASE_URL}/companies/1/`);
    console.log("Status:", companyResponse.status);

    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log("Company data:", companyData);
    } else {
      const errorText = await companyResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSpecificCompany();
