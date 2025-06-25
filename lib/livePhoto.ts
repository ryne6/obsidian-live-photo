// 提取LivePhoto（OPPO手机格式）中的图片和视频
export function extractLivePhoto(file: File): Promise<{ imageUrl: string, videoUrl: string }> {
	return new Promise((resolve, reject) => {
		if (!file) {
			reject(new Error('无文件'))
			return
		}

		const fileName = file.name
		if (!fileName.endsWith('.jpg')) {
			reject(new Error('不支持此格式，请选择一个动态照片文件 (.jpg)'))
			return
		}

		file.arrayBuffer().then(buffer => {
			try {
				const result = parseLivePhotoContent(buffer)

				if (!result) {
					reject(new Error('文件读取失败'))
					return
				}

				resolve(result)
			} catch {
				reject(new Error('文件读取失败'))
			}
		}).catch(() => {
			reject(new Error('文件读取失败'))
		})
	})
}

function findByteSequence(sourceArray: Uint8Array, targetSequence: Uint8Array) {
	const firstByte = targetSequence[0]
	const sequenceLength = targetSequence.length

	let currentIndex = sourceArray.indexOf(firstByte)
	while (currentIndex !== -1) {
		if (sourceArray.subarray(currentIndex, currentIndex + sequenceLength).every((value, index) => value === targetSequence[index])) {
			return currentIndex
		}
		currentIndex = sourceArray.indexOf(firstByte, currentIndex + 1)
	}
	return -1
}

export function parseLivePhotoContent(buffer: ArrayBuffer) {
	const byteArray = new Uint8Array(buffer)
	const decoder = new TextDecoder()
	const fileContent = decoder.decode(byteArray)
	
	// 提取XMP元数据
	const xmpStartIndex = fileContent.indexOf('<x:xmpmeta')
	const xmpEndIndex = fileContent.indexOf('</x:xmpmeta>') + 12
	let videoStartPosition = -1
	
	const ftypSignature = new TextEncoder().encode('ftyp')
	const ftypPosition = findByteSequence(byteArray, ftypSignature) - 4
	const skipXmpParsing = false
	
	if (xmpStartIndex === -1 || xmpEndIndex === -1 || skipXmpParsing) {
		if (ftypPosition > 0) {
			videoStartPosition = ftypPosition
		}
		else {
			console.log('不存在内嵌视频。')
			return
		}
	}
	else {
		const xmpContent = fileContent.slice(xmpStartIndex, xmpEndIndex)
		const containerMatches = xmpContent.matchAll(/<Container:Item[^>]*Item:Mime="video\/mp4"[^>]*Item:Length="(\d+)"[^>]*\/>/g)
		const microVideoMatches = xmpContent.matchAll(/GCamera:MicroVideoOffset=["'](\d+)["']/g)
		let videoLength = null

		for (const match of containerMatches) {
			videoLength = Number.parseInt(match[1], 10)
		}
		for (const match of microVideoMatches) {
			videoLength = Number.parseInt(match[1], 10)
		}

		if (videoLength === null) {
			return
		}

		videoStartPosition = buffer.byteLength - videoLength
		if (videoStartPosition === ftypPosition) {
			// 位置一致，正常情况
		}
		else if (ftypPosition > 0) {
			console.log('发现不一致的视频定位信息')
		}
		else {
			console.log('存在XMP视频信息但视频文件头检测异常')
		}
	}

	if (videoStartPosition < 0 || videoStartPosition > buffer.byteLength) {
		console.log('找不到内嵌的视频')
		return
	}

	const videoData = byteArray.slice(videoStartPosition)
	const videoBlob = new Blob([videoData], { type: 'video/mp4' })
	const videoUrl = URL.createObjectURL(videoBlob)

	const imageData = byteArray.slice(0, videoStartPosition)
	const imageBlob = new Blob([imageData], { type: 'image/jpeg' })
	const imageUrl = URL.createObjectURL(imageBlob)

	return {
		imageUrl,
		videoUrl,
	}
}