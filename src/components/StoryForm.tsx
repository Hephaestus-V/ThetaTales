import { useState, FormEvent } from 'react';
import axios from 'axios';
import  styles from '../styles/Home.module.css';
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem';

interface StoryFormProps {
    onStoryGenerated: (story: string) => void;
}

export default function StoryForm({ onStoryGenerated }: StoryFormProps) {
    const [prompt, setPrompt] = useState('');
    const [pages, setPages] = useState(1);
    const {data,sendTransactionAsync}=useSendTransaction();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const to=process.env.NEXT_PLATFORM_PUBLIC_KEY as `0x${string}` 
        const value='0.1';
        await sendTransactionAsync({ to, value: parseEther(value) })
        const response = await axios.post('/api/generate-story', { prompt, pages });
        //const testStory = 'This is a test story generated!';
        onStoryGenerated(response.data.story)
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <label className={styles.formLabel}>
                Story Prompt:
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    className={styles.formInput}
                />
            </label>
            {/*<label className={styles.formLabel}>*/}
            {/*    Number of Pages:*/}
            {/*    <input*/}
            {/*        type="number"*/}
            {/*        value={pages}*/}
            {/*        onChange={(e) => setPages(Number(e.target.value))}*/}
            {/*        min="1"*/}
            {/*        required*/}
            {/*        className={styles.formInput}*/}
            {/*    />*/}
            {/*</label>*/}
            <button type="submit" className={styles.submitButton}>
                Generate Story
            </button>
        </form>
    );
}
