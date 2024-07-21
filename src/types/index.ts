import { Address } from "viem"

export interface SubscriptionCardProps {
  duration: string;
  price: string;
  features: string[];
}
export interface BookCardProps {
  id: number;
  title: string;
  author: string;
  address: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface PSPDFKit {
    unload(container: HTMLElement): void;
    load(config: { container: HTMLElement; document: string; baseUrl: string }): Promise<void>;
}

