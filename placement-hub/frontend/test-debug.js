// Test debug endpoint
async function testDebugEndpoint() {
  try {
    console.log("Testing debug endpoint...");
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/debug/companies/"
    );
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Debug data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("Error response:", text);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testDebugEndpoint();
