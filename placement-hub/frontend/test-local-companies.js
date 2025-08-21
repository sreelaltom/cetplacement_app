// Test local companies endpoint
async function testLocalCompanies() {
  try {
    console.log("Testing local companies endpoint...");
    const response = await fetch("http://127.0.0.1:8001/api/companies/");
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Companies data:", data);
    } else {
      const text = await response.text();
      console.log("Error response:", text);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testLocalCompanies();
