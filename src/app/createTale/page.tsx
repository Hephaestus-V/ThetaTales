"use client";
import { useState } from 'react';
import StoryBook from '../../components/StoryBook';
import StoryForm from "../../components/StoryForm";
import styles from '../../styles/Home.module.css'; // Import the CSS module
import jsPDF from "jspdf";
import * as fs from "node:fs";

// Remove unused imports
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export default function Home() {
    const [story, setStory] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const handleStoryGenerated = (generatedStory: string) => {
        setStory(generatedStory);
        setImageUrl(''); // Reset image when a new story is generated
        setBase64Image(null); // Reset PDF image
        setShowPDF(false); // Hide PDF viewer when a new story is generated
    };

    const handleImageGenerated = (generatedImage: string) => {
        setImageUrl(generatedImage);
        // convertImageToBase64(generatedImage, (base64) => {
        //     setBase64Image(base64);
        // });
    };

    const handleImageLoad = () => {
        setLoading(false);

    };


    // const downloadPDF = () => {
    //     const input = document.getElementById('storybook-content');
    //     if (input) {
    //         html2canvas(input, { backgroundColor: '#000000' }).then((canvas) => {
    //             const imgData = canvas.toDataURL('image/png');
    //             const pdf = new jsPDF();
    //             pdf.addImage(imgData, 'PNG', 0, 0, 120, 120);
    //             pdf.save("storybook.pdf");
    //         });
    //     }
    // };

    // const convertImageToBase64 = (url: string, callback: (base64: string) => void) => {
    //     fetch(url)
    //         .then(response => response.blob())
    //         .then(blob => {
    //             const reader = new FileReader();
    //             reader.onloadend = () => {
    //                 callback(reader.result as string);
    //             };
    //             reader.readAsDataURL(blob);
    //         })
    //         .catch(error => {
    //             console.error('Image fetching error:', error);
    //             callback('');
    //         });
    // };

    const downloadPDF = () => {
        const pdf = new jsPDF();
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);

        // Add title
        pdf.setFontSize(18);
        pdf.text("Storybook", 20, 20);
        pdf.setLineWidth(0.5);
        pdf.line(20, 25, 190, 25);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(story, 20, 35, { maxWidth: 170 });
        pdf.setLineWidth(0.5);
        pdf.line(20, 25, 190, 25);


        pdf.save("storybook.pdf");
    };



    return (
        <div className="min-h-screen">
            <div className="container mx-auto">
                <h1 className={styles.header}>Storybook Generator</h1>
                <StoryForm onStoryGenerated={handleStoryGenerated}/>
                {story && (
                    <div id="storybook-content">
                        <StoryBook
                            story={story}
                            onImageGenerated={handleImageGenerated}
                        />
                        {loading && (
                            <div className={styles.loader}>Loading...</div>
                        )}
                        {imageUrl && (
                            <div className={styles.image}>
                                <img src={imageUrl} alt="Generated illustration" onLoad={handleImageLoad}/>
                            </div>
                        )}

                        <button onClick={downloadPDF} className={styles.downloadButton}>Download PDF</button>

                    </div>
                )}

            </div>
        </div>
    );
}
