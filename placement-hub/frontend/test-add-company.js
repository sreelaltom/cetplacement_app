// Add a test company to production database
async function addTestCompany() {
  try {
    console.log("Adding test company...");
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/companies/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Google",
          website: "https://google.com",
          tier: "tier1",
          salary_range: "20-40 LPA",
        }),
      }
    );

    console.log("Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Company created:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("❌ Error creating company:", text);
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function testCompaniesAfterAdd() {
  console.log("\n=== Testing companies list after adding ===");
  try {
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/companies/"
    );
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Companies:", JSON.stringify(data, null, 2));
    } else {
      console.log("❌ Error:", response.status);
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function main() {
  await addTestCompany();
  await testCompaniesAfterAdd();
}

main();
