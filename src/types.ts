export interface Service {
  title: string;
  description: string;
  icon: string;
}

export type PortfolioItem = {
  id: number;
  imageUrl: string;
  title: string;
  category: string[];
  readMoreUrl?: string | null;
  isMain?: boolean;
};

export interface AIStrategyResult {
  slogan: string;
  keyStrategies: string[];
  targetAudience: string;
}

type Columns = 3 | 4;
export interface PortfolioGridProps {
  portfolio: PortfolioItem[];
  columns?: Columns;
  // 클릭시 이동 함수
  onCardClick?: (item: PortfolioItem) => void;
  // 간격
  gapX?: number;
  gapY?: number;
  showReadMore?: boolean;
  readMoreText?: string;
  className?: string;
}
