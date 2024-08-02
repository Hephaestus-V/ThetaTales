"use client";
import { useState} from 'react';
import StoryBook from '../../components/StoryBook';
import StoryForm from "../../components/StoryForm";

import styles from '../../styles/Home.module.css'; // Import the CSS module
import jsPDF from "jspdf";
import uploadBook from "@/pages/api/upload-image";
import {exec} from "node:child_process";

export default function Home() {
    const [story, setStory] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('/public/img.png');


    //upload PDF
    const [file, setFile] = useState<File | null>(null);
    const [frontPagePhoto, setFrontPagePhoto] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [description, setDescription] = useState('');



    const handleStoryGenerated = (generatedStory: string) => {
        setStory(generatedStory);
        setImageUrl(''); // Reset image when a new story is generated
        setBase64Image(null); // Reset PDF image
        setShowPDF(false); // Hide PDF viewer when a new story is generated
    };


// Example usage in a Re

    const handleImageGenerated = async (generatedImage: string) => {
        setImageUrl(generatedImage);
        console.log('lakshay')
        console.log('als          ' + generatedImage)

        const response = await fetch('http://localhost:8000/api/download-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                imageUrl: generatedImage.toString(),
            })
        });

    };

    const handleImageLoad = () => {
        setLoading(false);

    };



    const downloadPDF = async () => {
        // Create a new PDF document
        const pdfDoc = new jsPDF();

        // Set the font and text color
        pdfDoc.setFontSize(18);
        pdfDoc.text('Storybook', 20, 20);

        // Draw a line under the title
        pdfDoc.line(20, 25, 180, 25);

        // Set the story text
        pdfDoc.setFontSize(12);
        pdfDoc.text(story, 20, 40, { maxWidth: 160 });
        var image1 = new Image();
        image1.src = './downloaded_image.png'
        image1.onload = function() {
            // Create a jsPDF instance
            // Add the image to the PDF
            pdfDoc.addImage(image1, 'PNG', 20, 100, 100, 100);
            // Save the PDF
            pdfDoc.save('storyBook.pdf');
        };
    };


    const uploadPDF = async () => {
        if (file && frontPagePhoto) {
            try {
                await uploadBook(
                    file,
                    name,
                    frontPagePhoto,
                    '123',
                    'test'
                );
                alert('Book uploaded successfully!');
            } catch (error) {
                alert('Failed to upload book');
            }
        } else {
            alert('Please select both files');
        }
    }



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
                        <button onClick={uploadPDF} className={styles.uploadButton}>Upload PDF</button>


                    </div>
                )}

            </div>
        </div>
    );
}
