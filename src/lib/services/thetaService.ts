import { privateKeyToAccount } from "viem/accounts";
import { config } from '../../config/config'
import { signMessage } from '@wagmi/core'

const ipfsURI = "https://data.thetaedgestore.com/api/v2/data/";

async function generateAuthToken() : Promise<string> {
  const timestamp = Date.now().toString();
  const msg = `Theta EdgeStore Call ${timestamp}`;
  const privateKey = process.env.PLATFORM_WALLET!;
  const account = privateKeyToAccount(privateKey as `0x{string}`);
  const signature = await signMessage(config, {
    account,
    message : msg
  })
  return `${timestamp}.${account.address}.${signature}`;
}


export async function uploadFile(file: Buffer | File | object): Promise<string | undefined> {
  const authToken =await generateAuthToken();
  const formData = new FormData();
  if(file instanceof File)
    formData.append('file', file, 'Cover Page');
  else if(file instanceof Buffer)
    formData.append('file', new Blob([file]), 'encrypted_book');
  else{
    const jsonString = JSON.stringify(file);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    formData.append('file', jsonBlob, 'data.json');
  }

  try {
    const response = await fetch('https://api.thetaedgestore.com/api/v2/data', {
      method: 'POST',
      body: formData,
      headers: {
        'x-theta-edgestore-auth': authToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const uri = ipfsURI+ data.key;
    return uri;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}


export async function fetchFile( encryptedBookUrl : string ): Promise<Buffer> {
  const authToken = await generateAuthToken();

  const response = await fetch(encryptedBookUrl, {
    headers: {
      'x-theta-edgestore-auth': authToken,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}