
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Eye } from 'lucide-react';

interface PrivacyGuardProps {
  showFinancials: boolean;
  onShowFinancials: (show: boolean) => void;
  children: React.ReactNode;
}

const PrivacyGuard = ({ showFinancials, onShowFinancials, children }: PrivacyGuardProps) => {
  if (!showFinancials) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            Private Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This section contains sensitive business and financial information. 
            Click below to reveal your revenue analytics and financial projections.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90">
                <Eye className="h-4 w-4 mr-2" />
                View Financial Analytics
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Access Financial Data</AlertDialogTitle>
                <AlertDialogDescription>
                  You're about to view sensitive business and financial information. 
                  Make sure you're in a private setting where client information cannot be viewed by others.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onShowFinancials(true)}>
                  I Understand, Show Analytics
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-4 mb-6">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Shield className="h-3 w-3 mr-1" />
          Private Financial Data
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onShowFinancials(false)}
        >
          Hide Financials
        </Button>
      </div>
      {children}
    </>
  );
};

export default PrivacyGuard;
