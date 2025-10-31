// Cloudinary REST API upload utility
// Using direct REST API calls for client-side uploads

export interface UploadResult {
  secure_url: string
  public_id: string
}

// Upload image to Cloudinary
export async function uploadImage(file: File): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your .env.local file.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'arogya-courses')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary')
  }

  const data = await response.json()
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  }
}

// Upload multiple images
export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  return Promise.all(files.map(file => uploadImage(file)))
}
