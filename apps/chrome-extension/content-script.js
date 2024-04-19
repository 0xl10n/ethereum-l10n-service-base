console.log('content script 2')

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        initApplication();
    }
};

// https://github.com/mikesteele/dual-captions/blob/b0ab92e4670100a27b76b2796995ad1be89f1672/content_script/src/index.js#L7
