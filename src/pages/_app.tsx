import { AppProps } from "next/app";
import Head from "next/head";
import { Provider as NextAuthProvider } from "next-auth/client";

import Header from "components/Header";

import "styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <NextAuthProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </NextAuthProvider>
    </>
  );
}

export default MyApp;
