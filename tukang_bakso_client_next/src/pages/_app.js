import "../styles/globals.css";
import '../styles/tailwind-utilities.css';
import "leaflet/dist/leaflet.css";

import AppProvider from "../presentation/provider/AppProvider";

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto">
        <Component {...pageProps} />
      </div>
    </AppProvider>
  );
}

export default MyApp;
