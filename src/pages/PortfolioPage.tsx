import { useState, useEffect } from 'react';
import { Download, BookOpen, AlertCircle } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';
import { getActivePortfolios, Portfolio } from '../lib/api';
import { isConfigured } from '../lib/supabase';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    const data = await getActivePortfolios();
    setPortfolios(data);
    if (data.length > 0) {
      setSelectedPortfolio(data[0]);
    }
    setLoading(false);
  };

  const handlePortfolioChange = (portfolioId: string) => {
    const portfolio = portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      setSelectedPortfolio(portfolio);
    }
  };

  const handleDownload = () => {
    if (selectedPortfolio) {
      window.open(selectedPortfolio.file_url, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start space-x-4">
          <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">作品集</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              這裡展示了我的作品集。您可以使用下方的下拉選單選擇不同的作品集進行瀏覽，
              並以雙頁電子書的形式閱讀。如需下載，請點擊下方的下載按鈕。
            </p>
          </div>
        </div>
      </div>

      {!isConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-yellow-800">
            <p className="font-medium">Supabase未配置</p>
            <p className="text-sm">請在Vercel環境變數中設置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : portfolios.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇作品集
            </label>
            <select
              value={selectedPortfolio?.id || ''}
              onChange={(e) => handlePortfolioChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            >
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.filename}
                </option>
              ))}
            </select>
          </div>

          {selectedPortfolio && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <PDFViewer fileUrl={selectedPortfolio.file_url} doublePageMode={true} />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span>下載作品集</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>目前尚未上傳作品集</p>
        </div>
      )}
    </div>
  );
}
