/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  console.log('chrome', chrome);
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

console.log('index.tsx');

if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });


}

render(() => <App />, root!);
