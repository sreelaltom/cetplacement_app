// Test local server companies endpoint
async function testLocalCompanies() {
  try {
    console.log("Testing local companies endpoint...");
    const response = await fetch("http://127.0.0.1:8000/api/companies/");
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Success! Companies data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("Error response:", text);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testLocalCompanies();
