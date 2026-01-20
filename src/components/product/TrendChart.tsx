import { TrendDataPoint } from '@/data/mockTrendData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

interface TrendChartProps {
  data: TrendDataPoint[];
  productName: string;
}

export const TrendChart = ({ data, productName }: TrendChartProps) => {
  return (
    <div className="space-y-6">
      {/* Velocity & Saturation Chart */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-primary">📈</span>
            Velocity vs Saturation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  stroke="hsl(var(--signal-bullish))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--signal-bullish))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--signal-bullish))', strokeWidth: 2 }}
                  name="Velocity Score"
                />
                <Line
                  type="monotone"
                  dataKey="saturation"
                  stroke="hsl(var(--signal-caution))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--signal-caution))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--signal-caution))', strokeWidth: 2 }}
                  name="Saturation Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reddit Mentions & Sentiment */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-primary">💬</span>
            Reddit Activity & Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="mentions"
                  stroke="hsl(var(--primary))"
                  fill="url(#mentionsGradient)"
                  strokeWidth={2}
                  name="Reddit Mentions"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sentiment"
                  stroke="hsl(var(--signal-bullish))"
                  strokeWidth={2}
                  dot={false}
                  name="Sentiment Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
