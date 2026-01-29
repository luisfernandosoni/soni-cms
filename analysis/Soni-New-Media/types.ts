export type Language = 'en' | 'es';

export interface ServiceItem {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  wide?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}