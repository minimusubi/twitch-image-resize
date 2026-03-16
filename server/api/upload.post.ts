import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

const TYPE_SIZE_MAP: Record<ImageType, number[]> = {
	'subscriber-badge': [18, 36, 72],
	'badge-flair': [18, 36, 72],
	'bit-badge': [18, 36, 72],
	'channel-redeem': [28, 56, 112],
};

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const multiparts = await readMultipartFormData(event);
	const type: ImageType =
		Array.isArray(query.type) ? query.type[0] : query.type;

	if (type === undefined || !multiparts) {
		return;
	}

	const results: ImageResponseMap = {};

	for (const multipart of multiparts) {
		if (multipart.name !== 'file') {
			return;
		}

		const buffer = multipart.data;
		const fileType = await fileTypeFromBuffer(buffer);

		if (fileType === undefined) {
			continue;
		}

		const sizes: Record<string, string> = {};

		for (const size of TYPE_SIZE_MAP[type]) {
			const resized = (
				await sharp(buffer).resize(size, size).toBuffer()
			).toString('base64');

			sizes[size.toString()] = `data:${fileType.mime};base64,${resized}`;
		}

		results[multipart.filename!] = sizes;
	}

	return results;
});
