import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from "firebase/storage"
import { getFirebaseStorage } from "./client"
import { isFirebaseEnabled } from "./config"

export async function uploadFile(
  path: string, 
  file: File | Blob, 
  onProgress?: (progress: number) => void
): Promise<string | null> {
  if (!isFirebaseEnabled) {
    console.warn("Firebase Storage is not available")
    return null
  }

  const storage = getFirebaseStorage()
  if (!storage) {
    console.warn("Firebase Storage is not configured")
    return null
  }

  try {
    const storageRef = ref(storage, path)
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file)
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress(progress)
          },
          (error) => {
            console.error("Upload error:", error)
            reject(error)
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        )
      })
    } else {
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    }
  } catch (error) {
    console.error("File upload error:", error)
    return null
  }
}

export async function deleteFile(path: string): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return false
  }

  const storage = getFirebaseStorage()
  if (!storage) {
    return false
  }

  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    return true
  } catch (error) {
    console.error("File deletion error:", error)
    return false
  }
}

export async function getFileURL(path: string): Promise<string | null> {
  if (!isFirebaseEnabled) {
    return null
  }

  const storage = getFirebaseStorage()
  if (!storage) {
    return null
  }

  try {
    const storageRef = ref(storage, path)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Get file URL error:", error)
    return null
  }
}

export async function listFiles(path: string) {
  if (!isFirebaseEnabled) {
    return []
  }

  const storage = getFirebaseStorage()
  if (!storage) {
    return []
  }

  try {
    const storageRef = ref(storage, path)
    const result = await listAll(storageRef)
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef)
        const downloadURL = await getDownloadURL(itemRef)
        
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          downloadURL
        }
      })
    )
    
    return files
  } catch (error) {
    console.error("List files error:", error)
    return []
  }
}

export async function getFileMetadata(path: string) {
  if (!isFirebaseEnabled) {
    return null
  }

  const storage = getFirebaseStorage()
  if (!storage) {
    return null
  }

  try {
    const storageRef = ref(storage, path)
    const metadata = await getMetadata(storageRef)
    return metadata
  } catch (error) {
    console.error("Get metadata error:", error)
    return null
  }
}
