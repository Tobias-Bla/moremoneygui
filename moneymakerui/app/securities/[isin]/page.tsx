// app/securities/[isin]/page.tsx
import { Metadata } from 'next';
import styles from '@/styles/securities.module.css';

interface InvestmentData {
  name: string;
  currentPrice: string;
  marketCap: string;
  description: string;
}

interface InvestmentPageProps {
  params: { isin: string };
}

// A helper function to fetch data based on the ISIN.
// Replace this with your real data fetching logic.
async function getData(isin: string): Promise<InvestmentData> {
  return {
    name: 'Sample Security',
    currentPrice: '100.00 EUR',
    marketCap: '1B EUR',
    description:
      'This is a sample description of the security. Here you can add more detailed information similar to the page you referenced.',
  };
}

// Optional: dynamically set metadata (like the page title) for this route.
export async function generateMetadata({
  params,
}: InvestmentPageProps): Promise<Metadata> {
  const data = await getData(params.isin);
  return {
    title: `Investieren - ${data.name} (${params.isin})`,
  };
}

// Disable the unused-variable rule for the destructured `isin` below
export default async function SecurityPage({
  params: { isin }, // eslint-disable-line @typescript-eslint/no-unused-vars
}: InvestmentPageProps) {
  const data = await getData(isin);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{data.name}</h1>
        <p>ISIN: {isin}</p>
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
