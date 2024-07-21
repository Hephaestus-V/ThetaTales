// page.tsx
"use client";
import { useState } from 'react';
import StoryBook from '../../components/StoryBook';
import StoryForm from "../../components/StoryForm";
import styles from '../../styles/Home.module.css'; // Import the CSS module

export default function Home() {
    const [story, setStory] = useState<string>('');
    const [image, setImageUrl] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(1);

    const handleStoryGenerated = (generatedStory: string) => {
        setStory(generatedStory);
    };

    const handleImageGenerated = (generatedImage: string) => {
        setImageUrl(generatedImage);
    };

    const handlePageSize = (size: number) => {
        setPageSize(size);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Storybook Generator111</h1>
            <StoryForm onStoryGenerated={handleStoryGenerated} />
            {story && (
                <div className={styles.card}>
                    <StoryBook
                        story={story}
                        onImageGenerated={handleImageGenerated}
                     />
                    {image && (
                        <div className={styles.image}>
                            <img src={image} alt="Generated illustration" />
                        </div>
                    )}
                    {/*<button className={styles.button} onClick={() => handleImageGenerated('new-image-url')}>*/}
                    {/*    Generate Image*/}
                    {/*</button>*/}
                </div>
            )}
        </div>
    );
}
