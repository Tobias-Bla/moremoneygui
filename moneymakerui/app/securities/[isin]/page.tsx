import { Metadata } from "next";
import styles from "@/styles/securities.module.css";
import type { PageProps } from "@/types";

interface InvestmentData {
  name: string;
  currentPrice: string;
  marketCap: string;
  description: string;
}

// Fetch data based on ISIN
// eslint-disable-next-line @typescript-eslint/no-unused-vars// app/securities/[isin]/page.tsx
async function getData(isin: string): Promise<InvestmentData> {
  return {
    name: "Sample Security",
    currentPrice: "100.00 EUR",
    marketCap: "1B EUR",
    description: "Detailed security description here...",
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getData(params.isin);
  return {
    title: `Investieren - ${data.name} (${params.isin})`,
  };
}

// Explicitly typed against Next.js built-in PageProps
export default async function SecurityPage({ params }: PageProps) {
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
      </section>

      <section className={styles.details}>
        <h2>Details</h2>
        <p>{data.description}</p>
      </section>
    </div>
  );
}
