// 工具函数

import { LivePhotoBlockParams } from './types';

/**
 * 解析代码块参数
 */
export function parseBlockParams(source: string): LivePhotoBlockParams {
	const lines = source.trim().split('\n');
	const params: LivePhotoBlockParams = {};

	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) continue;
		
		const key = line.substring(0, colonIndex).trim().toLowerCase();
		const value = line.substring(colonIndex + 1).trim();
		
		if (key === 'image') {
			params.image = value;
		} else if (key === 'video') {
			params.video = value;
		}
	}

	return params;
}

/**
 * 创建错误元素
 */
export function createErrorElement(container: HTMLElement, message: string): void {
	container.createEl('div', {
		text: message,
		cls: 'live-photo-error'
	});
}

/**
 * 检查URL是否有效
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

/**
 * 检查是否为图片文件
 */
export function isImageFile(filename: string): boolean {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
	const lowerFilename = filename.toLowerCase();
	return imageExtensions.some(ext => lowerFilename.endsWith(ext));
}

/**
 * 检查是否为视频文件
 */
export function isVideoFile(filename: string): boolean {
	const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
	const lowerFilename = filename.toLowerCase();
	return videoExtensions.some(ext => lowerFilename.endsWith(ext));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	
	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
} 
