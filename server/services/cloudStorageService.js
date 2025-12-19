const cloudinary = require('../config/cloudStorage');
const { v4: uuidv4 } = require('uuid');

class CloudStorageService {
  // async uploadFile(fileBuffer, fileName, mimeType) {
  //   return new Promise((resolve, reject) => {
  //     const uploadStream = cloudinary.uploader.upload_stream(
  //       {
  //         public_id: `mri-images/${uuidv4()}-${fileName}`,
  //         resource_type: 'auto'
  //       },
  //       (error, result) => {
  //         if (error) reject(error);
  //         else resolve(result);
  //       }
  //     );
  //     uploadStream.end(fileBuffer);
  //   });
  // }
  async uploadFile(fileBuffer, fileName) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mri-images',
          public_id: `${uuidv4()}-${fileName}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async getFile(publicId) {
    const url = cloudinary.url(publicId);
    return { url };
  }

  // async deleteFile(publicId) {
  //   return await cloudinary.uploader.destroy(publicId);
  // }

  // async getSignedUrl(publicId, expiresIn = 3600) {
  //   const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
  //   return cloudinary.url(publicId, {
  //     sign_url: true,
  //     type: 'authenticated',
  //     resource_type: 'image'
  //   });
  // }
  async deleteFile(publicId) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });
  }

  async getSignedUrl(publicId) {
    return cloudinary.url(publicId, {
      secure: true,
      sign_url: true
    });
  }
}

module.exports = new CloudStorageService();
