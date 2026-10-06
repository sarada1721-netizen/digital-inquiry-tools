export type SensorType = 'ph' | 'temperature' | 'pressure' | 'conductivity' | 'motion';

export interface Experiment {
  id: string;
  sensorType: SensorType;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  formula?: string;
  curriculum: string; // e.g. "고2 화학 I - 산과 염기", "고2 물리학 I - 역학", "고2 지구과학 - 온실효과"
  color: string;
  accentColor: string;
}

export interface DataPoint {
  time: number;
  value: number;
  label?: string;
  extra?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
}

export interface ScoreItem {
  id: string;
  nickname: string;
  score: number;
  played_at: string;
}

export interface SensorMetadata {
  id: SensorType;
  name: string;
  model: string;
  unit: string;
  range: string;
  accuracy: string;
  samplingRate: string;
  description: string;
  iconName: string;
  bgColor: string;
  borderColor: string;
}
