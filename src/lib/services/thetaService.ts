import { privateKeyToAccount } from "viem/accounts";
import { config } from '../../config/config'
import { signMessage } from '@wagmi/core'


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


export async function uploadFile(encryptedFile: Buffer): Promise<string | undefined> {
  const authToken =await generateAuthToken();
  const formData = new FormData();
  formData.append('file', new Blob([encryptedFile]), 'encrypted_book');

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
    return data.key;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

export async function fetchFile( thetaKey: string ): Promise<Buffer> {
  const authToken = await generateAuthToken();

  const response = await fetch(`https://data.thetaedgestore.com/api/v2/data/${thetaKey}`, {
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