// src/utils/axiosConfig.ts
import axios from "axios";

// Default configuration
let userConfig: any = {
  api: {
    baseURL: "",
    headers: {},
    timeout: 30000,
  },
};

// Default fallback session getter
let getSession: () => Promise<{ accessToken?: string }> = async () => ({
  accessToken: undefined,
});

// Function to load configuration from files (only in Node environment)
const loadConfigFromFs = () => {
  if (typeof window === "undefined" && typeof require !== "undefined") {
    try {
      // Dynamically import fs module (only works in Node.js)
      const fs = require("fs");
      const path = require("path");

      // Try to read from the root directory first
      const configPath = path.resolve(process.cwd(), "form.config.json");
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf8");
        const config = JSON.parse(configContent);
        console.log("Loaded configuration from root directory");
        return config;
      }

      // If not found in root, try src directory
      const srcConfigPath = path.resolve(
        process.cwd(),
        "src",
        "form.config.json"
      );
      if (fs.existsSync(srcConfigPath)) {
        const configContent = fs.readFileSync(srcConfigPath, "utf8");
        const config = JSON.parse(configContent);
        console.log("Loaded configuration from src directory");
        return config;
      }

      console.warn(
        "Configuration file not found. Using default configuration."
      );
    } catch (error) {
      console.error("Error loading configuration:", error);
    }
  }

  return userConfig;
};

// Function to load session handler (only in Node environment)
const loadSessionHandlerFromFs = () => {
  if (typeof window === "undefined" && typeof require !== "undefined") {
    try {
      // Dynamically import fs module (only works in Node.js)
      const fs = require("fs");
      const path = require("path");

      // Try to load from services/session
      const sessionPath = path.resolve(process.cwd(), "services", "session.js");
      if (fs.existsSync(sessionPath)) {
        const sessionModule = require(sessionPath);
        if (sessionModule.getSession) {
          console.log("Loaded session handler from services directory");
          return sessionModule.getSession;
        }
      }

      // Try from src/services/session
      const srcSessionPath = path.resolve(
        process.cwd(),
        "src",
        "services",
        "session.js"
      );
      if (fs.existsSync(srcSessionPath)) {
        const sessionModule = require(srcSessionPath);
        if (sessionModule.getSession) {
          console.log("Loaded session handler from src/services directory");
          return sessionModule.getSession;
        }
      }

      console.warn("Session module not found. Using default session handler.");
    } catch (error) {
      console.error("Error loading session handler:", error);
    }
  }

  return getSession;
};

// Try to load configuration and session handler at startup
try {
  // Only run in Node.js environment (during build/server-side rendering)
  const loadedConfig = loadConfigFromFs();
  if (loadedConfig) {
    userConfig = loadedConfig;
  }

  const loadedSessionHandler = loadSessionHandlerFromFs();
  if (loadedSessionHandler) {
    getSession = loadedSessionHandler;
  }
} catch (error) {
  console.error("Error initializing axiosConfig:", error);
}

// Expose initConfig
export const initConfig = (
  config: any,
  sessionFn?: () => Promise<{ accessToken?: string }>
) => {
  userConfig = config;

  if (sessionFn) {
    getSession = sessionFn;
  }

  console.log({ sessionFn, userConfig });

  // Update Axios instance with new config
  Axios.defaults.baseURL = userConfig.api?.baseURL || "";
  Axios.defaults.headers = {
    ...(userConfig.api?.headers?.["Content-Type"]
      ? {}
      : { "Content-Type": "application/json" }),
    ...(userConfig.api?.headers || {}),
  };
  Axios.defaults.timeout = userConfig.api?.timeout || 30000;
};

// Create Axios instance
const Axios = axios.create();

// Attach session token interceptor
Axios.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.warn("Error fetching session token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Axios;
