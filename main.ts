import { Plugin } from 'obsidian';
import { extractLivePhoto } from './lib/livePhoto';
import { LivePhotoExtractResult, LivePhotoError, ERROR_CODES } from './lib/types';
import { parseBlockParams, createErrorElement, isValidUrl } from './lib/utils';

export default class LivePhotoPlugin extends Plugin {
	private liveSvgContent = '';

	async onload() {
		console.log('Loading Live Photo Plugin');

		// 加载 SVG 文件内容
		await this.loadSvgContent();

		// 注册代码块处理器
		this.registerMarkdownCodeBlockProcessor('live', (source, el, ctx) => {
			this.renderLivePhotoBlock(source, el, ctx);
		});
	}

	onunload() {
		console.log('Unloading Live Photo Plugin');
	}

	/**
	 * 加载 SVG 图标内容
	 */
	private async loadSvgContent(): Promise<void> {
		try {
			const adapter = this.app.vault.adapter;
			const svgPath = `${this.manifest.dir}/live.svg`;
			this.liveSvgContent = await adapter.read(svgPath);
		} catch (error) {
			console.error('Failed to load live.svg:', error);
			// 使用备用图标
			this.liveSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>`;
		}
	}

	/**
	 * 渲染 Live Photo 代码块
	 */
	private async renderLivePhotoBlock(source: string, el: HTMLElement, ctx: any): Promise<void> {
		try {
			const params = parseBlockParams(source);

			if (!params.image) {
				throw new LivePhotoError('请提供 image 路径', ERROR_CODES.NO_IMAGE);
			}

			// 验证图片URL
			if (!isValidUrl(params.image)) {
				throw new LivePhotoError('图片URL格式无效', ERROR_CODES.INVALID_FORMAT);
			}

			let imagePath = params.image;
			let videoPath = params.video;

			// 如果没有提供 video，尝试从 image 中提取
			if (!videoPath) {
				const extractedPaths = await this.tryExtractLivePhoto(imagePath);
				if (extractedPaths) {
					imagePath = extractedPaths.imageUrl;
					videoPath = extractedPaths.videoUrl;
				} else {
					throw new LivePhotoError(
						'无法从图片中提取视频，请同时提供 image 和 video 路径',
						ERROR_CODES.EXTRACTION_FAILED
					);
				}
			}

			// 验证视频URL（如果手动提供）
			if (params.video && !isValidUrl(params.video)) {
				throw new LivePhotoError('视频URL格式无效', ERROR_CODES.INVALID_FORMAT);
			}

			this.createLivePhotoViewer(imagePath, videoPath, el);
		} catch (error) {
			this.handleError(error, el);
		}
	}

	/**
	 * 尝试从图片中提取 Live Photo
	 */
	private async tryExtractLivePhoto(imagePath: string): Promise<LivePhotoExtractResult | null> {
		try {
			const response = await fetch(imagePath);
			if (!response.ok) {
				throw new LivePhotoError(`获取图片失败: ${response.statusText}`, ERROR_CODES.FETCH_FAILED);
			}
			
			const blob = await response.blob();
			
			// 检查文件类型
			if (!blob.type.startsWith('image/')) {
				throw new LivePhotoError('文件不是有效的图片格式', ERROR_CODES.INVALID_FORMAT);
			}

			const file = new File([blob], 'livephoto.jpg', { type: 'image/jpeg' });
			const result = await extractLivePhoto(file);
			
			return result;
		} catch (error) {
			if (error instanceof LivePhotoError) {
				throw error;
			}
			console.log('Live Photo extraction failed:', error);
			return null;
		}
	}

	/**
	 * 创建 Live Photo 查看器
	 */
	private createLivePhotoViewer(imagePath: string, videoPath: string, el: HTMLElement): void {
		// 创建容器
		const container = el.createEl('div', { cls: 'live-photo-container' });

		// 创建图片元素
		const img = container.createEl('img', {
			cls: 'live-photo-image',
			attr: { src: imagePath, alt: 'Live Photo' }
		});

		// 创建视频元素
		const video = container.createEl('video', {
			cls: 'live-photo-video',
			attr: {
				src: videoPath,
				muted: 'true',
				preload: 'metadata'
			}
		});

		// 创建控制图标
		const iconContainer = container.createEl('div', { cls: 'live-photo-icon' });
		iconContainer.innerHTML = this.liveSvgContent;

		// 设置播放控制
		this.setupPlaybackControls(img, video, iconContainer);

		// 设置错误处理
		this.setupErrorHandling(img, video, container);
	}

	/**
	 * 设置播放控制
	 */
	private setupPlaybackControls(img: HTMLImageElement, video: HTMLVideoElement, iconContainer: HTMLElement): void {
		let isPlaying = false;

		const togglePlayback = () => {
			if (isPlaying) {
				// 停止播放
				video.pause();
				video.currentTime = 0;
				img.style.opacity = '1';
				video.style.opacity = '0';
				isPlaying = false;
			} else {
				// 开始播放
				img.style.opacity = '0';
				video.style.opacity = '1';
				video.currentTime = 0;
				video.play().catch(error => {
					console.error('Video playback failed:', error);
					// 回退到图片
					img.style.opacity = '1';
					video.style.opacity = '0';
					isPlaying = false;
				});
				isPlaying = true;
			}
		};

		// 点击图标切换播放状态
		iconContainer.addEventListener('click', (e) => {
			e.stopPropagation();
			togglePlayback();
		});

		// 视频结束后自动回到图片
		video.addEventListener('ended', () => {
			img.style.opacity = '1';
			video.style.opacity = '0';
			isPlaying = false;
		});
	}

	/**
	 * 设置错误处理
	 */
	private setupErrorHandling(img: HTMLImageElement, video: HTMLVideoElement, container: HTMLElement): void {
		img.addEventListener('error', () => {
			container.innerHTML = '<div class="live-photo-error">图片加载失败</div>';
		});

		video.addEventListener('error', () => {
			container.innerHTML = '<div class="live-photo-error">视频加载失败</div>';
		});
	}

	/**
	 * 统一错误处理
	 */
	private handleError(error: unknown, el: HTMLElement): void {
		let message = 'Live Photo: 发生未知错误';

		if (error instanceof LivePhotoError) {
			message = `Live Photo: ${error.message}`;
		} else if (error instanceof Error) {
			message = `Live Photo: ${error.message}`;
		}

		console.error('Live Photo Error:', error);
		createErrorElement(el, message);
	}
}
