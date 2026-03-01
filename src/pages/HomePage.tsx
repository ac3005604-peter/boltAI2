import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';
import { getActiveResume, Resume } from '../lib/api';

export default function HomePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setLoading(true);
    const data = await getActiveResume();
    setResume(data);
    setLoading(false);
  };

  const handleDownload = () => {
    if (resume) {
      window.open(resume.file_url, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">歡迎面試官</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          感謝您撥冗瀏覽我的作品集網站。在這裡，您可以查看我的履歷表和過往作品。
          如有任何問題或需要進一步了解，請隨時與我聯繫。
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">我的履歷</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : resume ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <PDFViewer fileUrl={resume.file_url} />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>下載履歷表</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>目前尚未上傳履歷表</p>
          </div>
        )}
      </div>
    </div>
  );
}
