
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Activity } from 'lucide-react';
import { SecurityUtils } from '@/utils/securityUtils';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  action: string;
  details: any;
  created_at: string;
  admin_user_id: string;
  ip_address?: string;
}

const SecurityMonitor = () => {
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityEvents();
    checkSecurityAlerts();
  }, []);

  const loadSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        SecurityUtils.secureLog('Failed to load security events', error);
        return;
      }

      setRecentEvents(data || []);
    } catch (error) {
      SecurityUtils.secureLog('Security events loading error', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSecurityAlerts = () => {
    const alerts: string[] = [];

    // Check for rate limiting in local storage
    const rateLimitKeys = Object.keys(localStorage).filter(key => key.startsWith('rateLimit_'));
    if (rateLimitKeys.length > 10) {
      alerts.push('Multiple rate limit triggers detected');
    }

    // Check for suspicious user agents
    const suspiciousPatterns = ['bot', 'crawler', 'spider', 'scan'];
    const userAgent = navigator.userAgent.toLowerCase();
    if (suspiciousPatterns.some(pattern => userAgent.includes(pattern))) {
      alerts.push('Suspicious user agent detected');
    }

    setSecurityAlerts(alerts);
  };

  const formatEventAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getEventIcon = (action: string) => {
    if (action.includes('login')) return <Shield className="w-4 h-4" />;
    if (action.includes('create') || action.includes('update')) return <Activity className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  const getEventBadgeVariant = (action: string): "default" | "secondary" | "destructive" => {
    if (action.includes('delete')) return "destructive";
    if (action.includes('login')) return "default";
    return "secondary";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Security Alerts */}
          {securityAlerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-orange-600 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Security Alerts</span>
              </h4>
              {securityAlerts.map((alert, index) => (
                <Alert key={index} className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Recent Security Events */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Recent Security Events</h4>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No recent security events</p>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.action)}
                      <span className="text-sm font-medium">
                        {formatEventAction(event.action)}
                      </span>
                      <Badge variant={getEventBadgeVariant(event.action)} className="text-xs">
                        {event.action}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Status */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Security Status:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {securityAlerts.length === 0 ? 'Secure' : 'Monitoring'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
