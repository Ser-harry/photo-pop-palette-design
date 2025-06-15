
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Eye, MousePointer, TrendingUp, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRealtimeAnalytics, getDailyAnalytics, aggregateDailyAnalytics } from "@/services/analyticsService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: realtimeData, refetch: refetchRealtime } = useQuery({
    queryKey: ['realtime-analytics'],
    queryFn: getRealtimeAnalytics,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: dailyData, refetch: refetchDaily } = useQuery({
    queryKey: ['daily-analytics'],
    queryFn: () => getDailyAnalytics(30),
  });

  const handleRefreshAnalytics = async () => {
    setIsRefreshing(true);
    try {
      await aggregateDailyAnalytics();
      await Promise.all([refetchRealtime(), refetchDaily()]);
      toast({ title: "Analytics refreshed successfully" });
    } catch (error) {
      toast({ 
        title: "Error refreshing analytics", 
        description: "Failed to update analytics data",
        variant: "destructive" 
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Transform daily data for charts
  const pageViewsData = dailyData?.map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: day.total_page_views,
    users: day.unique_visitors,
    searches: day.total_searches
  })) || [];

  const adPerformanceData = dailyData?.slice(-7).map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks: day.ad_clicks,
    impressions: day.ad_impressions
  })) || [];

  // Calculate device data from recent trends (mock for now - would need real device tracking)
  const deviceData = [
    { name: "Mobile", value: 65, color: "#8884d8" },
    { name: "Desktop", value: 25, color: "#82ca9d" },
    { name: "Tablet", value: 10, color: "#ffc658" },
  ];

  const totalViews = dailyData?.reduce((sum, day) => sum + day.total_page_views, 0) || 0;
  const totalUsers = dailyData?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0;
  const totalClicks = realtimeData?.totalAdClicks || 0;
  const conversionRate = parseFloat(realtimeData?.conversionRate || '0');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button 
          onClick={handleRefreshAnalytics} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Page Views (30d)</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600">Today: {realtimeData?.todayPageViews || 0}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors (30d)</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">Today: {realtimeData?.todayUniqueVisitors || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ad Clicks</p>
                <p className="text-2xl font-bold">{totalClicks}</p>
                <p className="text-xs text-blue-600">Impressions: {realtimeData?.totalAdImpressions || 0}</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ad Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-xs text-gray-500">Click-through rate</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Website Traffic Trends (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} name="Page Views" />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} name="Unique Visitors" />
                <Line type="monotone" dataKey="searches" stroke="#ffc658" strokeWidth={2} name="Searches" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advertisement Performance (Last 7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
              <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {!dailyData?.length && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">No analytics data available yet.</p>
            <Button onClick={handleRefreshAnalytics} disabled={isRefreshing}>
              {isRefreshing ? 'Generating...' : 'Generate Initial Data'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
