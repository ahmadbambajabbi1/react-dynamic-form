import axios from "axios";

let userConfig: any = {
  api: {
    baseURL: "",
    headers: {},
    timeout: 30000,
  },
};

let getSession: () => Promise<{ accessToken?: string }> = async () => ({
  accessToken: undefined,
});

let hasInitialized = false;

const loadConfigFromFs = () => {
  if (typeof window === "undefined" && typeof require !== "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");

      const configPath = path.resolve(process.cwd(), "form.config.json");
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf8");
        return JSON.parse(configContent);
      }

      const srcConfigPath = path.resolve(
        process.cwd(),
        "src",
        "form.config.json"
      );
      if (fs.existsSync(srcConfigPath)) {
        const configContent = fs.readFileSync(srcConfigPath, "utf8");
        return JSON.parse(configContent);
      }
    } catch (error) {
      // Silent error
    }
  }

  return null;
};

const loadSessionHandlerFromFs = () => {
  if (typeof window === "undefined" && typeof require !== "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");

      const tryLoadSession = (sessionPath: string) => {
        if (fs.existsSync(sessionPath)) {
          try {
            const sessionModule = require(sessionPath);
            console.log({ sessionModule, sessionPath });
            if (typeof sessionModule.getSession === "function") {
              return sessionModule.getSession;
            }
          } catch (e) {
            // Silent error
          }
        }
        return null;
      };

      const paths = [
        path.resolve(process.cwd(), "services", "session.js"),
        path.resolve(process.cwd(), "services", "session.ts"),
        path.resolve(process.cwd(), "src", "services", "session.js"),
        path.resolve(process.cwd(), "src", "services", "session.ts"),
      ];

      for (const path of paths) {
        const sessionFn = tryLoadSession(path);
        console.log({ sessionFn });
        if (sessionFn) return sessionFn;
      }
    } catch (error) {
      // Silent error
    }
  }

  return null;
};

const initialize = () => {
  if (hasInitialized) return;

  try {
    const loadedConfig = loadConfigFromFs();
    if (loadedConfig) {
      userConfig = loadedConfig;
    }

    const loadedSessionHandler = loadSessionHandlerFromFs();
    if (loadedSessionHandler) {
      getSession = loadedSessionHandler;
    }

    Axios.defaults.baseURL = userConfig.api?.baseURL || "";
    Axios.defaults.headers = {
      ...(userConfig.api?.headers?.["Content-Type"]
        ? {}
        : { "Content-Type": "application/json" }),
      ...(userConfig.api?.headers || {}),
    };
    Axios.defaults.timeout = userConfig.api?.timeout || 30000;

    hasInitialized = true;
  } catch (error) {
    // Silent error
  }
};

export const initConfig = (
  config: any,
  sessionFn?: () => Promise<{ accessToken?: string }>
) => {
  userConfig = config;

  if (sessionFn) {
    getSession = sessionFn;
  }

  Axios.defaults.baseURL = userConfig.api?.baseURL || "";
  Axios.defaults.headers = {
    ...(userConfig.api?.headers?.["Content-Type"]
      ? {}
      : { "Content-Type": "application/json" }),
    ...(userConfig.api?.headers || {}),
  };
  Axios.defaults.timeout = userConfig.api?.timeout || 30000;

  hasInitialized = true;
};

const Axios = axios.create();

initialize();

Axios.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      // Silent error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Axios;
