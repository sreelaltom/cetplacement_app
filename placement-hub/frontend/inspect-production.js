// Test production database health and specific company data
const API_BASE_URL = "https://cetplacement-backend.vercel.app/api";

async function inspectProductionData() {
  try {
    // First check health
    console.log("Checking production health...");
    const healthResponse = await fetch(`${API_BASE_URL}/health/`);
    const healthData = await healthResponse.json();
    console.log("Health data:", healthData);

    // Try to access specific company if health shows companies exist
    if (healthData.companies > 0) {
      console.log(
        `\nTrying to access companies (${healthData.companies} found)...`
      );

      // Try individual company endpoints
      for (let id = 1; id <= 10; id++) {
        try {
          const companyResponse = await fetch(
            `${API_BASE_URL}/companies/${id}/`
          );
          if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            console.log(`✅ Company ${id}:`, companyData);
          } else if (companyResponse.status === 404) {
            console.log(`⚪ Company ${id}: Not found`);
          } else {
            console.log(`❌ Company ${id}: Error ${companyResponse.status}`);
          }
        } catch (error) {
          console.log(`💥 Company ${id}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error("Error in inspection:", error);
  }
}

inspectProductionData();
