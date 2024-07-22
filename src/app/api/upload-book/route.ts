import { NextRequest, NextResponse } from 'next/server';
import { encryptFile } from "@/lib/services/encryptionService";
import { uploadFile} from "@/lib/services/thetaService";
import { authMiddleware } from '@/middleware/authMiddleware';

async function handler(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string | null;
  const frontPagePhoto = formData.get('frontPagePhoto') as File | null;
  const file = formData.get('file') as File | null;
  const authorName = formData.get('authorName') as string | null;
  const description = formData.get('description') as string | null;

  try {
    if (!file || !name || !authorName || !description) {
      return NextResponse.json({ error: 'File, name, author name, and description are required' }, { status: 400 });
    }

    const platformPublicKey = process.env.PLATFORM_PUBLIC_KEY;

    if (!platformPublicKey) {
      throw new Error('Platform public key is not defined');
    }

    // Encrypt and upload the main file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileResult = await encryptFile(buffer, platformPublicKey);
    const encryptedBookUrl = await uploadFile(fileResult.encryptedFile);

    // Upload front page photo if provided
    let frontPagePhotoUrl = await uploadFile(frontPagePhoto!);

    // Prepare book metadata
    const bookMetadataJson = {
      "Name" : name,
      "Author" : authorName,
      "Description" : description,
      "CoverPageUrl" : frontPagePhotoUrl,
      "encryptedBookUrl" : encryptedBookUrl,
      "encryptedKeyString": fileResult.storagestring,
    };

    const bookMetaUrl = await uploadFile(bookMetadataJson)

    // Here you would typically save the bookMetadata to your database
    // For example: await saveBookMetadataToDatabase(bookMetadata);
    //         // We send back the cid, encryptedSymmetricKey to frontend and that will deploy on contract 
//     // await bookManagement.methods.uploadBook(thetaKey, JSON.stringify(encryptedSymmetricKey), isPublic)
//     //  

    return NextResponse.json({ 
      message: 'Book uploaded successfully', 
      bookMetaUrl 
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);


