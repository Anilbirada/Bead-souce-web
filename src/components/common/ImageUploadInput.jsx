import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export default function ImageUploadInput({ 
  label = "Banner Image", 
  value = "", 
  onChange, 
  required = false 
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, AVIF, SVG).');
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        try {
          // Upload to server endpoint to get permanent server URL
          const serverUrl = await api.uploadImage(dataUrl, file.name);
          onChange(serverUrl || dataUrl);
        } catch (err) {
          // Fallback to data URL
          onChange(dataUrl);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Error reading file. Please try again or paste a URL.');
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#191F23]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-0.5 rounded-lg border border-[#DDD6C8] text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              mode === 'upload' 
                ? 'bg-[#176B68] text-white font-bold shadow-2xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              mode === 'url' 
                ? 'bg-[#176B68] text-white font-bold shadow-2xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Preview if image is present */}
      {value && (
        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#DDD6C8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#DDD6C8] bg-white shrink-0">
              <img 
                src={value} 
                alt="Selected asset preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#191F23] truncate">
                {value.startsWith('data:') ? 'Custom Uploaded Image' : value.split('/').pop()}
              </p>
              <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Image Asset Ready</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode: Upload from Local Machine */}
      {mode === 'upload' && !value && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileProcess(e.target.files[0])}
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#176B68] bg-[#EBF4F3]'
                : 'border-[#DDD6C8] bg-[#FAF8F5] hover:border-[#176B68] hover:bg-white'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="w-6 h-6 text-[#176B68] animate-spin" />
                <span className="text-[11px] text-[#176B68] font-semibold">Processing &amp; optimizing image...</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-[#DDD6C8] flex items-center justify-center mx-auto text-[#176B68]">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#176B68] hover:underline">
                    Click to upload from device
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  PNG, JPG, WEBP, AVIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode: Manual URL Input */}
      {mode === 'url' && !value && (
        <div className="relative">
          <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            required={required}
            placeholder="https://example.com/gemstone-banner.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#176B68]"
          />
        </div>
      )}

      {uploadError && (
        <p className="text-[10px] text-red-600 font-medium">{uploadError}</p>
      )}
    </div>
  );
}
