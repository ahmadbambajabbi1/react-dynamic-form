// diagnostic.js
// Save this in your project root and run with: node diagnostic.js

const http = require("http");
const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

console.log("=== SERVER DIAGNOSTICS ===");
console.log(`OS: ${os.platform()} ${os.release()}`);
console.log(`Node version: ${process.version}`);

// Check if ports are in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`❌ Port ${port} is already in use`);

        try {
          // Try to identify the process using this port
          if (os.platform() === "win32") {
            const output = execSync(
              `netstat -ano | findstr :${port}`
            ).toString();
            console.log(`   Process using port ${port}:\n   ${output.trim()}`);
          } else {
            const output = execSync(`lsof -i :${port}`).toString();
            console.log(`   Process using port ${port}:\n   ${output.trim()}`);
          }
        } catch (e) {
          console.log(`   Could not identify process using port ${port}`);
        }

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

    server.listen(port);
  });
}

// Check package.json for vite configuration
function checkViteConfig() {
  console.log("\n=== VITE CONFIG CHECK ===");

  try {
    // Check root directory vite.config
    let viteConfigPath = path.join(process.cwd(), "vite.config.js");
    if (!fs.existsSync(viteConfigPath)) {
      viteConfigPath = path.join(process.cwd(), "vite.config.ts");
    }

    if (fs.existsSync(viteConfigPath)) {
      const viteConfig = fs.readFileSync(viteConfigPath, "utf8");
      console.log(`✅ Found vite config at ${viteConfigPath}`);

      // Check for port configuration
      const portMatch = viteConfig.match(/port:\s*(\d+)/);
      if (portMatch) {
        console.log(`   Configured port: ${portMatch[1]}`);
      } else {
        console.log("   No port configured in vite.config, default is 5173");
      }
    } else {
      console.log(
        "❌ No vite.config.js or vite.config.ts found in root directory"
      );
    }

    // Check example directory vite.config
    const exampleViteConfigPath = path.join(
      process.cwd(),
      "example",
      "vite.config.ts"
    );
    if (fs.existsSync(exampleViteConfigPath)) {
      const exampleViteConfig = fs.readFileSync(exampleViteConfigPath, "utf8");
      console.log(`✅ Found vite config at ${exampleViteConfigPath}`);

      // Check for port configuration
      const portMatch = exampleViteConfig.match(/port:\s*(\d+)/);
      if (portMatch) {
        console.log(`   Configured port: ${portMatch[1]}`);
      } else {
        console.log(
          "   No port configured in example/vite.config, default is 5173"
        );
      }
    } else {
      console.log("❌ No vite.config.ts found in example directory");
    }
  } catch (err) {
    console.log(`❌ Error checking vite config: ${err.message}`);
  }
}

// Check package scripts
function checkPackageScripts() {
  console.log("\n=== PACKAGE SCRIPTS CHECK ===");

  try {
    // Check root package.json
    const rootPackage = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    );
    console.log("Root package.json scripts:");
    console.log("   ", Object.keys(rootPackage.scripts || {}).join(", "));

    // Check example package.json
    try {
      const examplePackage = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "example", "package.json"),
          "utf8"
        )
      );
      console.log("Example package.json scripts:");
      console.log("   ", Object.keys(examplePackage.scripts || {}).join(", "));

      if (examplePackage.scripts && examplePackage.scripts.dev) {
        console.log(`   Dev script: ${examplePackage.scripts.dev}`);
      }
    } catch (err) {
      console.log("❌ Could not read example/package.json");
    }
  } catch (err) {
    console.log(`❌ Error checking package scripts: ${err.message}`);
  }
}

// Check for any running node processes
function checkNodeProcesses() {
  console.log("\n=== RUNNING NODE PROCESSES ===");

  try {
    if (os.platform() === "win32") {
      const output = execSync(
        'tasklist /fi "imagename eq node.exe"'
      ).toString();
      console.log(output);
    } else {
      const output = execSync("ps aux | grep node").toString();
      console.log(output);
    }
  } catch (err) {
    console.log(`❌ Error checking node processes: ${err.message}`);
  }
}

// Run diagnostics
async function runDiagnostics() {
  // Check commonly used ports for Vite
  await checkPort(3000);
  await checkPort(2025);
  await checkPort(5173); // Vite default

  checkViteConfig();
  checkPackageScripts();
  checkNodeProcesses();

  console.log("\n=== RECOMMENDATIONS ===");
  console.log(
    "1. If ports are in use, try killing those processes or using a different port"
  );
  console.log("2. Make sure you run npm commands from the correct directory");
  console.log("3. Try running with: cd example && npx vite --port 4000");
  console.log("4. Check your network settings and firewall configuration");
}

runDiagnostics();
