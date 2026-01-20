
class ImageController {
  constructor() {
    this.status = 'idle';
    this.generatedImages = [];
  }

  // Simulate image generation
  generateImage(prompt = 'default prompt') {
    this.status = 'generating';

    const fakeImage = {
      id: this._randomId(),
      prompt,
      url: this._fakeImageUrl(),
      createdAt: new Date().toISOString()
    };

    this.generatedImages.push(fakeImage);
    this.status = 'completed';

    return fakeImage;
  }

  // Get all generated images
  getImages() {
    return this.generatedImages;
  }

  // Clear stored images
  reset() {
    this.generatedImages = [];
    this.status = 'idle';
    return true;
  }

  // -------------------------
  // Internal helper methods
  // -------------------------

  _randomId() {
    return Math.random().toString(36).substring(2, 10);
  }

  _fakeImageUrl() {
    const width = this._randomNumber(300, 800);
    const height = this._randomNumber(300, 800);
    return `https://placeholder.image/${width}x${height}`;
  }

  _randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Export a single instance (controller-style)
const imageController = new ImageController();

export default imageController;