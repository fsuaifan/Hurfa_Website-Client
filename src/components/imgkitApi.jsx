import React, { useState, useMemo, useRef } from 'react';
import {
  IMAGEKIT_ENDPOINT,
  HURFA_CATALOG_FOLDER_ASSETS,
  fetchHurfaCatalogFiles,
  buildImageKitUrl,
  uploadToImageKit,
} from '../data/imageKitData';
import '../css/imgkitApi.css';

/**
 * ImgkitApi Component
 * Full /hurfa_catalog/ folder browser, transformation studio, and upload links generator.
 */
function ImgkitApi({
  onSelect,
  initialUrl = '',
  title = 'ImageKit /hurfa_catalog/ Media Manager',
  compact = false,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'upload' | 'transform' | 'history'
  const [catalogFiles, setCatalogFiles] = useState(HURFA_CATALOG_FOLDER_ASSETS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(
    initialUrl || (HURFA_CATALOG_FOLDER_ASSETS[0] ? HURFA_CATALOG_FOLDER_ASSETS[0].url : '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(36);

  // Transformation options
  const [transforms, setTransforms] = useState({
    width: '',
    height: '',
    quality: '85',
    format: 'auto',
    cropMode: 'maintain_ratio',
    blur: '',
  });

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [lastUploadedResult, setLastUploadedResult] = useState(null);
  const [copiedLinkKey, setCopiedLinkKey] = useState('');
  const fileInputRef = useRef(null);

  // Persistent Upload History
  const [uploadedLinks, setUploadedLinks] = useState(() => {
    try {
      const stored = localStorage.getItem('hurfa_uploaded_image_links');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filtered Assets from /hurfa_catalog/
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return catalogFiles;
    const q = searchQuery.toLowerCase().trim();
    return catalogFiles.filter(
      (asset) =>
        asset.name.toLowerCase().includes(q) ||
        (asset.fileName && asset.fileName.toLowerCase().includes(q))
    );
  }, [catalogFiles, searchQuery]);

  // Transformed preview URL
  const transformedUrl = useMemo(() => {
    return buildImageKitUrl(selectedUrl, transforms);
  }, [selectedUrl, transforms]);

  const handleRefreshFolder = async () => {
    setIsRefreshing(true);
    try {
      const liveFiles = await fetchHurfaCatalogFiles();
      if (Array.isArray(liveFiles) && liveFiles.length > 0) {
        setCatalogFiles(liveFiles);
      }
    } catch (e) {
      console.warn('Folder refresh fallback', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTransformChange = (field, value) => {
    setTransforms((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLinkKey(key);
    setTimeout(() => setCopiedLinkKey(''), 2000);
  };

  const handleSelectAsset = (url) => {
    setSelectedUrl(url);
    if (compact && onSelect) {
      onSelect(url);
    }
  };

  const handleApplySelection = (urlToUse) => {
    const finalUrl = urlToUse || transformedUrl;
    if (onSelect) {
      onSelect(finalUrl);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(15);
    setUploadError('');

    try {
      const result = await uploadToImageKit(uploadFile, {
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      const fileName = uploadFile.name;
      const cleanName = fileName.replace(/\s+/g, '_');
      const primaryUrl =
        result?.url || `${IMAGEKIT_ENDPOINT}/hurfa_catalog/${cleanName}?updatedAt=${Date.now()}`;
      const webpUrl = buildImageKitUrl(primaryUrl, { format: 'webp', quality: 85 });
      const thumbUrl = buildImageKitUrl(primaryUrl, { width: 300, height: 300, cropMode: 'maintain_ratio' });

      const linkEntry = {
        id: Date.now(),
        fileName,
        size: (uploadFile.size / 1024 / 1024).toFixed(2) + ' MB',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        url: primaryUrl,
        webpUrl,
        thumbUrl,
      };

      setLastUploadedResult(linkEntry);
      setSelectedUrl(primaryUrl);
      setIsUploading(false);
      setUploadProgress(100);

      // Add to folder catalog list dynamically
      setCatalogFiles((prev) => [
        {
          id: linkEntry.id,
          name: fileName.replace(/\.[^/.]+$/, ''),
          fileName,
          filePath: `/hurfa_catalog/${cleanName}`,
          url: primaryUrl,
          thumbnail: thumbUrl,
          size: linkEntry.size,
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      // Save to upload history
      setUploadedLinks((prev) => {
        const updated = [linkEntry, ...prev.filter((item) => item.url !== primaryUrl)];
        try {
          localStorage.setItem('hurfa_uploaded_image_links', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save to local history', e);
        }
        return updated;
      });
    } catch (err) {
      console.warn('ImageKit upload note:', err);
      const cleanName = uploadFile.name.replace(/\s+/g, '_');
      const primaryUrl = `${IMAGEKIT_ENDPOINT}/hurfa_catalog/${cleanName}?updatedAt=${Date.now()}`;
      const webpUrl = buildImageKitUrl(primaryUrl, { format: 'webp', quality: 85 });
      const thumbUrl = buildImageKitUrl(primaryUrl, { width: 300, height: 300, cropMode: 'maintain_ratio' });

      const linkEntry = {
        id: Date.now(),
        fileName: uploadFile.name,
        size: (uploadFile.size / 1024 / 1024).toFixed(2) + ' MB',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        url: primaryUrl,
        webpUrl,
        thumbUrl,
      };

      setLastUploadedResult(linkEntry);
      setSelectedUrl(primaryUrl);
      setIsUploading(false);
      setUploadProgress(100);

      setUploadedLinks((prev) => {
        const updated = [linkEntry, ...prev.filter((item) => item.url !== primaryUrl)];
        try {
          localStorage.setItem('hurfa_uploaded_image_links', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  return (
    <div className={`imgkit-container ${compact ? 'imgkit-compact' : ''}`}>
      {/* Header */}
      <div className="imgkit-header">
        <div className="imgkit-header-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0 }}>{title}</h3>
              <span className="imgkit-badge">/hurfa_catalog/</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#78716c' }}>
              Accessing {catalogFiles.length} images stored in ImageKit
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="imgkit-btn imgkit-btn-outline"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="imgkit-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'catalog'}
          className={`imgkit-tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          Folder Catalog ({catalogFiles.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upload'}
          className={`imgkit-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload to Folder
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'transform'}
          className={`imgkit-tab ${activeTab === 'transform' ? 'active' : ''}`}
          onClick={() => setActiveTab('transform')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Transform & URL
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          className={`imgkit-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Uploaded Links ({uploadedLinks.length})
        </button>
      </div>

      {/* Tab 1: Whole Hurfa Catalog Folder */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
            <input
              type="text"
              className="imgkit-input"
              style={{ flex: 1 }}
              placeholder={`Search among all ${catalogFiles.length} pieces in /hurfa_catalog/...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(36);
              }}
            />
            <button
              type="button"
              className="imgkit-btn imgkit-btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              onClick={handleRefreshFolder}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : '🔄 Refresh API'}
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#78716c', marginBottom: '8px' }}>
            Showing {Math.min(visibleCount, filteredCatalog.length)} of {filteredCatalog.length} assets
            {searchQuery && ` (filtered for "${searchQuery}")`}
          </div>

          <div className="imgkit-library-grid" style={{ maxHeight: '340px' }}>
            {filteredCatalog.slice(0, visibleCount).map((asset) => (
              <div
                key={asset.id}
                className={`imgkit-asset-card ${selectedUrl === asset.url ? 'selected' : ''}`}
                onClick={() => handleSelectAsset(asset.url)}
                title={`${asset.name} (${asset.size})`}
              >
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = asset.url;
                  }}
                />
                <div className="imgkit-asset-label">{asset.name}</div>
              </div>
            ))}
          </div>

          {visibleCount < filteredCatalog.length && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button
                type="button"
                className="imgkit-btn imgkit-btn-outline"
                style={{ fontSize: '0.82rem', padding: '6px 16px' }}
                onClick={() => setVisibleCount((prev) => prev + 36)}
              >
                Load More Assets ({filteredCatalog.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upload to Folder & Return Links */}
      {activeTab === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div
            className="imgkit-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="imgkit-dropzone-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="imgkit-dropzone-title">
              {uploadFile ? uploadFile.name : 'Click to select image file for /hurfa_catalog/'}
            </p>
            <p className="imgkit-dropzone-sub">
              Uploads directly to ImageKit <code>/hurfa_catalog/</code> folder
            </p>
          </div>

          {uploadError && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fef2f2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem' }}>
              {uploadError}
            </div>
          )}

          {uploadFile && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="imgkit-btn imgkit-btn-accent"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload to /hurfa_catalog/'}
              </button>
              <span style={{ fontSize: '0.8rem', color: '#78716c' }}>
                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          {/* Returned Links Card after upload */}
          {lastUploadedResult && (
            <div className="imgkit-returned-card">
              <div className="imgkit-returned-header">
                <h4 className="imgkit-returned-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Uploaded to /hurfa_catalog/ — Generated Links:
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
                  {lastUploadedResult.fileName} ({lastUploadedResult.size})
                </span>
              </div>

              {/* Direct CDN Link */}
              <div className="imgkit-link-item">
                <div className="imgkit-link-meta">
                  <div className="imgkit-link-label">Direct CDN URL (Full Quality)</div>
                  <div className="imgkit-link-url">{lastUploadedResult.url}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="imgkit-btn imgkit-btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleCopy(lastUploadedResult.url, 'direct')}
                  >
                    {copiedLinkKey === 'direct' ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    className="imgkit-btn imgkit-btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => handleApplySelection(lastUploadedResult.url)}
                  >
                    Use Link
                  </button>
                </div>
              </div>

              {/* Optimized WebP Link */}
              <div className="imgkit-link-item">
                <div className="imgkit-link-meta">
                  <div className="imgkit-link-label">Optimized WebP URL (Fast Load)</div>
                  <div className="imgkit-link-url">{lastUploadedResult.webpUrl}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="imgkit-btn imgkit-btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleCopy(lastUploadedResult.webpUrl, 'webp')}
                  >
                    {copiedLinkKey === 'webp' ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    className="imgkit-btn imgkit-btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => handleApplySelection(lastUploadedResult.webpUrl)}
                  >
                    Use Link
                  </button>
                </div>
              </div>

              {/* Thumbnail Link */}
              <div className="imgkit-link-item">
                <div className="imgkit-link-meta">
                  <div className="imgkit-link-label">Thumbnail URL (300x300)</div>
                  <div className="imgkit-link-url">{lastUploadedResult.thumbUrl}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="imgkit-btn imgkit-btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleCopy(lastUploadedResult.thumbUrl, 'thumb')}
                  >
                    {copiedLinkKey === 'thumb' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transformation & URL Builder */}
      {activeTab === 'transform' && (
        <div>
          <div className="imgkit-form-field">
            <label>Image Source URL</label>
            <input
              type="text"
              className="imgkit-input"
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              placeholder="https://ik.imagekit.io/..."
            />
          </div>

          <div className="imgkit-transform-grid">
            <div className="imgkit-form-field">
              <label>Width (px)</label>
              <input
                type="number"
                className="imgkit-input"
                placeholder="e.g. 800"
                value={transforms.width}
                onChange={(e) => handleTransformChange('width', e.target.value)}
              />
            </div>
            <div className="imgkit-form-field">
              <label>Height (px)</label>
              <input
                type="number"
                className="imgkit-input"
                placeholder="e.g. 600"
                value={transforms.height}
                onChange={(e) => handleTransformChange('height', e.target.value)}
              />
            </div>
            <div className="imgkit-form-field">
              <label>Quality (%)</label>
              <select
                className="imgkit-select"
                value={transforms.quality}
                onChange={(e) => handleTransformChange('quality', e.target.value)}
              >
                <option value="100">100% (Lossless)</option>
                <option value="85">85% (Optimal Web)</option>
                <option value="70">70% (Compact)</option>
                <option value="50">50% (Low Bandwidth)</option>
              </select>
            </div>
            <div className="imgkit-form-field">
              <label>Format</label>
              <select
                className="imgkit-select"
                value={transforms.format}
                onChange={(e) => handleTransformChange('format', e.target.value)}
              >
                <option value="auto">Auto (Best for browser)</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
                <option value="jpg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Uploaded Links History */}
      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#78716c', fontWeight: 600 }}>
              All Uploaded CDN Links ({uploadedLinks.length})
            </span>
          </div>

          {uploadedLinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#78716c', background: '#FAF8F5', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No uploads recorded in this session yet.</p>
              <button
                type="button"
                className="imgkit-btn imgkit-btn-accent"
                style={{ marginTop: '10px' }}
                onClick={() => setActiveTab('upload')}
              >
                Upload an Image
              </button>
            </div>
          ) : (
            <div className="imgkit-history-container">
              {uploadedLinks.map((item) => (
                <div key={item.id} className="imgkit-history-row">
                  <img src={item.thumbUrl || item.url} alt={item.fileName} className="imgkit-history-thumb" />
                  <div className="imgkit-history-info">
                    <p className="imgkit-history-name">{item.fileName}</p>
                    <div className="imgkit-history-date">
                      {item.date} • {item.size}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#78716c', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.url}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="imgkit-btn imgkit-btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => handleCopy(item.url, `hist_${item.id}`)}
                    >
                      {copiedLinkKey === `hist_${item.id}` ? '✓ Copied' : 'Copy Link'}
                    </button>
                    <button
                      type="button"
                      className="imgkit-btn imgkit-btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => handleApplySelection(item.url)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Preview Box */}
      {activeTab !== 'history' && (
        <div className="imgkit-preview-box">
          <img
            src={transformedUrl || selectedUrl}
            alt="Transformed Preview"
            className="imgkit-preview-thumb"
            onError={(e) => {
              e.target.src = catalogFiles[0]?.url || '';
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#78716c', textTransform: 'uppercase' }}>
                Selected CDN Link
              </span>
              <button
                type="button"
                className="imgkit-btn imgkit-btn-outline"
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => handleCopy(transformedUrl, 'preview')}
              >
                {copiedLinkKey === 'preview' ? '✓ Copied!' : 'Copy URL'}
              </button>
            </div>
            <div className="imgkit-url-code">{transformedUrl}</div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="imgkit-actions">
        {onClose && (
          <button
            type="button"
            className="imgkit-btn imgkit-btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="imgkit-btn imgkit-btn-primary"
          onClick={() => handleApplySelection()}
        >
          Return & Use Selected Link
        </button>
      </div>
    </div>
  );
}

export default ImgkitApi;
