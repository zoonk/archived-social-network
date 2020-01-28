export interface WikipediaPage {
  description: string;
  photo: string | null;
  slug: string;
  title: string;
}

interface PrefixSearchItem {
  title: string;
  pageid: number;
}

interface WikipediaSearchPage {
  pageid?: number;
  title: string;
  fullurl: string;
  editurl: string;
  canonicalurl: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  description?: string;
}

export interface WikipediaSearchItem extends PrefixSearchItem {
  slug: string;
}

export interface WikipediaPrefixSearch {
  query: {
    prefixsearch: PrefixSearchItem[];
  };
}

export interface WikipediaSearch {
  query: {
    pages: WikipediaSearchPage[];
  };
}
