
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollegeDetailsData {
  id: string;
  name: string;
  principalName: string;
  address: string;
  email: string;
  website: string;
  phone: string;
}

interface CollegeDetailsTableProps {
  colleges: CollegeDetailsData[];
}

const CollegeDetailsTable = ({ colleges }: CollegeDetailsTableProps) => {
  const handleWebsiteClick = (website: string) => {
    if (website && !website.startsWith('http')) {
      window.open(`https://${website}`, '_blank');
    } else if (website) {
      window.open(website, '_blank');
    }
  };

  const handleEmailClick = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const handlePhoneClick = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          College Details Directory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">No.</TableHead>
                <TableHead className="min-w-[200px]">College Name</TableHead>
                <TableHead className="min-w-[150px]">Name of Principal</TableHead>
                <TableHead className="min-w-[200px]">Address</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Website</TableHead>
                <TableHead className="min-w-[120px]">Phone Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.map((college, index) => (
                <TableRow key={college.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-600">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800">
                    {college.name}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {college.principalName || "N/A"}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <div className="flex items-start gap-1">
                      <MapPin size={14} className="mt-1 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{college.address || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {college.email ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmailClick(college.email)}
                        className="p-1 h-auto text-blue-600 hover:text-blue-800"
                      >
                        <Mail size={14} className="mr-1" />
                        <span className="text-sm">{college.email}</span>
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {college.website ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWebsiteClick(college.website)}
                        className="p-1 h-auto text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        <span className="text-sm truncate max-w-[120px]">{college.website}</span>
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {college.phone ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePhoneClick(college.phone)}
                        className="p-1 h-auto text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={14} className="mr-1" />
                        <span className="text-sm">{college.phone}</span>
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {colleges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No college data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollegeDetailsTable;
