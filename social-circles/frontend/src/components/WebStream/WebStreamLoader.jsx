import { useEffect } from 'react';

const WebStreamLoader = () => {
  const isScriptLoaded = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=G-20YXQNH1SZ"]`) !== null;

  if (!isScriptLoaded) {
    const tagId = 'G-20YXQNH1SZ';
    // Create a script element for gtag.js
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
    document.head.appendChild(scriptTag);

    // Create an inline script to configure gtag
    const script = document.createElement('script');
    const scriptText = document.createTextNode(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${tagId}');
    `);
    script.appendChild(scriptText);
    document.head.appendChild(script);
  }
};

export default WebStreamLoader;
