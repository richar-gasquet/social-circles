import { useEffect } from 'react';

const WebStreamLoader = () => {
  const isScriptLoaded = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=G-20YXQNH1SZ"]`) !== null;

  if (!isScriptLoaded) {
    useEffect(() => {
      const loadScript = () => {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-20YXQNH1SZ";
        document.head.appendChild(script);

        script.onload = () => {
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-20YXQNH1SZ');
        };
      };

      loadScript();
    }, []);
  }
};

export default WebStreamLoader;
