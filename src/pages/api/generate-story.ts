import type { NextApiRequest, NextApiResponse } from 'next';
import {OpenAI } from 'openai';

type Data = {
    story?: string;
    message?: string;
    pages?: number;
};
const openai = new OpenAI({
    apiKey: 'sk-proj-k6iR6ZIPfWxle1o1I2atT3BlbkFJasKBiuPeTJEX2BRRvWiZ',
});
// Configure the OpenAI client

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST requests are allowed' });
        return;
    }
    const { prompt, pages } = req.body;

    try {
        const maxTokens = 250 * pages;
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
             prompt: `Write story for kids on topic : ${prompt} with max length of ${maxTokens} `,
            //prompt: 'Design a modern, eye-catching logo for \'Theta Tales.\' The logo should feature a stylized book or story icon integrated with futuristic elements representing AI and blockchain technology. Use a color palette that includes shades of blue, silver, and purple to convey innovation and technology. Include the tagline \'Innovative Stories, Powered by AI and Theta\' in a clean, readable font. The overall design should be sleek and professional, reflecting the fusion of storytelling, AI, and blockchain',
            max_tokens: maxTokens,
        });

        console.log(response)
        res.status(200).json({ story: response.choices[0].text.trim(), pages: pages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating story' });
    }
}
