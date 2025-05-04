/**
 * This script sets up the example folder structure for development and testing
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths
const rootDir = path.resolve(__dirname, "..");
const exampleDir = path.join(rootDir, "example");

// Check if example directory exists
if (!fs.existsSync(exampleDir)) {
  console.log("Creating example directory...");
  fs.mkdirSync(exampleDir);
  fs.mkdirSync(path.join(exampleDir, "src"));
  fs.mkdirSync(path.join(exampleDir, "src", "forms"));
  fs.mkdirSync(path.join(exampleDir, "public"));
}

// Install dependencies in the example directory
console.log("Installing dependencies in the example directory...");
try {
  execSync("npm install", { cwd: exampleDir, stdio: "inherit" });
  console.log("Dependencies installed successfully!");
} catch (error) {
  console.error("Error installing dependencies:", error);
  process.exit(1);
}

console.log("Example setup complete!");
console.log("");
console.log("You can now run the example using:");
console.log("  npm run example");
console.log("");
console.log("To develop the library with hot reloading:");
console.log('  1. Run "npm run dev" in the root directory');
console.log('  2. Run "npm run example" in another terminal');
