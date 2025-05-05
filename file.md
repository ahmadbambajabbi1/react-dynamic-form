# Example Folder Structure

```
example/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── forms/
│   │   ├── BasicForm.tsx       # Basic form example
│   │   ├── MultiStepForm.tsx   # Multi-step form example
│   │   ├── ValidationForm.tsx  # Form with advanced validations
│   │   └── FileUploadForm.tsx  # Form with file upload
│   ├── index.tsx               # Entry point
│   └── styles.css              # Styles (including Tailwind imports)
├── public/
│   └── index.html              # HTML template
├── package.json                # Dependencies for the example
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config for development server
└── tailwind.config.js          # Tailwind configuration
```

This structure provides a complete development environment for testing your form components. Using Vite allows for fast hot module reloading, making it ideal for development.
