
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Clock, TrendingUp } from "lucide-react";

interface CrmOverviewProps {
  stats: any;
}

const CrmOverview = ({ stats }: CrmOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold">{stats?.activeLeads || 0}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{stats?.highPriorityLeads || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentInteractions?.length ? (
            <div className="space-y-3">
              {stats.recentInteractions.slice(0, 5).map((interaction: any) => (
                <div key={interaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      interaction.interaction_type === 'call' ? 'bg-blue-500' :
                      interaction.interaction_type === 'email' ? 'bg-green-500' :
                      interaction.interaction_type === 'meeting' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{interaction.subject || interaction.interaction_type}</p>
                      <p className="text-sm text-gray-600">{interaction.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(interaction.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent interactions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmOverview;
