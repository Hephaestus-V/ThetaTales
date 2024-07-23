import type { NextApiRequest, NextApiResponse } from 'next';
import {OpenAI } from 'openai';

type Data = {
    story?: string;
    message?: string;
    pages?: number;
};
const openai = new OpenAI({
    apiKey: process.env.KEY,
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
        const maxTokens = 250;
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Write story image only without typography for kids on topic : ${prompt} with max length of ${maxTokens} tokens.`,
            max_tokens: maxTokens,
            temperature: 0.7,
        });

        console.log(JSON.stringify(response, null, 2));
        res.status(200).json({ story: response.choices[0].text.trim(), pages: pages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating story' });
    }
}
