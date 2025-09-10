// ================================
// 📁 SUPABASE STORAGE EXAMPLES
// ================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ================================
// 1. UPLOAD FILE TO SUPABASE STORAGE
// ================================

export async function uploadFileToSupabase(file, bucketName = 'uploads', folderPath = '') {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Lấy public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      path: data.path,
      publicUrl: urlData.publicUrl,
      fullPath: data.fullPath
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
}

// ================================
// 2. UPLOAD AVATAR/PROFILE IMAGE
// ================================

export async function uploadAvatar(userId, file) {
  const filePath = `avatars/${userId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true // Overwrite nếu file đã tồn tại
    });

  if (error) throw error;

  // Cập nhật avatar URL trong database
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  await supabase
    .from('users')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', userId);

  return urlData.publicUrl;
}

// ================================
// 3. UPLOAD RESTAURANT IMAGES
// ================================

export async function uploadRestaurantImage(restaurantId, file, type = 'general') {
  const filePath = `restaurants/${restaurantId}/${type}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('restaurant-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('restaurant-images')
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: urlData.publicUrl
  };
}

// ================================
// 4. UPLOAD MENU ITEM IMAGES
// ================================

export async function uploadMenuItemImage(menuItemId, file) {
  const filePath = `menu-items/${menuItemId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath);

  // Cập nhật image_url trong database
  await supabase
    .from('menu_items')
    .update({ image_url: urlData.publicUrl })
    .eq('id', menuItemId);

  return urlData.publicUrl;
}

// ================================
// 5. LIST FILES IN BUCKET
// ================================

export async function listFiles(bucketName, folderPath = '') {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath, {
      limit: 100,
      offset: 0
    });

  if (error) throw error;
  return data;
}

// ================================
// 6. DELETE FILE
// ================================

export async function deleteFile(bucketName, filePath) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) throw error;
  return data;
}

// ================================
// 7. GET SIGNED URL (for private files)
// ================================

export async function getSignedUrl(bucketName, filePath, expiresIn = 60) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

// ================================
// 8. IMAGE TRANSFORMATIONS
// ================================

export function getTransformedImageUrl(bucketName, filePath, options = {}) {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  let transformParams = `?quality=${quality}&format=${format}`;
  if (width) transformParams += `&width=${width}`;
  if (height) transformParams += `&height=${height}`;

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath, {
      transform: {
        width,
        height,
        quality,
        format
      }
    });

  return data.publicUrl;
}

// ================================
// 9. REACT HOOK FOR FILE UPLOAD
// ================================

import { useState } from 'react';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file, bucketName, folderPath = '') => {
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFileToSupabase(file, bucketName, folderPath);
      setProgress(100);
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
}

// ================================
// 10. STORAGE POLICIES (SQL)
// ================================

/*
-- Tạo bucket trong Supabase Dashboard hoặc SQL:
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('restaurant-images', 'restaurant-images', true);
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true);
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false);

-- RLS Policies cho avatars bucket:
create policy "Avatar uploads are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update own avatars" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can delete own avatars" on storage.objects for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies cho restaurant-images bucket:
create policy "Restaurant images are public" on storage.objects for select using (bucket_id = 'restaurant-images');
create policy "Managers can upload restaurant images" on storage.objects for insert with check (bucket_id = 'restaurant-images' and auth.jwt() ->> 'role' = 'manager');

-- RLS Policies cho menu-images bucket:
create policy "Menu images are public" on storage.objects for select using (bucket_id = 'menu-images');
create policy "Staff can upload menu images" on storage.objects for insert with check (bucket_id = 'menu-images' and auth.jwt() ->> 'role' in ('manager', 'staff'));
*/
