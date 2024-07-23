import { Address } from "viem"

export interface SubscriptionCardProps {
  duration: string;
  price: string;
  features: string[];
}
export interface Book {
  id: number;
  title: string;
  author: string;
  address: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
  views: number;
  encryptedKeyString : string
}
export interface BookCardProps {
  id: number;
  title: string;
  author: string;
  address1: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
  views:number
  encryptedKeyString : string
}

export interface PSPDFKit {
    unload(container: HTMLElement): void;
    load(config: { container: HTMLElement; document: string; baseUrl: string }): Promise<void>;
}
