export type ImageType =
	| 'subscriber-badge'
	| 'badge-flair'
	| 'bit-badge'
	| 'channel-redeem';

export type ImageResponse = Record<string, string>;

export type ImageResponseMap = Record<string, ImageResponse>;
