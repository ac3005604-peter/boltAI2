import { supabase, Resume, Portfolio } from './supabase';

const ADMIN_PASSWORD = '88888888';

export const validatePassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

export const getActiveResume = async (): Promise<Resume | null> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching resume:', error);
    return null;
  }

  return data;
};

export const getActivePortfolios = async (): Promise<Portfolio[]> => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }

  return data || [];
};

export const uploadResume = async (
  file: File,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  if (!validatePassword(password)) {
    return { success: false, error: '密碼錯誤' };
  }

  const timestamp = Date.now();
  const filePath = `${timestamp}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);

  const activeResume = await getActiveResume();
  if (activeResume) {
    await supabase
      .from('resumes')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', activeResume.id);
  }

  const { error: insertError } = await supabase.from('resumes').insert({
    filename: file.name,
    file_path: filePath,
    file_url: urlData.publicUrl,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true };
};

export const uploadPortfolio = async (
  file: File,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  if (!validatePassword(password)) {
    return { success: false, error: '密碼錯誤' };
  }

  const timestamp = Date.now();
  const filePath = `${timestamp}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('portfolios')
    .upload(filePath, file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from('portfolios')
    .getPublicUrl(filePath);

  const { error: insertError } = await supabase.from('portfolios').insert({
    filename: file.name,
    file_path: filePath,
    file_url: urlData.publicUrl,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true };
};

export const deletePortfolio = async (
  portfolioId: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  if (!validatePassword(password)) {
    return { success: false, error: '密碼錯誤' };
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', portfolioId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
