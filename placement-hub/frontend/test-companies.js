// Test specific Company API endpoint in more detail
const API_BASE_URL = "https://cetplacement-backend.vercel.app/api";

async function testCompanyEndpoint() {
  try {
    console.log("Testing Companies endpoint...");
    const response = await fetch(`${API_BASE_URL}/companies/`);

    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log("Response body:", text);

    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
      } catch (e) {
        console.log("Failed to parse as JSON:", e.message);
      }
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

testCompanyEndpoint();
