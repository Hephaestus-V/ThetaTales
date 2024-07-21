// Route 2: POST for encryption and upload

import { NextRequest, NextResponse } from 'next/server';
import { encryptFile } from "@/lib/services/encryptionService";
import { uploadFile } from "@/lib/services/thetaService";
import { authMiddleware } from '@/middleware/authMiddleware';

async function handler(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  try {
    if (!file) {
      return NextResponse.json({ error: 'File is required' });
    }

    const platformPublicKey = process.env.PLATFORM_PUBLIC_KEY;

    if (!platformPublicKey) {
      throw new Error('Platform public key is not defined');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileResult = await encryptFile(buffer, platformPublicKey);
    const thetaKey = await uploadFile(fileResult.encryptedFile);
        // We send back the cid, encryptedSymmetricKey to frontend and that will deploy on contract 
    // await bookManagement.methods.uploadBook(thetaKey, JSON.stringify(encryptedSymmetricKey), isPublic)
    //     .send({ from: accounts[0] });
    return NextResponse.json({ message: 'Book uploaded successfully', thetaKey, fileResult }, { status: 200 });
  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);