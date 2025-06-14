
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { DatabaseAdvertisement } from "@/types/database";

interface AdTableProps {
  ads: DatabaseAdvertisement[];
  onEdit: (ad: DatabaseAdvertisement) => void;
  onDelete: (id: string) => void;
  onToggleActive: (ad: DatabaseAdvertisement) => void;
}

const AdTable = ({ ads, onEdit, onDelete, onToggleActive }: AdTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Placement</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((ad) => (
          <TableRow key={ad.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <img 
                  src={ad.image_url} 
                  alt={ad.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{ad.title}</div>
                  <div className="text-sm text-gray-500">{ad.cta_text}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{ad.placement}</Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                <div className="text-gray-500">to {new Date(ad.end_date).toLocaleDateString()}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{ad.clicks} clicks</div>
                <div className="text-gray-500">{ad.impressions} impressions</div>
              </div>
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleActive(ad)}
              >
                {ad.is_active ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(ad)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(ad.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdTable;
