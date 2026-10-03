export function getPartImages(part?: { image_url?: string | null; image_urls?: string[] | null } | null): string[] {
  if (!part) return []
  if (Array.isArray(part.image_urls) && part.image_urls.length > 0) {
    return part.image_urls.filter(Boolean)
  }
  if (!part.image_url) return []
  if (part.image_url.startsWith('[') && part.image_url.endsWith(']')) {
    try {
      const parsed = JSON.parse(part.image_url)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch (e) {}
  }
  if (part.image_url.includes(',')) {
    return part.image_url.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return [part.image_url]
}

export function getPartPublicIds(part?: { cloudinary_public_id?: string | null; cloudinary_public_ids?: string[] | null } | null): string[] {
  if (!part) return []
  if (Array.isArray(part.cloudinary_public_ids) && part.cloudinary_public_ids.length > 0) {
    return part.cloudinary_public_ids.filter(Boolean)
  }
  if (!part.cloudinary_public_id) return []
  if (part.cloudinary_public_id.startsWith('[') && part.cloudinary_public_id.endsWith(']')) {
    try {
      const parsed = JSON.parse(part.cloudinary_public_id)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch (e) {}
  }
  if (part.cloudinary_public_id.includes(',')) {
    return part.cloudinary_public_id.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return [part.cloudinary_public_id]
}

export function extractCloudinaryPublicIdFromUrl(url: string | null | undefined): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return null;
    const pathParts = parts[1].split('/');
    // Remove the version (e.g., v1234567890) if it exists
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    const publicIdWithExtension = pathParts.join('/');
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }
    return publicIdWithExtension;
  } catch (e) {
    return null;
  }
}
