const CLOUD_NAME ='dvoyvhkjp';
const UPLOAD_PRESET = 'DND-Homes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadToCloudinary = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'auto');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(`Upload failed: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};