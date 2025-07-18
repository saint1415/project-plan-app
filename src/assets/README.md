# Assets

This folder is dedicated to storing all static assets used throughout the Project Plan App. This includes images, icons, custom fonts, and any other media files that are directly served by the application.

## Structure

To maintain organization and facilitate easy access, assets are categorized into subdirectories:

-   `/icons/`: Contains SVG, PNG, or other image files used as icons within the application's user interface.
-   `/images/`: Stores larger image files, such as background images, illustrations, or promotional graphics.
-   `/fonts/`: (Optional) If the application uses custom web fonts, they should be placed here.

## Usage

Assets can be imported directly into React components or referenced in CSS files. For example:

```javascript
// In a React component
import logo from '../../assets/images/logo.png';

function Header() {
  return <img src={logo} alt="App Logo" />;
}
