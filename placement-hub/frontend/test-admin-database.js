// Test admin login and database state
async function testAdmin() {
  try {
    console.log("Testing admin interface...");
    const response = await fetch("https://cetplacement-backend.vercel.app/admin/");
    console.log("Admin status:", response.status);
    
    if (response.ok) {
      console.log("✅ Admin is accessible");
    } else {
      console.log("❌ Admin not accessible");
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function testDatabaseDirectly() {
  try {
    console.log("\nTesting database with health endpoint...");
    const response = await fetch("https://cetplacement-backend.vercel.app/api/health/");
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Health data:", JSON.stringify(data, null, 2));
      
      // Check if we have any data in database
      if (data.companies === 0 && data.users > 0) {
        console.log("\n📊 Analysis: Users exist but no companies. This might be why dashboard shows empty company list.");
      }
    }
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

async function main() {
  await testAdmin();
  await testDatabaseDirectly();
}

main();
