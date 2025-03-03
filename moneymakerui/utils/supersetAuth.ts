// utils/supersetAuth.ts
export async function loginToSuperset() {
    try {
      const response = await fetch("http://localhost:8088/api/v1/security/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: "admin",
          password: "admin",
          provider: "db",
          refresh: true
        }),
        credentials: "include" // Ensures cookies are sent/received
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ Superset Login Successful:", data);
  
      // Optionally, store the access token for later use.
      // For example:
      localStorage.setItem("superset_access_token", data.access_token);
  
      return true;
    } catch (error) {
      console.error("❌ Superset Login Error:", error);
      return false;
    }
  }
  