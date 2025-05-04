// check-port.mjs
// Run with: node check-port.mjs

import { createServer } from "net";

// Function to check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`❌ Port ${port} is in use by another application`);
        resolve(false);
      } else {
        console.log(`❌ Error checking port ${port}: ${err.message}`);
        resolve(false);
      }
    });

    server.once("listening", () => {
      server.close();
      console.log(`✅ Port ${port} is available`);
      resolve(true);
    });

    server.listen(port, "localhost");
  });
}

// Test common ports
async function checkPorts() {
  console.log("Checking port availability...");
  await checkPort(2025); // Your current port
  await checkPort(3000); // Default React port
  await checkPort(3001); // Alternative port
  await checkPort(5173); // Default Vite port
  await checkPort(8080); // Common alternative

  console.log(
    "\nIf a port is unavailable, try using one of the available ports in your vite.config.ts"
  );
}

checkPorts();
