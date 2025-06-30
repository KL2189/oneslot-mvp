
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx is loading...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  throw new Error("Root element not found");
}

console.log("Root element found, creating React root...");
const root = createRoot(rootElement);

try {
  console.log("Rendering App component...");
  root.render(<App />);
  console.log("App rendered successfully!");
} catch (error) {
  console.error("Error rendering app:", error);
}
