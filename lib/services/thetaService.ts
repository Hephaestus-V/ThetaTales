
async function generateAuthToken() : Promise<string> {
  const timestamp = Date.now().toString();
  const msg = `Theta EdgeStore Call ${timestamp}`;
  const wallet = new Wallet("46bb88d18d3963764c98a1e8ec8e972a55a153d5b7e888d14801fc7a06250843");
  const signature = await wallet.signMessage(msg);
  return `${timestamp}.${wallet.address}.${signature}`;
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