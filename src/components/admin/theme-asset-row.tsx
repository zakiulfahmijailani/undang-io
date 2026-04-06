'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, FileAudio, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { AssetKind, AdminThemeAsset } from '@/types/theme'
import { saveUploadedAsset } from '@/app/dashboard/themes/actions'

interface ThemeAssetRowProps {
  themeKey: string;
  slot: AssetKind;
  label: string;
  description: string;
  idealSize: string;
  needsTransparent: boolean;
  currentAsset: AdminThemeAsset | null;
  onUploadSuccess: (slot: AssetKind, url: string, asset: AdminThemeAsset) => void;
  onDelete: (slot: AssetKind) => void;
  onHover: (slot: AssetKind | null) => void;
}

export function ThemeAssetRow({
  themeKey,
  slot,
  label,
  description,
  idealSize,
  needsTransparent,
  currentAsset,
  onUploadSuccess,
  onDelete,
  onHover
}: ThemeAssetRowProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [warningMsg, setWarningMsg] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use createBrowserClient for client-side uploads
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const isAudio = slot === 'music'
  const maxBytes = isAudio ? 5 * 1024 * 1024 : 10 * 1024 * 1024

  const validateFile = (file: File): boolean => {
    setErrorMsg(null)
    setWarningMsg(null)

    if (file.size > maxBytes) {
      setErrorMsg(`File size exceeds ${isAudio ? '5MB' : '10MB'}.`)
      return false
    }

    if (isAudio) {
      if (!file.type.startsWith('audio/')) {
        setErrorMsg('Only audio files are allowed for this slot.')
        return false
      }
    } else {
      const allowedImgTypes = ['image/png', 'image/webp', 'image/svg+xml']
      if (!allowedImgTypes.includes(file.type)) {
        if (needsTransparent) {
          setErrorMsg('Only PNG, WebP, or SVG is allowed for transparent slots.')
          return false
        } else if (!file.type.startsWith('image/')) {
          setErrorMsg('Only image files are allowed.')
          return false
        }
      }
      // If it's not transparent but needs to be...?
      if (needsTransparent && file.type === 'image/jpeg') {
         setErrorMsg('JPEG does not support transparency. Use PNG or WebP.')
         return false
      }
    }

    // We could do dimensions check here using Image(), but keeping it simple/async
    return true
  }

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return

    try {
      setIsUploading(true)
      setProgress(10)
      
      // Optimistic UI preview
      if (!isAudio) {
        setTempPreviewUrl(URL.createObjectURL(file))
      }
      
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      // Overwrite behavior: using just the slot name could work, but supabase cache might be sticky.
      // Using `upsert: true`
      const storagePath = `themes/${themeKey}/${slot}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('theme-assets')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        })
        
      // Simulating progress
      setProgress(50)

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('theme-assets')
        .getPublicUrl(storagePath)

      setProgress(80)

      // Use timestamp bust parameter
      const bustedUrl = `${publicUrl}?t=${timestamp}`

      // Metadata to save
      // Optionally read actual width/height via Image() here for metadata
      const extraMeta = {
        mime_type: file.type,
        file_size_bytes: file.size,
        is_transparent: needsTransparent
      }

      // Save to database
      const result = await saveUploadedAsset(themeKey, slot, bustedUrl, storagePath, extraMeta)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setProgress(100)
      onUploadSuccess(slot, bustedUrl, result.data)
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed')
      setTempPreviewUrl(null)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this asset?')) {
      onDelete(slot)
      setTempPreviewUrl(null)
    }
  }

  const assetUrl = tempPreviewUrl || currentAsset?.file_url;
  
  // Minimal status display
  let statusBadge = (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">EMPTY</span>
  )
  if (isUploading) {
    statusBadge = (
      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-400 border border-yellow-800">UPLOADING</span>
    )
  } else if (errorMsg) {
    statusBadge = (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-500 border border-red-700">ERROR</span>
    )
  } else if (assetUrl) {
    statusBadge = (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-800">UPLOADED</span>
    )
  }

  return (
    <div 
      className={`border rounded-lg p-3 bg-surface border-white/5 transition-all
        ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : ''}
        hover:border-white/20
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => onHover(slot)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail Preview Area */}
        <div 
          className="w-16 h-16 shrink-0 bg-surface-2 rounded-md border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer relative group"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {assetUrl ? (
            isAudio ? (
              <FileAudio className="w-6 h-6 text-emerald-500" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assetUrl} alt={label} className="w-full h-full object-cover" />
            )
          ) : (
             <UploadCloud className="w-6 h-6 text-white/30 group-hover:text-emerald-500 transition-colors" />
          )}
          {assetUrl && !isUploading && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <RefreshCw className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">{slot}</span>
              {statusBadge}
            </div>
            
            {/* Actions for uploaded file */}
            {assetUrl && !isUploading && (
               <button 
                onClick={handleDelete}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Delete Asset"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            )}
          </div>
          
          <h4 className="text-sm font-medium text-white truncate">{label}</h4>
          <p className="text-xs text-white/40 leading-relaxed truncate">{description}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-white/30 bg-surface-2 px-1.5 py-0.5 rounded">
              Size: {idealSize}
            </span>
            {needsTransparent && (
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950 px-1.5 py-0.5 rounded">
                Transparent PNG
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar & Error Display */}
      {isUploading && (
        <div className="mt-3 h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {errorMsg && (
        <div className="mt-2 text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-900">
          {errorMsg}
        </div>
      )}
      {warningMsg && (
        <div className="mt-2 text-xs text-amber-400 bg-amber-950/50 p-2 rounded border border-amber-900">
          {warningMsg}
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={isAudio ? "audio/mpeg,audio/mp3" : (needsTransparent ? "image/png,image/webp,image/svg+xml" : "image/*")}
        onChange={handleFileChange}
      />
    </div>
  )
}
