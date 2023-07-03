const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'aurellieandra',
    api_key: '986524165148345',
    api_secret: 'R8XJmHFXfllq_x-iKlibzFd3R48',
});

const handleFileUploadReceipt = async (file) => {
    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            upload_preset: 'yapemri',
            folder: 'yapemri/yapemri_receipt', // Set your Cloudinary upload preset name
        });

        // Access the uploaded file URL
        const imageUrl = result.secure_url;

        // Do something with the image URL (e.g., store it in your database)

        // Return the image URL or perform any other necessary actions
        return imageUrl;
    } catch (error) {
        // Handle any errors that occur during the upload process
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

const handleFileUploadPicture = async (file) => {
    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            upload_preset: 'yapemri',
            folder: 'yapemri/yapemri_user', // Set your Cloudinary upload preset name
        });

        // Access the uploaded file URL
        const imageUrl = result.secure_url;

        // Do something with the image URL (e.g., store it in your database)

        // Return the image URL or perform any other necessary actions
        return imageUrl;
    } catch (error) {
        // Handle any errors that occur during the upload process
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

module.exports = { handleFileUploadReceipt, handleFileUploadPicture };
