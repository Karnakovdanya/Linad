export const AVATAR_BUCKET = 'linad-avatars';
export const AVATAR_MAX_BYTES = 3 * 1024 * 1024;
export function avatarStorageError(error: unknown) {
  const issue = error as { code?: string; status?: number; statusCode?: string | number; message?: string };
  if (['NoSuchBucket', 'BucketNotFound'].includes(issue?.code ?? '') || /bucket not found/i.test(issue?.message ?? '')) return { code: 'avatar_storage' };
  if (issue?.status === 403 || Number(issue?.statusCode) === 403 || issue?.code === 'AccessDenied' || /row.level security|RLS denied/i.test(issue?.message ?? '')) return { code: 'avatar_permission' };
  return error;
}
export async function validateAvatar(file: File) {
  if (file.size > AVATAR_MAX_BYTES) throw { code: 'avatar_size' };
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signature = file.type === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : file.type === 'image/png' ? [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b)
      : file.type === 'image/webp' && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (!signature) throw { code: 'avatar_format' };
  try {
    const bitmap = await createImageBitmap(file);
    const valid = bitmap.width > 0 && bitmap.height > 0 && bitmap.width <= 8000 && bitmap.height <= 8000;
    bitmap.close(); if (!valid) throw new Error();
  } catch { throw { code: 'avatar_format' }; }
  return file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
}

