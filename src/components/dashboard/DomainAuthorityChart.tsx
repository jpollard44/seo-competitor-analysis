import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DomainAuthorityDataPoint } from '../../types/dashboard';

const data: DomainAuthorityDataPoint[] = [
  { name: 'Your Site', authority: 45 },
  { name: 'Competitor A', authority: 65 },
  { name: 'Competitor B', authority: 55 },
  { name: 'Competitor C', authority: 40 },
];

const DomainAuthorityChart: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Domain Authority Comparison
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="authority" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DomainAuthorityChart; 