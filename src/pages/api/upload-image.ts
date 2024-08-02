// utils/apiClient.ts
import axios from 'axios';

const uploadBook = async (
    file: File,
    name: string,
    frontPagePhotoPath: File,
    authorName: string,
    description: string
) => {
    try {
        const formData = new FormData();

        // Append form data
        formData.append('file', file);
        formData.append('name', name);
        formData.append('frontPagePhoto', frontPagePhotoPath);
        formData.append('authorName', authorName);
        formData.append('description', description);

        // Send request
        const response = await axios.post(
            'https://theta-tales.vercel.app/api/upload-book',
            formData,
            {
                headers: {
                    'Authorization': '123',
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading book:', error);
        throw error;
    }
};

export default uploadBook;
