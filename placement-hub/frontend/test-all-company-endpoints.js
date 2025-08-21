// Test all debug and simple company endpoints
async function testAllCompanyEndpoints() {
  const baseUrl = "https://cetplacement-backend.vercel.app";
  const endpoints = [
    "/api/companies/",
    "/api/debug/companies/",
    "/api/simple/companies/",
    "/api/minimal/companies/",
    "/bypass-companies/",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n=== Testing: ${baseUrl}${endpoint} ===`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log("Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ SUCCESS! Data:", JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        console.log("❌ Error:", response.status);
        if (text.length < 200) {
          console.log("Response:", text);
        } else {
          console.log("Response:", text.slice(0, 200) + "...");
        }
      }
    } catch (error) {
      console.error("💥 Network Error:", error.message);
    }
  }
}

testAllCompanyEndpoints();
