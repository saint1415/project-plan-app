# Assets

This directory contains all static assets used in the Project Plan App, such as images, icons, and fonts.

## Structure

- `/icons/` — Application icons (SVG, PNG, etc.)
- `/images/` — Images and illustrations
- `/fonts/` — Custom fonts (if applicable)

## Usage

Import assets directly into React components as needed. For example:

```javascript
import logo from '../../assets/images/logo.png';

function Header() {
  return <img src={logo} alt="App Logo" />;
}
