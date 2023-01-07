import type { AppProps } from "next/app";
import { Provider as AlertProvider, positions, transitions } from "react-alert";
import "../styles/globals.css";
// @ts-ignore
import AlertTemplate from "react-alert-template-basic";

export default function App({ Component, pageProps }: AppProps) {
  const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_RIGHT,
    timeout: 3000,
    offset: "30px",
    // you can also just use 'scale'
    transition: transitions.FADE,
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Component {...pageProps} />
    </AlertProvider>
  );
}
