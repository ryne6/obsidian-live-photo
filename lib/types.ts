// 类型定义文件

export interface LivePhotoExtractResult {
	imageUrl: string;
	videoUrl: string;
}

export interface LivePhotoBlockParams {
	image?: string;
	video?: string;
}

export interface LivePhotoConfig {
	imagePath: string;
	videoPath: string;
}

// 错误类型
export class LivePhotoError extends Error {
	constructor(message: string, public readonly code: string) {
		super(message);
		this.name = 'LivePhotoError';
	}
}

// 错误代码常量
export const ERROR_CODES = {
	NO_IMAGE: 'NO_IMAGE',
	FETCH_FAILED: 'FETCH_FAILED',
	EXTRACTION_FAILED: 'EXTRACTION_FAILED',
	INVALID_FORMAT: 'INVALID_FORMAT',
	LOAD_FAILED: 'LOAD_FAILED'
} as const; 
