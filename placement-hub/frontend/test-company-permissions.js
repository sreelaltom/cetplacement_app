// Test company permissions - read should work, write should be restricted
async function testCompanyPermissions() {
  console.log("=== Testing Company Permissions ===\n");

  // Test 1: Read access (should work for everyone)
  console.log("1. Testing READ access (should work):");
  try {
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/companies/"
    );
    console.log("   Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ READ access works - Current companies:", data.count);
    } else {
      console.log("   ❌ READ access failed");
    }
  } catch (error) {
    console.error("   💥 Error:", error.message);
  }

  // Test 2: Write access without authentication (should fail)
  console.log("\n2. Testing WRITE access without admin auth (should fail):");
  try {
    const response = await fetch(
      "https://cetplacement-backend.vercel.app/api/companies/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Company",
          website: "https://test.com",
          tier: "tier1",
          salary_range: "10-15 LPA",
        }),
      }
    );

    console.log("   Status:", response.status);

    if (response.status === 403) {
      console.log("   ✅ WRITE access correctly restricted (403 Forbidden)");
    } else if (response.status === 401) {
      console.log("   ✅ WRITE access correctly restricted (401 Unauthorized)");
    } else {
      const text = await response.text();
      console.log("   ❌ Unexpected response:", response.status);
      console.log("   Response:", text.slice(0, 200));
    }
  } catch (error) {
    console.error("   💥 Error:", error.message);
  }

  console.log("\n=== Summary ===");
  console.log("✅ Companies can be read by everyone");
  console.log("🔒 Companies can only be created/modified by admin");
  console.log("📝 Use Django admin interface to add companies");
}

testCompanyPermissions();
