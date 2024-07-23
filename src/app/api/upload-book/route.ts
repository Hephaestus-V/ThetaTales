import { NextRequest, NextResponse } from 'next/server';
import { encryptFile } from "@/lib/services/encryptionService";
import { uploadFile} from "@/lib/services/thetaService";
import { authMiddleware } from '@/middleware/authMiddleware';
import { privateKeyToAccount } from "viem/accounts";
import { ThetaTestnet } from '@/lib/chains';
import { createPublicClient, http, createWalletClient, parseAbi } from 'viem'

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

    const publicClient = createPublicClient({
      chain: ThetaTestnet,
      transport: http()
    })
    
    const privateKey = process.env.PLATFORM_WALLET!;
    const account = privateKeyToAccount(privateKey as `0x{string}`);
    const walletClient = createWalletClient({
      account,
      chain: ThetaTestnet,
      transport: http()
    })
    const contractABI = parseAbi([
      'function uploadBook(string arg1) public',
    ])
    const {request} = await publicClient.simulateContract({
      account,
      address : process.env.NEXT_PUBLIC_BOOK_MANAGEMENT_CONTRACT_ADDRESS as `0x{string}`,
      abi : contractABI,
      functionName : "uploadBook",
      args : [bookMetaUrl!]
    })
    const hash = await walletClient.writeContract(request)
    console.log('Transaction hash:', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log(receipt);

    
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


