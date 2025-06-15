
import { DatabaseAdvertisement } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface AdTableProps {
  ads: DatabaseAdvertisement[];
  onEdit: (ad: DatabaseAdvertisement) => void;
  onDelete: (id: string) => void;
  onToggleActive: (ad: DatabaseAdvertisement) => void;
  disabled?: boolean;
}

const AdTable = ({ ads, onEdit, onDelete, onToggleActive, disabled = false }: AdTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-semibold">Title</th>
            <th className="text-left p-3 font-semibold">Placement</th>
            <th className="text-left p-3 font-semibold">Status</th>
            <th className="text-left p-3 font-semibold">Clicks</th>
            <th className="text-left p-3 font-semibold">Impressions</th>
            <th className="text-left p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">No Image</div>';
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{ad.title}</div>
                    <div className="text-sm text-gray-500">{ad.cta_text}</div>
                  </div>
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline">{ad.placement}</Badge>
              </td>
              <td className="p-3">
                <Badge variant={ad.is_active ? "default" : "secondary"}>
                  {ad.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="p-3">{ad.clicks}</td>
              <td className="p-3">{ad.impressions}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(ad)}
                    disabled={disabled}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleActive(ad)}
                    disabled={disabled}
                  >
                    {ad.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(ad.id)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdTable;
