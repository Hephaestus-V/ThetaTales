import { NextRequest, NextResponse } from "next/server";
import { encryptFile } from "@/lib/services/encryptionService";
import { uploadFile } from "@/lib/services/thetaService";
interface Body{
  file : File;
}
export async function POST(req: Request) {
  const body : Body = await req.json();
  const file = body.file;
  try {
    if (!file ) {
      return Response.json({ error: 'File, timestamp, walletAddress, and signature are required' });
    }
    
    const platformPublicKey = process.env.PLATFORM_PUBLIC_KEY;
    if (!platformPublicKey) {
      throw new Error('Platform public key is not defined');
    }
    
    const fileResult = await encryptFile(file, platformPublicKey);

    const thetaKey = await uploadFile(fileResult.encryptedFile);

    // We send back the cid, encryptedSymmetricKey to frontend and that will deploy on contract 
    // await bookManagement.methods.uploadBook(thetaKey, JSON.stringify(encryptedSymmetricKey), isPublic)
    //     .send({ from: accounts[0] });

    Response.json({ message: 'Book uploaded successfully', thetaKey }, {status : 200});
  } catch (error) {
    console.error('Error uploading book:', error);
    Response.json({ error: 'Internal server error' }, {status : 500});
  }
}