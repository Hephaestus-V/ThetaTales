import type { NextApiRequest, NextApiResponse } from 'next';
import {OpenAI } from 'openai';


type Data = {
    imageUrl?: string;
    message?: string;
};

const openai = new OpenAI({
    apiKey: 'sk-proj-oGqo5gfPz0XIb3FVIqJXT3BlbkFJCyOOaKfBfjTz9yaxKeCX',
});
// Configure the OpenAI client

export default async function POST(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST requests are allowed' });
        return;
    }

    console.log(req.body)
    const { prompt } = req.body;

    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `Create a vibrant and magical illustration for a children's storybook with ${req.body.pages} pages. Story details: ${req.body.story}`,
            n: 1,
            size: "1024x1024",
        });

        console.log(response)
        const imageUrl = response.data[0].url

        res.status(200).json({imageUrl} );
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Error generating image' });
    }
}
