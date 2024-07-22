import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import  styles from '../styles/Home.module.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface StoryBookProps {
    story: string;
    onImageGenerated: (image: string) => void;
}

export default function StoryBook({ story, onImageGenerated }: StoryBookProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const bookRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!bookRef.current) return;

        const canvas = await html2canvas(bookRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('storybook.pdf');
    };

   useEffect( (() => {
        axios.post('/api/generate-image', { story }).then(
           response => {
               console.log('test abc')
               console.log(response.data)
               onImageGenerated(response.data.imageUrl);
           }
       );
   }), [story]);

    return (
        <div className={styles.storyContainer}>
            <h2 className={styles.storyHeading}>Generated Story Book</h2>
            {story && <p className={styles.storyText}>{story}</p>}
        </div>
    );
}
