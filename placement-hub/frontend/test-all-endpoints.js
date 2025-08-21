// Test all company-related endpoints
const API_BASE_URL = "https://cetplacement-backend.vercel.app/api";

async function testAllEndpoints() {
  const endpoints = [
    "/health/",
    "/companies/",
    "/simple/companies/",
    "/minimal/companies/",
    "/debug/companies/",
  ];

  console.log("Testing all endpoints...\n");

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}:`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log(`  Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        if (endpoint === "/health/") {
          console.log(
            `  ✅ Health: ${data.status}, companies: ${data.companies}`
          );
        } else if (data.error) {
          console.log(`  ⚠️ Success but with error: ${data.error}`);
          if (data.traceback) {
            console.log(
              `  📋 Traceback: ${data.traceback.substring(0, 200)}...`
            );
          }
        } else {
          console.log(`  ✅ Success: ${Object.keys(data).join(", ")}`);
        }
      } else {
        const isHtml = response.headers
          .get("content-type")
          ?.includes("text/html");
        if (isHtml) {
          console.log(`  ❌ HTML Error (500 from Vercel/Django)`);
        } else {
          const text = await response.text();
          console.log(`  ❌ Error: ${text.substring(0, 100)}`);
        }
      }
    } catch (error) {
      console.log(`  💥 Network error: ${error.message}`);
    }
    console.log("");
  }
}

testAllEndpoints();
