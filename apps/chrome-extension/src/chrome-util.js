"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTab = void 0;
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    console.log('chrome', chrome);
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
exports.getCurrentTab = getCurrentTab;
