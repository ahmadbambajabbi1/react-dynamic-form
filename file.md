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

<!-- cmmc -->

in this code. i have mult-selectcontrllrer, searchable-select-contrller, and select. please for easy work flow. i want you make into diffrent part. we have these types there. selectcontrller, whihc is the data will come fro props not an api. selectfromapicontrller this will fetch data from api, serach in select. this one is a select data will come from props but searchable. i mean the data that comes user can serach throught it not from an api. and also search-in-select-from-api. this oen data will fehc from api but user can searg throght the data that already fetch from api. we alos can have search-from-api. this will query string. because it'll serach from api. and multi-select. for data from props. multi-select-from-api. datat from api, search-in-multi-select to search in multi-selct, and also search-in-multi-select-from-api. currently these contrller everything is at one place. but for simplicyt. please make you make these as sperate contrllers and acces independantly. please use i want each of this to be in modern way. like the select drop-down can be go top if the current is close to down. this image is just an exmaple so the lat assighment menu wnet top but the other asihmnt the menue went down. such way. please very modern way. the search will inside input not you put another input in drop doen for search as it;s right now. no search will inside input. the right way of doing evrything with typescript. make sure you follow thing right this is an npm libry. follow up dont toch the follow. use Axios when fethcin and anything if you wat to adjust use with the thing you fould if it;s not there totaly then new.
