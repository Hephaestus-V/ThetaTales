// Route 1: POST for decryption

import { NextRequest, NextResponse } from 'next/server';
import { decryptSymmetricKey, decryptFile } from "@/lib/services/encryptionService";
import { fetchFile } from "@/lib/services/thetaService";
import { authMiddleware } from '@/middleware/authMiddleware';

interface Body {
  encryptedBookUrl: string;
  encryptedKeyString: string;
}

async function handler(req: NextRequest) {
  try {
    const body: Body = await req.json();
    const encryptedBookUrl = body.encryptedBookUrl;
    const encryptedkeyString = JSON.parse(body.encryptedKeyString);
    const symmetricKey = await decryptSymmetricKey(encryptedkeyString);
    const encryptedFile = await fetchFile(encryptedBookUrl);
    const decryptedFile = decryptFile(encryptedFile, symmetricKey);
    // if you want to check result uncomment it and write path
    // fs.writeFileSync(path, decryptedFile);
    return new NextResponse(decryptedFile, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="decrypted_file"'
      }
    });
    // return NextResponse.json({ "message" : "success" }, { status: 200 });

  } catch (error) {
    console.error('Error accessing book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);