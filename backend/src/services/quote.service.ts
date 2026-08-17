export interface Quote {
  quote: string;
  author: string;
}

interface ZenQuoteResponse {
  q?: string;
  a?: string;
}

export const getRandomQuote = async (): Promise<Quote> => {
  const response = await fetch("https://zenquotes.io/api/random");

  if (!response.ok) {
    throw new Error(
      `Quote API request failed: ${response.status}`
    );
  }

  const data = (await response.json()) as ZenQuoteResponse[];

  const item = data?.[0];

  if (!item?.q || !item?.a) {
    throw new Error("Invalid quote API response");
  }

  return {
    quote: item.q,
    author: item.a,
  };
};