const sharp = require('sharp');

class ImageProcessingService {
  async processImage(buffer) {
    try {
      // Get image metadata
      const metadata = await sharp(buffer).metadata();

      // Resize if too large
      let processed = sharp(buffer);
      if (metadata.width > 2048 || metadata.height > 2048) {
        processed = processed.resize(2048, 2048, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert to appropriate format
      processed = processed.jpeg({ quality: 90 });

      const processedBuffer = await processed.toBuffer();

      return {
        buffer: processedBuffer,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth
        }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async generateThumbnail(buffer, width = 300, height = 300) {
    try {
      const thumbnail = await sharp(buffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      return thumbnail;
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }

  async extractMetadata(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return metadata;
    } catch (error) {
      throw new Error(`Metadata extraction failed: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessingService();
