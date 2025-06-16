import { AnimatePresence, motion } from "motion/react"
import { FileItem } from "./file-items"
import { ProcessedImageData } from "@/lib/background-removal"

type FileListProps = {
  files: File[]
  onFileRemove: (file: File) => void
  onFileProcessed?: (processedImageData: ProcessedImageData) => void
}

const TRANSITION = {
  type: "spring" as const,
  duration: 0.2,
  stiffness: 260,
  damping: 20,
}

export function FileList({ files, onFileRemove, onFileProcessed }: FileListProps) {
  return (
    <AnimatePresence initial={false}>
      {files.length > 0 && (
        <motion.div
          key="files-list"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={TRANSITION}
          className="overflow-hidden"
        >
          <div className="flex flex-row overflow-x-auto pl-3">
            <AnimatePresence initial={false}>
              {files.map((file) => (
                <motion.div
                  key={file.name}
                  initial={{ width: 0 }}
                  animate={{ width: 180 }}
                  exit={{ width: 0 }}
                  transition={TRANSITION}
                  className="relative shrink-0 overflow-hidden pt-2"
                >
                  <FileItem
                    key={file.name}
                    file={file}
                    onRemove={onFileRemove}
                    onFileProcessed={onFileProcessed}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
