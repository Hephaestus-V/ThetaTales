import { Address } from "viem"

export interface SubscriptionCardProps {
  duration: string;
  price: string;
  features: string[];
}
export interface BookProps {
    title: string;
    author: string;
    address: string;
    description: string;
    coverUrl: string;
  }