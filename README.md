# Nutritionist Helper System

A browser-based nutrition consultation tool designed to help nutritionists collect patient information, organize clinical notes, calculate key metabolic values, and export a consultation summary.

## Project Overview

The Nutritionist Helper System is a lightweight web application built with HTML, CSS, and JavaScript. It runs directly in the browser and does not require a server, database, or external framework.

The main goal of the project is to support nutrition consultations by making patient data easier to record, review, calculate, and save.

## Main Features

- Multi-page website with sidebar navigation
- Patient anamnesis form
- Real-time health and nutrition calculations
- Shared data between pages using browser storage
- Automatic age calculation from date of birth
- Export consultation data as a `.txt` file
- Print or save pages as PDF using the browser print option
- Responsive layout for desktop and smaller screens
- Custom banner and icon images for branding

## Pages Included

| Page | Description |
|---|---|
| `project-proposal.html` | Explains the purpose and expected result of the project |
| `project-design.html` | Describes the layout, structure, and design decisions |
| `info.html` | Provides quick workflow information |
| `anamnese.html` | Main patient history and clinical form |
| `tmb.html` | Metabolic calculator page |
| `help.html` | Basic usage instructions |

## Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Browser print system
- Blob API for text file export

No external libraries or frameworks are required.

## Code Structure

```text
project-folder/
├── anamnese.html
├── tmb.html
├── info.html
├── help.html
├── project-design.html
├── project-proposal.html
├── style.css
├── app.js
├── banner.png
└── icon.png
```

## How Data Is Saved

The application uses the browser's `localStorage` to save form data locally.

The storage key used in the JavaScript file is:

```js
const STORAGE_KEY = 'NutriV1Data';
```

When the user types into a form field, the app automatically saves the data. When the page is opened again, the saved data is loaded back into the form.

This means the data stays in the same browser even after refreshing or closing the page.

Important: because this is a local browser prototype, the data is not saved to an online database.

## Main JavaScript Functions

| Function | Purpose |
|---|---|
| `saveVisibleFields()` | Saves current form values into LocalStorage |
| `loadVisibleFields()` | Loads saved values back into the form |
| `atualizar()` | Updates calculations and displayed values |
| `calcIdade()` | Calculates age from date of birth |
| `calcTMB()` | Calculates BMR using the Mifflin-St Jeor formula |
| `downloadTxt()` | Exports the patient summary as a text file |
| `limparFormulario()` | Clears the form and saved data |

## Calculations Included

The system calculates:

- BMI
- BMI classification
- Estimated body fat percentage
- Estimated lean body mass
- BMR
- TDEE
- Daily calorie target with deficit or surplus

The BMR calculation uses the Mifflin-St Jeor equation.

## Export Options

The app includes two export methods:

1. **Save `.txt`**
   - Generates a text summary of the patient data.
   - Uses the JavaScript `Blob` API.
   - Downloads the file directly from the browser.

2. **Print / Save PDF**
   - Uses `window.print()`.
   - The user can print the page or save it as a PDF.

## Design Choices

The interface uses:

- A warm beige background
- White cards for clinical information
- Rounded components
- A fixed sidebar menu
- A top patient status bar
- Custom banner image on the Anamnese and TMB pages
- Custom icon image in round logo/avatar areas

The design was made to look clean, simple, and appropriate for a nutrition consultation environment.

## How to Run the Project

1. Download or clone the repository.
2. Open `project-proposal.html` or `anamnese.html` in a browser.
3. Use the sidebar menu to navigate between pages.
4. Fill in patient information.
5. Review automatic calculations.
6. Export the summary as `.txt` or print/save as PDF.

No installation is required.

## Limitations

- Data is stored only in the user's browser.
- There is no login system.
- There is no cloud backup.
- Data is not shared between different devices.
- The current version is a front-end prototype only.

## Possible Future Improvements

- Add a backend server
- Add user login
- Store patient data in a database
- Add search and patient history
- Export structured PDF reports
- Add more advanced nutrition calculations
- Improve accessibility and validation

## Author

Developed as a nutritionist consultation helper project.
