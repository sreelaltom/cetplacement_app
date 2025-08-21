// Test simple companies endpoint
async function testSimpleCompanies() {
  try {
    console.log("Testing simple companies endpoint...");
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/simple/companies/"
    );
    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Success! Simple companies data:",
        JSON.stringify(data, null, 2)
      );
    } else {
      const text = await response.text();
      console.log("Error response:", text);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSimpleCompanies();
