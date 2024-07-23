import {HandIcon, Pencil1Icon, Pencil2Icon, RocketIcon} from "@radix-ui/react-icons";
import {Handshake} from "lucide-react";

const AIBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L17 7 12 9.5 7 7l5-2.5zM4 9.5l6 3v6.5l-6-3v-6.5zm16 0v6.5l-6 3v-6.5l6-3zm-8 3.5l4-2v4l-4 2v-4z"/>
    </svg>
  )
const NFTSubscriptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 16H6V5h12v14z"/>
      <path d="M11 7h2v2h-2zM7 7h2v2H7zm8 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
      <path d="M7 15h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
    </svg>
  )
  const MarketplaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  )
export const features = [
    {
        icon: <AIBookIcon />,
        title: "AI-Powered Book Creation",
        description: "Create unique books using ChatGPT and DALL-E. Simply enter your prompts and watch as AI generates compelling content and visuals for your book."
    },
    {
        icon: <NFTSubscriptionIcon />,
        title: "NFT-Based Subscription",
        description: "Access our entire library of AI-generated books with a unique subscription NFT. Own your membership on the blockchain and enjoy unlimited reading."
    },
    {
        icon: <MarketplaceIcon/>,
        title: "Creator-Centric Marketplace",
        description: "Upload your AI-generated books to our marketplace. Earn rewards based on the popularity and views your creations receive from our community of readers."
    }
];
