import { decryptSymmetricKey , decryptFile} from "@/lib/services/encryptionService";
import { fetchFile } from "@/lib/services/thetaService";

interface Body{
  thetakey : string;
  encryptedKeyString : string;
}
export async function GET(req: Request){
  const body : Body= await req.json();
  try {
    const thetaKey = body.thetakey;
    const encryptedkeyString = JSON.parse(body.encryptedKeyString);
    
    const symmetricKey = await decryptSymmetricKey(encryptedkeyString);
    const encryptedFile = await fetchFile(thetaKey);
    const decryptedFile = decryptFile(encryptedFile, symmetricKey);

    Response.json({ decryptedFile: new Blob([decryptedFile]) }, {status : 200});
  } catch (error) {
    console.error('Error accessing book:', error);
    Response.json({ error: 'Internal server error' }, {status: 500});
  }
};