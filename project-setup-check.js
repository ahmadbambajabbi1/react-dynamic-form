// project-setup-check.mjs
// Run this script from the root directory of your project
// Usage: node project-setup-check.mjs

import { readFileSync, existsSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

console.log(
  `${colors.cyan}=== React Dynamic Form Builder Project Setup Check ===${colors.reset}\n`
);

// Check if we're in the root directory
const isRootDir = () => {
  return (
    existsSync("package.json") && existsSync("src") && existsSync("example")
  );
};

if (!isRootDir()) {
  console.error(
    `${colors.red}Error: This script must be run from the root directory of the project${colors.reset}`
  );
  process.exit(1);
}

// Check package.json in root
try {
  const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
  console.log(`${colors.green}✓ Root package.json found${colors.reset}`);

  // Check if required scripts exist
  const requiredScripts = ["build", "dev", "example"];
  const missingScripts = requiredScripts.filter(
    (script) => !rootPackageJson.scripts[script]
  );

  if (missingScripts.length === 0) {
    console.log(
      `${colors.green}✓ All required scripts found in root package.json${colors.reset}`
    );
  } else {
    console.log(
      `${
        colors.yellow
      }⚠ Missing scripts in root package.json: ${missingScripts.join(", ")}${
        colors.reset
      }`
    );

    // Add missing scripts
    missingScripts.forEach((script) => {
      if (script === "build") {
        rootPackageJson.scripts.build = "rollup -c";
      } else if (script === "dev") {
        rootPackageJson.scripts.dev = "rollup -c -w";
      } else if (script === "example") {
        rootPackageJson.scripts.example = "cd example && npm run dev";
      }
    });

    // Save updated package.json
    writeFileSync("package.json", JSON.stringify(rootPackageJson, null, 2));
    console.log(
      `${colors.green}✓ Added missing scripts to root package.json${colors.reset}`
    );
  }
} catch (error) {
  console.error(
    `${colors.red}Error reading root package.json: ${error.message}${colors.reset}`
  );
}

// Check example package.json
try {
  const examplePackageJson = JSON.parse(
    readFileSync("example/package.json", "utf8")
  );
  console.log(`${colors.green}✓ Example package.json found${colors.reset}`);

  // Check if the dev script exists and is correct
  if (examplePackageJson.scripts && examplePackageJson.scripts.dev === "vite") {
    console.log(
      `${colors.green}✓ Example dev script is correct${colors.reset}`
    );
  } else {
    console.log(
      `${colors.yellow}⚠ Example dev script is missing or incorrect${colors.reset}`
    );

    // Fix dev script
    if (!examplePackageJson.scripts) {
      examplePackageJson.scripts = {};
    }
    examplePackageJson.scripts.dev = "vite";

    // Save updated package.json
    writeFileSync(
      "example/package.json",
      JSON.stringify(examplePackageJson, null, 2)
    );
    console.log(
      `${colors.green}✓ Fixed dev script in example package.json${colors.reset}`
    );
  }
} catch (error) {
  console.error(
    `${colors.red}Error reading example package.json: ${error.message}${colors.reset}`
  );
}

// Check vite.config.ts in example
try {
  const viteConfigPath = "example/vite.config.ts";
  if (existsSync(viteConfigPath)) {
    const viteConfig = readFileSync(viteConfigPath, "utf8");
    console.log(`${colors.green}✓ Vite config found${colors.reset}`);

    // Check port configuration
    if (viteConfig.includes("port: 2025")) {
      console.log(
        `${colors.green}✓ Vite config has correct port (2025)${colors.reset}`
      );
      console.log(
        `${colors.yellow}ℹ Note: Your app will run on http://localhost:2025 (not port 3000)${colors.reset}`
      );
    } else {
      console.log(
        `${colors.yellow}⚠ Vite config does not specify port 2025${colors.reset}`
      );

      // Attempt to fix vite config
      const updatedConfig = viteConfig.replace(
        /server:\s*{/,
        "server: {\n    port: 2025,"
      );

      writeFileSync(viteConfigPath, updatedConfig);
      console.log(
        `${colors.green}✓ Updated vite config to use port 2025${colors.reset}`
      );
    }
  } else {
    console.error(
      `${colors.red}Error: vite.config.ts not found in example directory${colors.reset}`
    );
  }
} catch (error) {
  console.error(
    `${colors.red}Error checking vite config: ${error.message}${colors.reset}`
  );
}

// Check if node_modules exists in root and example
const rootNodeModules = existsSync("node_modules");
const exampleNodeModules = existsSync("example/node_modules");

console.log(
  `Root node_modules: ${
    rootNodeModules ? colors.green + "✓ Exists" : colors.yellow + "⚠ Missing"
  }${colors.reset}`
);
console.log(
  `Example node_modules: ${
    exampleNodeModules ? colors.green + "✓ Exists" : colors.yellow + "⚠ Missing"
  }${colors.reset}`
);

// Provide instructions based on findings
console.log(`\n${colors.cyan}=== Recommended Actions ===${colors.reset}`);

if (!rootNodeModules) {
  console.log(`${colors.yellow}1. Install root dependencies:${colors.reset}`);
  console.log(`   npm install`);
}

if (!exampleNodeModules) {
  console.log(
    `${colors.yellow}${
      !rootNodeModules ? "2" : "1"
    }. Install example dependencies:${colors.reset}`
  );
  console.log(`   cd example && npm install`);
}

console.log(`\n${colors.cyan}=== How to Run the Example ===${colors.reset}`);
console.log(`1. Build the library: npm run build`);
console.log(`2. Start the example: npm run example`);
console.log(
  `3. Access the app at: ${colors.green}http://localhost:2025${colors.reset} (not port 3000)`
);

console.log(`\n${colors.cyan}=== Development Workflow ===${colors.reset}`);
console.log(`For the best development experience with hot reloading:`);
console.log(
  `1. In terminal 1 (root directory): ${colors.green}npm run dev${colors.reset}`
);
console.log(
  `2. In terminal 2 (example directory): ${colors.green}cd example && npm run dev${colors.reset}`
);
console.log(
  `This setup enables hot module replacement for both library and example code.`
);

console.log(`\n${colors.cyan}=== Verification Complete ===${colors.reset}`);
