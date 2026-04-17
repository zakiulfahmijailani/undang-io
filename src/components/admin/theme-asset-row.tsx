'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, FileAudio, Trash2, RefreshCw, Upload } from 'lucide-react'
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
  const [showSuccess, setShowSuccess] = useState(false)
  
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
      
      // Flash success border
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1500)
      
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
  const hasAsset = !!assetUrl;

  return (
    <div 
      className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all
        ${isDragging 
          ? 'bg-emerald-500/10 border border-emerald-500/40' 
          : showSuccess
            ? 'bg-emerald-500/[0.06] border border-emerald-500/30'
            : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => onHover(slot)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Thumbnail */}
      <div 
        className={`w-12 h-12 rounded-lg shrink-0 overflow-hidden flex items-center justify-center cursor-pointer relative
          ${hasAsset 
            ? 'border border-white/[0.1] bg-white/[0.05]' 
            : 'border border-dashed border-white/[0.12] bg-white/[0.02]'
          }
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {assetUrl ? (
          isAudio ? (
            <FileAudio className="w-5 h-5 text-emerald-500" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetUrl} alt={label} className="w-full h-full object-cover" />
          )
        ) : (
          <UploadCloud className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
        )}
        {/* Replace overlay on hover for existing assets */}
        {hasAsset && !isUploading && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <RefreshCw className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-white truncate">{label}</span>
          {needsTransparent && (
            <span className="text-[10px] text-white/40 border border-white/[0.1] px-1.5 py-0.5 rounded-full leading-none shrink-0">
              PNG
            </span>
          )}
        </div>
        <span className="text-[11px] text-white/30">{idealSize}</span>
      </div>

      {/* Status indicator (subtle dot) */}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        isUploading 
          ? 'bg-amber-400 animate-pulse' 
          : hasAsset 
            ? 'bg-emerald-500' 
            : 'bg-white/[0.15]'
      }`} />

      {/* Actions — hover reveal */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {hasAsset && !isUploading ? (
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
            title="Hapus aset"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : !isUploading ? (
          <label 
            className="p-1.5 rounded-lg hover:bg-white/[0.1] text-white/40 hover:text-white cursor-pointer transition-all"
            title="Upload aset"
          >
            <Upload className="w-3.5 h-3.5" />
            <input 
              type="file" 
              className="sr-only" 
              accept={isAudio ? "audio/mpeg,audio/mp3" : (needsTransparent ? "image/png,image/webp,image/svg+xml" : "image/*")}
              onChange={handleFileChange}
            />
          </label>
        ) : null}
      </div>

      {/* Upload Progress Bar — thin line at bottom */}
      {isUploading && (
        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Hidden File Input (main) */}
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={isAudio ? "audio/mpeg,audio/mp3" : (needsTransparent ? "image/png,image/webp,image/svg+xml" : "image/*")}
        onChange={handleFileChange}
      />

      {/* Error message — appears below card via a sibling approach won't work here, 
           so we overlay it as a tooltip-like element */}
      {errorMsg && (
        <div className="absolute -bottom-7 left-0 right-0 z-10">
          <div className="text-[10px] text-red-400 bg-red-950/90 px-2.5 py-1 rounded-lg border border-red-900/50 truncate">
            {errorMsg}
          </div>
        </div>
      )}
    </div>
  )
}
