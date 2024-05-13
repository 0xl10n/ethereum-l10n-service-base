/**
 * 2 purposes
 * 1. localize when available
 * 2. token passing at 0xl10n.org
 */

import { eas } from "./sites-data.fixture";


document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.log('l10n script', document);

        if (document.URL.match(/attest/)) {
            const inputs = eas;


            Object.keys(inputs["zh_TW"]).map(
                selector => {

                    const elements = document.querySelectorAll(selector);
                    console.log('selector', selector, elements)

                    const content = inputs["zh_TW"][selector]
                    console.log('content', content)
                    // Iterate through each element and modify its content

                    // TODO keep style tags like <strong>
                    elements.forEach((element) => {
                        // Update inner content
                        element.innerHTML = content;

                        // Optionally update attributes
                        // element.setAttribute('class', 'new-class');
                    });

                }
            )
        }


        // TODO listener
        const token = localStorage.getItem('privy:token')
        console.log('query privy token', token)
        if (token) {
            chrome.runtime.sendMessage({ action: 'login', token }, function (response) {
                console.log('response', response);
            });
        }

    };

}