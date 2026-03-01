import { Code2, Database, Cloud, Layers } from 'lucide-react';

export default function AboutPage() {
  const techStack = [
    {
      category: '前端技術',
      icon: Code2,
      items: [
        { name: 'React 18', description: '使用最新版本的React框架建構互動式使用者介面' },
        { name: 'TypeScript', description: '提供型別安全和更好的開發體驗' },
        { name: 'Vite', description: '快速的建構工具和開發伺服器' },
        { name: 'Tailwind CSS', description: '實用優先的CSS框架，打造現代化設計' },
        { name: 'React PDF', description: '在瀏覽器中渲染和顯示PDF文件' },
        { name: 'Lucide React', description: '精美的圖示庫' },
      ],
    },
    {
      category: '後端服務',
      icon: Database,
      items: [
        { name: 'Supabase', description: '開源的Firebase替代方案，提供完整的後端服務' },
        { name: 'PostgreSQL', description: '強大的關聯式資料庫，儲存履歷和作品集資訊' },
        { name: 'Supabase Storage', description: '安全的檔案儲存服務，用於存放PDF檔案' },
        { name: 'Row Level Security', description: '資料庫層級的安全機制' },
      ],
    },
    {
      category: '部署平台',
      icon: Cloud,
      items: [
        { name: 'Vercel', description: '前端應用託管平台，提供快速的全球CDN' },
        { name: 'Supabase Cloud', description: '後端服務託管平台' },
      ],
    },
    {
      category: '功能特色',
      icon: Layers,
      items: [
        { name: '響應式設計', description: '支援各種螢幕尺寸的裝置' },
        { name: 'PDF檢視器', description: '單頁和雙頁瀏覽模式' },
        { name: '軟刪除機制', description: '資料不會真正刪除，可以恢復' },
        { name: '密碼保護', description: '後台操作需要密碼驗證' },
        { name: '中文檔名支援', description: '完整支援中文PDF檔名' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">網站技術介紹</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          這個作品集網站採用現代化的技術堆疊，結合前端React框架與Supabase後端服務，
          打造出高效能、易維護且使用者友善的應用程式。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {techStack.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.name} className="border-l-4 border-blue-600 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">架構設計</h2>
        <div className="space-y-3 text-blue-50">
          <p>
            <strong className="text-white">前端：</strong>
            使用Vite + React + TypeScript建構，透過Vercel部署，享受邊緣網路的快速載入體驗
          </p>
          <p>
            <strong className="text-white">後端：</strong>
            採用Supabase提供的PostgreSQL資料庫和Storage服務，具備自動備份和高可用性
          </p>
          <p>
            <strong className="text-white">安全性：</strong>
            實作Row Level Security (RLS)、軟刪除機制和密碼保護，確保資料安全
          </p>
          <p>
            <strong className="text-white">使用者體驗：</strong>
            提供直覺的介面、流暢的動畫和完整的PDF閱讀體驗
          </p>
        </div>
      </div>
    </div>
  );
}
