export interface MetricCardProps {
  title: string;
  value: string;
  description: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DomainAuthorityDataPoint {
  name: string;
  authority: number;
} 