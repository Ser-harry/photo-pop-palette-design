import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, BarChart3, GraduationCap, ImageIcon, TrendingUp, User, Shield, FileText, Upload, Home, Database, Users } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EnhancedCollegeManagement from "@/components/admin/EnhancedCollegeManagement";
import AdManagement from "@/components/admin/AdManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import SearchTrends from "@/components/admin/SearchTrends";
import ArticleManagement from "@/components/admin/ArticleManagement";
import DataImportWithSchema from "@/components/admin/DataImportWithSchema";
import HomepageContentManagement from "@/components/admin/HomepageContentManagement";
import CrmDashboard from "@/components/admin/CrmDashboard";
import AdminSearchAutocomplete from "@/components/admin/AdminSearchAutocomplete";

const AdminDashboard = () => {
  const { signOut, adminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("colleges");

  const handleLogout = async () => {
    await signOut();
  };

  const handleSearchSelect = (suggestion: any) => {
    // Navigate to relevant section based on suggestion type
    switch (suggestion.type) {
      case 'college':
        setActiveTab('colleges');
        break;
      case 'article':
        setActiveTab('articles');
        break;
      case 'contact':
      case 'lead':
        setActiveTab('crm');
        break;
      default:
        break;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-3 h-3" />;
      case 'admin':
        return <User className="w-3 h-3" />;
      case 'moderator':
        return <User className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
                {adminUser && (
                  <div className="flex items-center space-x-2">
                    <Badge className={`flex items-center space-x-1 ${getRoleColor(adminUser.role)}`}>
                      {getRoleIcon(adminUser.role)}
                      <span className="capitalize">{adminUser.role.replace('_', ' ')}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {adminUser.email}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-80">
                  <AdminSearchAutocomplete 
                    placeholder="Search colleges, articles, contacts, leads..."
                    onSelect={handleSearchSelect}
                  />
                </div>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="colleges" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Colleges</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Articles</span>
              </TabsTrigger>
              <TabsTrigger value="homepage" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Homepage</span>
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Ads</span>
              </TabsTrigger>
              <TabsTrigger value="crm" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>CRM</span>
              </TabsTrigger>
              <TabsTrigger value="data-import" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Data Import</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colleges">
              <EnhancedCollegeManagement />
            </TabsContent>

            <TabsContent value="articles">
              <ArticleManagement />
            </TabsContent>

            <TabsContent value="homepage">
              <HomepageContentManagement />
            </TabsContent>

            <TabsContent value="ads">
              <AdManagement />
            </TabsContent>

            <TabsContent value="crm">
              <CrmDashboard />
            </TabsContent>

            <TabsContent value="data-import">
              <DataImportWithSchema />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="trends">
              <SearchTrends />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
