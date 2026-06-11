async function test() {
  console.log("Registering user...");
  let res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "testcheckout@example.com", password: "password123" })
  });
  
  if (res.status === 409) {
    console.log("User exists, logging in instead...");
    res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "testcheckout@example.com", password: "password123" })
    });
  }

  const data = await res.json();
  const token = data.token;
  console.log("Token:", token ? "Found" : "Missing");

  console.log("Testing checkout URL generation...");
  const checkoutRes = await fetch("http://localhost:4000/api/billing/subscribe", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  
  const checkoutData = await checkoutRes.json();
  console.log("Checkout status:", checkoutRes.status);
  console.log("Checkout response:", checkoutData);
}

test().catch(console.error);
