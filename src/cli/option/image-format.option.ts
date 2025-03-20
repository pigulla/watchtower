import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'
import { FormatEnum } from 'sharp'

enum ImageFormat {
    JPEG = 'jpeg',
    JPEG_2000 = 'jp2',
    PNG = 'png',
    WEBP = 'webp',
    GIF = 'gif',
    TIFF = 'tiff',
}

export const imageFormat = new Option(
    '-f, --format <name>',
    'image format to use',
)
    .choices(Object.values(ImageFormat))
    .makeOptionMandatory()
    .default(ImageFormat.JPEG)
    .argParser<keyof FormatEnum>((value, _previous) => {
        switch (value as ImageFormat) {
            case ImageFormat.JPEG:
                return 'jpeg'
            case ImageFormat.JPEG_2000:
                return 'jp2'
            case ImageFormat.PNG:
                return 'png'
            case ImageFormat.WEBP:
                return 'webp'
            case ImageFormat.GIF:
                return 'gif'
            case ImageFormat.TIFF:
                return 'tiff'
            default:
                throw new InvalidOptionArgumentError(
                    `Not a valid image format.`,
                )
        }
    })
