// Test different URL variations for bypass endpoint
async function testBypassVariations() {
  const baseUrl = "https://cetplacement-backend.vercel.app";
  const urls = [
    "/bypass-companies/",
    "/bypass-companies",
    "/api/bypass-companies/",
    "/api/bypass-companies",
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting: ${baseUrl}${url}`);
      const response = await fetch(`${baseUrl}${url}`);
      console.log("Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Success! Data:", JSON.stringify(data, null, 2));
        break;
      } else {
        const text = await response.text();
        console.log("❌ Error:", response.status, text.slice(0, 100) + "...");
      }
    } catch (error) {
      console.error("💥 Error:", error.message);
    }
  }
}

testBypassVariations();
