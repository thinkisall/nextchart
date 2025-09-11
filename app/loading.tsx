export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 스켈레톤 */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* 연결 상태 스켈레톤 */}
          <div className="mb-4 h-6 bg-gray-200 rounded w-48 animate-pulse"></div>

          {/* 컨트롤 패널 스켈레톤 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* 테이블 스켈레톤 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse ml-auto"></div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse ml-auto"></div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse ml-auto"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }, (_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-5 bg-gray-200 rounded w-24 ml-auto animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 ml-auto animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 하단 정보 스켈레톤 */}
          <div className="mt-6 text-center">
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
