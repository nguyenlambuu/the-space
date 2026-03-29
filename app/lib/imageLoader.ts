// app/lib/imageLoader.ts
import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

export async function loadImageTexture(imageUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      imageUrl,
      (texture) => {
        // Optimize texture
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        
        // Compress if needed
        if (texture.image.width > 1024) {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = 1024
          canvas.height = Math.round((texture.image.height / texture.image.width) * 1024)
          ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height)
          texture.image = canvas
        }
        
        resolve(texture)
      },
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(0)}%`)
      },
      (error) => {
        console.error('Error loading image:', imageUrl, error)
        reject(error)
      }
    )
  })
}

// Create placeholder texture
export function createPlaceholderTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#E2E0DA'
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = '#C8B89A'
  ctx.font = '20px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('Image', 128, 100)
  ctx.fillText('Loading...', 128, 130)
  
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
