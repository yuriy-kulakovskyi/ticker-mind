export interface INewsArticle {
  article_id: string;
  link: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
  creator: string[];
  language: string;
  country: string[];
  category: string[];
  pubDate: string;
  pubDateTZ: string;
  image_url: string | null;
  video_url: string | null;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  sentiment: string;
  sentiment_stats: string;
  ai_tag: string;
  ai_region: string;
  ai_org: string;
  ai_summary: string;
  duplicate: boolean;
}

export interface INewsDataApiResponse {
  status: string;
  totalResults: number;
  results: INewsArticle[];
  nextPage?: string;
}
