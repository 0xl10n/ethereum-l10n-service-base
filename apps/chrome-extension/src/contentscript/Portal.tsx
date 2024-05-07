




const MyComponent = () => {
    return <h1>Hello, world!</h1>;
};


const element = <h1>Hello, world</h1>;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.log('content script - portal', document);

        // const root = ReactDOM.createRoot(
        //     document.getElementById('root') as HTMLElement
        // );

        // console.log('root2', root)
        // root.render(
        //     <React.StrictMode>

        //         <MyComponent />
        //     </React.StrictMode>
        // );

        const token = JSON.parse(localStorage.getItem("privy:token") || '')


        console.log('token', token)

        chrome.runtime.sendMessage({ source: 'portal', token }, function (response) {
            console.log('response', response);
        });


    }

};
