export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  console.log('chrome', chrome);
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
