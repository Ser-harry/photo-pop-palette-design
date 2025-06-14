
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseAdvertisement } from "@/types/database";

interface AdStatsCardsProps {
  ads: DatabaseAdvertisement[];
}

const AdStatsCards = ({ ads }: AdStatsCardsProps) => {
  const totalAds = ads.length;
  const activeAds = ads.filter(ad => ad.is_active).length;
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{totalAds}</div>
          <div className="text-sm text-gray-600">Total Ads</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{activeAds}</div>
          <div className="text-sm text-gray-600">Active Ads</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">{totalClicks}</div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">{totalImpressions}</div>
          <div className="text-sm text-gray-600">Total Impressions</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdStatsCards;
