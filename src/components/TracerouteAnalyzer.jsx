import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Network, Activity, Clock, Server, Sun, Moon, Timer } from 'lucide-react';

const TracerouteAnalyzer = () => {
  const [rawData, setRawData] = useState('');
  const [traceData, setTraceData] = useState(null);
  const [selectedHop, setSelectedHop] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const parseTraceroute = (raw) => {
    const lines = raw.trim().split('\n');
    const hops = [];

    lines.forEach(line => {
      const match = line.match(/^\s*(\d+)\s+(.*)/);
      if (match) {
        const hopNumber = parseInt(match[1]);
        const hopData = match[2];

        // Extract IP addresses and times
        const ipMatches = hopData.match(/\(([^)]+)\)\s+([0-9.]+\s+ms|\*)/g);
        const ips = [];
        const times = [];

        if (ipMatches) {
          ipMatches.forEach(match => {
            const ip = match.match(/\(([^)]+)\)/)[1];
            const time = match.includes('*') ? null : parseFloat(match.match(/([0-9.]+)\s+ms/)[1]);

            if (!ips.includes(ip)) {
              ips.push(ip);
              times.push(time);
            }
          });
        }

        const isPrivate = ips.some(ip => {
          return ip.startsWith('192.168.') ||
                 ip.startsWith('10.') ||
                 ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
        });

        hops.push({
          hop: hopNumber,
          ips,
          times,
          isPrivate
        });
      }
    });

    return hops;
  };

  const calculateTotalTime = (data) => {
    if (!data || data.length === 0) return 0;

    const validTimes = data.flatMap(hop => hop.times.filter(t => t !== null));
    return validTimes.reduce((a, b) => a + b, 0);
  };

  const handleAnalyze = () => {
    const parsed = parseTraceroute(rawData);
    setTraceData(parsed);
  };

  const getAverageTime = (times) => {
    const validTimes = times.filter(t => t !== null);
    return validTimes.length > 0 ?
      (validTimes.reduce((a, b) => a + b, 0) / validTimes.length).toFixed(2) : 'N/A';
  };

  const getMaxTime = (times) => {
    const validTimes = times.filter(t => t !== null);
    return validTimes.length > 0 ? Math.max(...validTimes).toFixed(2) : 'N/A';
  };

  return (
      <div className={`w-full min-h-screen p-4 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Этот div теперь будет иметь максимальную ширину и центрироваться */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Network className="w-6 h-6"/>
              Анализатор трассировки
            </h1>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}>
                {isDarkMode ?
                  <Sun className="w-5 h-5" /> :
                  <Moon className="w-5 h-5" />
                }
                </Button>
          </div>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <Textarea
                  placeholder="Вставьте данные трассировки..."
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  className={`h-40 mb-4 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                  }`}
              />
             <Button onClick={handleAnalyze} className="w-full text-white">
                Анализировать
              </Button>
            </CardContent>
          </Card>

          {traceData && (
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Результаты анализа
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-blue-500"/>
                          <span className="font-medium">Хопы</span>
                        </div>
                        <span className="text-2xl font-bold">{traceData.length}</span>
                      </div>
                      <div className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Server className="w-5 h-5 text-green-500"/>
                          <span className="font-medium">Приватные сети</span>
                        </div>
                        <span className="text-2xl font-bold">
                      {traceData.filter(hop => hop.isPrivate).length}
                    </span>
                      </div>
                      <div className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-purple-500"/>
                          <span className="font-medium">Макс. задержка</span>
                        </div>
                        <span className="text-2xl font-bold">
                      {Math.max(...traceData.flatMap(hop => hop.times.filter(t => t !== null))).toFixed(2)} мс
                    </span>
                      </div>
                      <div className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Timer className="w-5 h-5 text-orange-500"/>
                          <span className="font-medium">Общее время</span>
                        </div>
                        <span className="text-2xl font-bold">
                      {calculateTotalTime(traceData).toFixed(2)} мс
                    </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                        <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                          <th className="p-2 text-left">Хоп</th>
                          <th className="p-2 text-left">IP адреса</th>
                          <th className="p-2 text-left">Ср. время</th>
                          <th className="p-2 text-left">Макс. время</th>
                          <th className="p-2 text-left">Тип сети</th>
                        </tr>
                        </thead>
                        <tbody>
                        {traceData.map((hop) => (
                            <tr
                                key={hop.hop}
                                className={`border-t cursor-pointer ${
                                    isDarkMode
                                        ? `hover:bg-gray-700 ${selectedHop === hop.hop ? 'bg-gray-700' : ''}`
                                        : `hover:bg-gray-50 ${selectedHop === hop.hop ? 'bg-blue-50' : ''}`
                                }`}
                                onClick={() => setSelectedHop(hop.hop === selectedHop ? null : hop.hop)}
                            >
                              <td className="p-2">{hop.hop}</td>
                              <td className="p-2">
                                <div className="space-y-1">
                                  {hop.ips.map((ip, idx) => (
                                      <div key={idx} className="text-sm">
                                        {ip}
                                      </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">{getAverageTime(hop.times)} мс</td>
                              <td className="p-2">{getMaxTime(hop.times)} мс</td>
                              <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                hop.isPrivate
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                              {hop.isPrivate ? 'Приватная' : 'Публичная'}
                            </span>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedHop && (
                        <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <h3 className="font-medium mb-2">Подробная информация о хопе {selectedHop}</h3>
                          <div className="space-y-2">
                            <p>IP адреса: {traceData[selectedHop - 1].ips.join(', ')}</p>
                            <p>Времена
                              отклика: {traceData[selectedHop - 1].times.map(t => t === null ? '*' : `${t} мс`).join(', ')}</p>
                            <p>Тип сети: {traceData[selectedHop - 1].isPrivate ? 'Приватная' : 'Публичная'}</p>
                          </div>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      </div>
  );
};

export default TracerouteAnalyzer;