import { useState, useEffect } from 'react';
import { Upload, Trash2, FileText, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { getActivePortfolios, uploadResume, uploadPortfolio, deletePortfolio, Portfolio } from '../lib/api';
import { isConfigured } from '../lib/supabase';
import { getDocument } from 'pdfjs-dist';

export default function AdminPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioForDelete, setSelectedPortfolioForDelete] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [resumePassword, setResumePassword] = useState('');
  const [portfolioPassword, setPortfolioPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    const data = await getActivePortfolios();
    setPortfolios(data);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const checkPDFPages = async (file: File): Promise<number> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      showMessage('error', '請選擇履歷表檔案');
      return;
    }

    if (!resumePassword) {
      showMessage('error', '請輸入密碼');
      return;
    }

    setLoading(true);
    try {
      const pageCount = await checkPDFPages(resumeFile);
      if (pageCount > 1) {
        showMessage('error', `履歷表超過一頁 (共 ${pageCount} 頁)，無法上傳`);
        setLoading(false);
        return;
      }

      const result = await uploadResume(resumeFile, resumePassword);
      if (result.success) {
        showMessage('success', '履歷表上傳成功');
        setResumeFile(null);
        setResumePassword('');
      } else {
        showMessage('error', result.error || '上傳失敗');
      }
    } catch (error) {
      showMessage('error', '檢查PDF頁數時發生錯誤');
    }
    setLoading(false);
  };

  const handlePortfolioUpload = async () => {
    if (!portfolioFile) {
      showMessage('error', '請選擇作品集檔案');
      return;
    }

    if (!portfolioPassword) {
      showMessage('error', '請輸入密碼');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadPortfolio(portfolioFile, portfolioPassword);
      if (result.success) {
        showMessage('success', '作品集上傳成功');
        setPortfolioFile(null);
        setPortfolioPassword('');
        await loadPortfolios();
      } else {
        showMessage('error', result.error || '上傳失敗');
      }
    } catch (error) {
      showMessage('error', '上傳時發生錯誤');
    }
    setLoading(false);
  };

  const handlePortfolioDelete = async () => {
    if (!selectedPortfolioForDelete) {
      showMessage('error', '請選擇要刪除的作品集');
      return;
    }

    if (!deletePassword) {
      showMessage('error', '請輸入密碼');
      return;
    }

    setLoading(true);
    const result = await deletePortfolio(selectedPortfolioForDelete, deletePassword);
    if (result.success) {
      showMessage('success', '作品集已刪除');
      setSelectedPortfolioForDelete('');
      setDeletePassword('');
      await loadPortfolios();
    } else {
      showMessage('error', result.error || '刪除失敗');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">後台管理</h1>
        <p className="text-lg text-gray-600">
          在這裡可以上傳履歷表和作品集，或刪除現有的作品集。所有操作都需要輸入密碼。
        </p>
      </div>

      {!isConfigured && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-800">
            <p className="font-medium">Supabase未配置</p>
            <p className="text-sm">請在Vercel環境變數中設置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY，後台功能才能使用</p>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`rounded-xl p-4 flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">上傳履歷表</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇PDF檔案 (限一頁)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {resumeFile && (
                <p className="mt-2 text-sm text-gray-600">已選擇: {resumeFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                type="password"
                value={resumePassword}
                onChange={(e) => setResumePassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="請輸入密碼"
              />
            </div>

            <button
              onClick={handleResumeUpload}
              disabled={loading || !resumeFile || !resumePassword}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              <span>{loading ? '上傳中...' : '上傳履歷表'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">上傳作品集</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇PDF檔案 (可多頁)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              {portfolioFile && (
                <p className="mt-2 text-sm text-gray-600">已選擇: {portfolioFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                type="password"
                value={portfolioPassword}
                onChange={(e) => setPortfolioPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="請輸入密碼"
              />
            </div>

            <button
              onClick={handlePortfolioUpload}
              disabled={loading || !portfolioFile || !portfolioPassword}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              <span>{loading ? '上傳中...' : '上傳作品集'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">刪除作品集</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇要刪除的作品集
            </label>
            <select
              value={selectedPortfolioForDelete}
              onChange={(e) => setSelectedPortfolioForDelete(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="">請選擇作品集</option>
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.filename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="請輸入密碼"
            />
          </div>

          <button
            onClick={handlePortfolioDelete}
            disabled={loading || !selectedPortfolioForDelete || !deletePassword}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span>{loading ? '刪除中...' : '刪除作品集'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
