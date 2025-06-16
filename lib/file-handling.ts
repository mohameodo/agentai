export interface Attachment {
  name: string
  url: string // Changed from url?: string
  type: string
  size: number
  data?: string // base64 encoded data
  lastModified?: number
}

export interface FileUploadResult {
  url: string
  filename: string
  contentType: string
  size: number
}

export async function uploadFile(file: File): Promise<FileUploadResult> {
  // TODO: Implement Firebase Storage upload
  // For now, return a mock result
  return {
    url: URL.createObjectURL(file),
    filename: file.name,
    contentType: file.type,
    size: file.size
  }
}

export async function deleteFile(url: string): Promise<void> {
  // TODO: Implement Firebase Storage delete
  console.log("Delete file:", url)
}

export function createAttachmentFromFile(file: File, data?: string): Attachment {
  return {
    name: file.name,
    url: URL.createObjectURL(file), // Added this line
    type: file.type,
    size: file.size,
    data,
    lastModified: file.lastModified
  }
}

export function isImageType(type: string): boolean {
  return type.startsWith('image/')
}

export function isTextType(type: string): boolean {
  return type.startsWith('text/') || 
         ['application/json', 'application/javascript', 'application/typescript'].includes(type)
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'text/plain',
  'text/markdown',
  'application/json',
  'application/javascript',
  'application/typescript',
  'text/css',
  'text/html'
]

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `File type ${file.type} is not allowed`
  }
  
  return null
}

// Add missing functions
export async function checkFileUploadLimit(userId: string): Promise<void> {
  // TODO: Implement file upload limit checking
  // For now, just return without checking
  return Promise.resolve()
}

export async function processFiles(files: File[], chatId: string, userId: string): Promise<Attachment[]> {
  // TODO: Implement file processing
  // For now, just create attachments from files
  return files.map(file => createAttachmentFromFile(file))
}
