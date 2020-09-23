import { Injectable } from '@nestjs/common';
const cloudinary = require('cloudinary').v2;
const widthCrop = 500;
const heightCrop = 500;
const cropType = 'limit';
const backgroundCrop = '#03111F';
@Injectable()
export class ImageManagementService {
  readonly optionsDefault = {
    format: 'jpg',
    resource_type: 'image',
  };
  readonly optionsCrop = {
    format: 'jpg',
    resource_type: 'image',
    width: widthCrop,
    height: heightCrop,
    crop: cropType,
    background: backgroundCrop,
  };
  readonly placeholderUserUrl =
    'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/placeholder.jpg';
  readonly placeholderCardUrl =
    'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/placeholder.jpg';

  readonly placeholdersImagesUrl = [this.placeholderCardUrl, this.placeholderUserUrl];

  async uploadImage(image: string, crop: boolean = true): Promise<string> {
    const imageEncodeBase64 = image.startsWith('data:image/jpg;base64')
      ? image
      : `data:image/jpg;base64,${image}`;
    let urlImage = '';
    let uploadError;
    await cloudinary.uploader.upload(
      imageEncodeBase64,
      crop ? this.optionsCrop : this.optionsDefault,
      (error: any, response: any) => {
        if (error) {
          uploadError = error;
        }
        if (response) {
          urlImage = response.url;
        }
      },
    );
    if (uploadError) {
      throw uploadError;
    }
    return urlImage;
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    const imageName = this.getImageName(imageUrl);
    let result = '';
    let deleteError;
    if (!imageName || this.isPlaceholderImage(imageUrl)) {
      return false;
    }
    await cloudinary.uploader.destroy(
      imageName,
      { resource_type: 'image' },
      (error: any, res: any) => {
        if (error) {
          deleteError = error;
        }
        if (res.result) {
          result = res.result;
        }
      },
    );
    if (deleteError) {
      throw deleteError;
    }
    if (result !== 'Ok') {
      throw new Error(result);
    }
    return true;
  }

  private getImageName(imageUrl: string): string {
    const strUrl = imageUrl.split('/');
    let imageName = '';
    strUrl.forEach(item => {
      if (item.match(/(.*)\.jpg/gm)) {
        imageName = item.split('.')[0];
      }
    });
    return imageName;
  }

  private isPlaceholderImage(imageUrl: string): boolean {
    const index = this.placeholdersImagesUrl.indexOf(imageUrl);
    return index !== -1;
  }
}
