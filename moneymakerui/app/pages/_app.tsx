// pages/_app.tsx
import Layout from '@/components/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
