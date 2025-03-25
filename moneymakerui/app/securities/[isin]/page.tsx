/* eslint-disable @typescript-eslint/no-unused-vars */
// app/securities/[isin]/page.tsx
import { Metadata } from 'next';
import styles from '@/styles/securities.module.css';

interface InvestmentData {
  name: string;
  currentPrice: string;
  marketCap: string;
  description: string;
}

// Fetch data based on ISIN (replace this with your real fetch logic)
async function getData(isin: string): Promise<InvestmentData> {
  return {
    name: 'Sample Security',
    currentPrice: '100.00 EUR',
    marketCap: '1B EUR',
    description:
      'This is a sample description of the security. Here you can add more detailed information similar to the page you referenced.',
  };
}

// Dynamically set metadata for this route.
export async function generateMetadata({ params }: { params: { isin: string } }): Promise<Metadata> {
  const data = await getData(params.isin);
  return {
    title: `Investieren - ${data.name} (${params.isin})`,
  };
}

// Correct inline typing expected by Next.js
export default async function SecurityPage({ params }: { params: { isin: string } }) {
  const data = await getData(params.isin);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{data.name}</h1>
        <p>ISIN: {params.isin}</p>
      </header>

      <section className={styles.overview}>
        <h2>Overview</h2>
        <p>Current Price: {data.currentPrice}</p>
        <p>Market Cap: {data.marketCap}</p>
      </section>

      <section className={styles.chart}>
        <h2>Performance Chart</h2>
        {/* Integrate your chart component here */}
      </section>

      <section className={styles.details}>
        <h2>Details</h2>
        <p>{data.description}</p>
        {/* More detailed info about the security */}
      </section>
    </div>
  );
}
