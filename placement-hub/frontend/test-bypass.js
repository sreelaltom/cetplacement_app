// Test bypass companies endpoint
async function testBypassCompanies() {
  try {
    console.log("Testing bypass companies endpoint...");
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/bypass-companies/"
    );
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Bypass companies data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("❌ Error response:", text);
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

testBypassCompanies();
