
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, CheckCircle, AlertCircle, Database, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DataImportWithSchema = () => {
  const [csvData, setCsvData] = useState("");
  const [importYear, setImportYear] = useState(2024);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to check import status
  const { data: importStats } = useQuery({
    queryKey: ['import-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temp_cutoff_import')
        .select('processed')
        .order('id');
      
      if (error) throw error;
      
      const total = data?.length || 0;
      const processed = data?.filter(item => item.processed).length || 0;
      return { total, processed, pending: total - processed };
    }
  });

  // Mutation to import CSV data
  const importMutation = useMutation({
    mutationFn: async (data: { csvData: string; year: number }) => {
      const lines = data.csvData.trim().split('\n');
      const rows = [];
      
      for (const line of lines) {
        const columns = line.split('\t');
        if (columns.length >= 11) {
          rows.push({
            college_name: columns[0]?.trim(),
            branch_code: columns[1]?.trim(),
            branch_name: columns[2]?.trim(),
            oc: parseFloat(columns[3]) || null,
            bc: parseFloat(columns[4]) || null,
            bcm: parseFloat(columns[5]) || null,
            mbc: parseFloat(columns[6]) || null,
            mbcdnc: parseFloat(columns[7]) || null,
            mbcv: parseFloat(columns[8]) || null,
            sc: parseFloat(columns[9]) || null,
            sca: parseFloat(columns[10]) || null,
            st: parseFloat(columns[11]) || null,
            year: data.year
          });
        }
      }

      if (rows.length === 0) {
        throw new Error('No valid data found to import');
      }

      const { error } = await supabase
        .from('temp_cutoff_import')
        .insert(rows);

      if (error) throw error;
      return rows.length;
    },
    onSuccess: (count) => {
      toast({
        title: "Data Imported Successfully",
        description: `${count} rows imported to temporary table. Ready for processing.`,
      });
      queryClient.invalidateQueries({ queryKey: ['import-stats'] });
      setCsvData("");
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to process imported data
  const processMutation = useMutation({
    mutationFn: async (year: number) => {
      const { data, error } = await supabase.rpc('process_cutoff_import', {
        import_year: year
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (processedCount) => {
      toast({
        title: "Data Processed Successfully",
        description: `${processedCount} records processed and added to cutoff database.`,
      });
      queryClient.invalidateQueries({ queryKey: ['import-stats'] });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImport = () => {
    if (!csvData.trim()) {
      toast({
        title: "No Data",
        description: "Please paste your Excel data first.",
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate({ csvData, year: importYear });
  };

  const handleProcess = () => {
    processMutation.mutate(importYear);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Import & Schema</h1>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Data Import
          </TabsTrigger>
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Schema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* Import Stats */}
          {importStats && importStats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  Import Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{importStats.total}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{importStats.processed}</div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{importStats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Import Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Step 1: Import Excel Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="year">Academic Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={importYear}
                  onChange={(e) => setImportYear(parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
              
              <div>
                <Label htmlFor="csvData">Excel Data (Copy and paste from Excel)</Label>
                <Textarea
                  id="csvData"
                  placeholder="Paste your Excel data here (College Name, Branch Code, Branch Name, OC, BC, BCM, MBC, MBCDNC, MBCV, SC, SCA, ST)..."
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">How to copy from Excel:</h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Select all your data in Excel (including headers)</li>
                  <li>Copy (Ctrl+C)</li>
                  <li>Paste here (Ctrl+V)</li>
                  <li>Click "Import Data"</li>
                </ol>
              </div>
              
              <Button 
                onClick={handleImport}
                disabled={importMutation.isPending}
                className="w-full"
              >
                {importMutation.isPending ? "Importing..." : "Import Data"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Process Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download size={20} />
                Step 2: Process Imported Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-amber-600 mt-0.5" size={16} />
                  <div className="text-sm text-amber-700">
                    <p className="font-semibold mb-1">Important:</p>
                    <p>Processing will convert your wide-format data into the database format and match colleges/branches. This step is irreversible.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleProcess}
                disabled={processMutation.isPending || !importStats?.pending}
                variant={importStats?.pending ? "default" : "secondary"}
                className="w-full"
              >
                {processMutation.isPending ? "Processing..." : "Process Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={20} />
                Database Schema Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  temp_cutoff_import Table Structure
                </h3>
                
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-800 mb-3">Required Columns (in order):</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><strong>college_name</strong> (text) - Full college name</div>
                      <div><strong>branch_code</strong> (text) - Branch code (e.g., "CSE", "ECE")</div>
                      <div><strong>branch_name</strong> (text) - Full branch name</div>
                      <div><strong>oc</strong> (numeric) - Open Category cutoff</div>
                      <div><strong>bc</strong> (numeric) - BC category cutoff</div>
                      <div><strong>bcm</strong> (numeric) - BCM category cutoff</div>
                      <div><strong>mbc</strong> (numeric) - MBC category cutoff</div>
                      <div><strong>mbcdnc</strong> (numeric) - MBCDNC category cutoff</div>
                      <div><strong>mbcv</strong> (numeric) - MBCV category cutoff</div>
                      <div><strong>sc</strong> (numeric) - SC category cutoff</div>
                      <div><strong>sca</strong> (numeric) - SCA category cutoff</div>
                      <div><strong>st</strong> (numeric) - ST category cutoff</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-800 mb-3">Expected Excel Format:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">College Name</th>
                            <th className="border border-gray-300 p-2">Branch Code</th>
                            <th className="border border-gray-300 p-2">Branch Name</th>
                            <th className="border border-gray-300 p-2">OC</th>
                            <th className="border border-gray-300 p-2">BC</th>
                            <th className="border border-gray-300 p-2">BCM</th>
                            <th className="border border-gray-300 p-2">MBC</th>
                            <th className="border border-gray-300 p-2">MBCDNC</th>
                            <th className="border border-gray-300 p-2">MBCV</th>
                            <th className="border border-gray-300 p-2">SC</th>
                            <th className="border border-gray-300 p-2">SCA</th>
                            <th className="border border-gray-300 p-2">ST</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">Anna University</td>
                            <td className="border border-gray-300 p-2">CSE</td>
                            <td className="border border-gray-300 p-2">Computer Science</td>
                            <td className="border border-gray-300 p-2">180.5</td>
                            <td className="border border-gray-300 p-2">175.2</td>
                            <td className="border border-gray-300 p-2">170.8</td>
                            <td className="border border-gray-300 p-2">165.3</td>
                            <td className="border border-gray-300 p-2">160.1</td>
                            <td className="border border-gray-300 p-2">158.7</td>
                            <td className="border border-gray-300 p-2">155.2</td>
                            <td className="border border-gray-300 p-2">152.9</td>
                            <td className="border border-gray-300 p-2">150.4</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Important Notes:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Ensure data is tab-separated when copying from Excel</li>
                      <li>• Numeric values should be decimal numbers (use . for decimal point)</li>
                      <li>• Empty cells should be left blank (will be stored as NULL)</li>
                      <li>• College names will be matched with existing colleges in the database</li>
                      <li>• Branch codes must match existing branch codes</li>
                      <li>• Year field will be automatically added during import</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImportWithSchema;
