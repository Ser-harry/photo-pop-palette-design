
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const SearchTrends = () => {
  const branchTrends = [
    { branch: "Computer Science", searches: 15240, change: 12.5, trend: "up" },
    { branch: "Electronics & Communication", searches: 8950, change: -3.2, trend: "down" },
    { branch: "Mechanical Engineering", searches: 7340, change: 0.8, trend: "up" },
    { branch: "Information Technology", searches: 6890, change: 18.7, trend: "up" },
    { branch: "Civil Engineering", searches: 5420, change: -8.1, trend: "down" },
    { branch: "Electrical Engineering", searches: 4230, change: 2.3, trend: "up" },
  ];

  const collegeTrends = [
    { college: "IIT Madras", searches: 12340, change: 8.9, trend: "up" },
    { college: "NIT Trichy", searches: 9876, change: 15.2, trend: "up" },
    { college: "Anna University", searches: 8765, change: -2.1, trend: "down" },
    { college: "PSG College", searches: 6543, change: 22.4, trend: "up" },
    { college: "SSN College", searches: 5432, change: -5.6, trend: "down" },
  ];

  const weeklySearches = [
    { day: "Mon", searches: 2840 },
    { day: "Tue", searches: 3120 },
    { day: "Wed", searches: 2950 },
    { day: "Thu", searches: 3340 },
    { day: "Fri", searches: 3890 },
    { day: "Sat", searches: 4560 },
    { day: "Sun", searches: 3210 },
  ];

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Search Trends</h2>
      
      {/* Weekly Search Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Search Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklySearches}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="searches" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Branches */}
        <Card>
          <CardHeader>
            <CardTitle>Most Searched Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Searches</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchTrends.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{item.branch}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.searches.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(item.trend, item.change)}
                        <span className={getTrendColor(item.change)}>
                          {item.change > 0 ? "+" : ""}{item.change}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Popular Colleges */}
        <Card>
          <CardHeader>
            <CardTitle>Most Searched Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College</TableHead>
                  <TableHead>Searches</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collegeTrends.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{item.college}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.searches.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(item.trend, item.change)}
                        <span className={getTrendColor(item.change)}>
                          {item.change > 0 ? "+" : ""}{item.change}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45,623</p>
              <p className="text-sm text-gray-600">Total Searches This Month</p>
              <p className="text-green-600 text-sm mt-1">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">1,234</p>
              <p className="text-sm text-gray-600">Daily Average Searches</p>
              <p className="text-green-600 text-sm mt-1">+8.2% from last week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">67%</p>
              <p className="text-sm text-gray-600">Mobile Search Rate</p>
              <p className="text-blue-600 text-sm mt-1">Consistent with last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchTrends;
