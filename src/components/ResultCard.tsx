import { AnalysisResult } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  // Calculate confidence percentage
  const confidencePercent = Math.round(result.confidence_score * 100);
  
  // Get status color and icon
  const getStatusInfo = () => {
    if (result.is_safe) {
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: ShieldCheck,
        label: 'Safe'
      };
    } else {
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: ShieldAlert,
        label: 'Malicious'
      };
    }
  };
  
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      statusInfo.bgColor,
      statusInfo.borderColor,
      "border-2"
    )}>
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-3 rounded-full",
          statusInfo.bgColor,
          "border-2",
          statusInfo.borderColor
        )}>
          <StatusIcon className={cn("h-6 w-6", statusInfo.color)} />
        </div>
        
        <div className="flex-grow">
          <h3 className={cn("text-lg font-semibold mb-1", statusInfo.color)}>
            {statusInfo.label}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            This URL has been classified as {statusInfo.label.toLowerCase()} with {confidencePercent}% confidence.
          </p>
          
          <div className="space-y-4">
            {/* Confidence Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Model Confidence</span>
                <span>{(result.prediction_metrics.model_confidence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={result.prediction_metrics.model_confidence * 100} />
            </div>
            
            {/* Prediction Stability */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Prediction Stability</span>
                <span>{(result.prediction_metrics.prediction_stability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={result.prediction_metrics.prediction_stability * 100} />
            </div>
            
            {/* Probabilities */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/50 rounded-lg border">
                <div className="text-sm font-medium">Safe Probability</div>
                <div className="text-2xl font-bold">
                  {(result.prediction_metrics.safe_probability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-white/50 rounded-lg border">
                <div className="text-sm font-medium">Malicious Probability</div>
                <div className="text-2xl font-bold">
                  {(result.prediction_metrics.malicious_probability * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Feature Importance */}
            {result.feature_importance && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Top Contributing Features
                </h4>
                <div className="space-y-2">
                  {Object.entries(result.feature_importance)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([feature, importance]) => (
                      <div key={feature} className="flex justify-between text-sm">
                        <span>{feature.replace(/_/g, ' ')}</span>
                        <span>{(importance * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
