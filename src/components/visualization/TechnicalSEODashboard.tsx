import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { TechnicalSEOAnalysis } from '../../services/ai-agents/types';
import { 
  Security as SecurityIcon, 
  Speed as SpeedIcon, 
  AccountTree as StructureIcon,
  ErrorOutline as IssueIcon
} from '@mui/icons-material';

interface TechnicalSEODashboardProps {
  analysis: TechnicalSEOAnalysis;
}

const TechnicalSEODashboard: React.FC<TechnicalSEODashboardProps> = ({ analysis }) => {
  const theme = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Technical SEO Analysis
      </Typography>

      {/* Score Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Security</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  border: `4px solid ${getScoreColor(analysis.scores.security)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h5">{analysis.scores.security}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {analysis.security.https ? 'HTTPS Enabled' : 'HTTPS Not Enabled'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analysis.security.mixedContent ? 'Mixed Content Issues' : 'No Mixed Content'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Performance</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  border: `4px solid ${getScoreColor(analysis.scores.performance)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h5">{analysis.scores.performance}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Server Response: {analysis.performance.serverResponse}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resource Size: {analysis.performance.resourceSize}MB
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StructureIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Structure</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  border: `4px solid ${getScoreColor(analysis.scores.structure)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h5">{analysis.scores.structure}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Depth: {analysis.structure.depth} levels
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Internal Links: {analysis.structure.internalLinks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IssueIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Overall</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  border: `4px solid ${getScoreColor(analysis.scores.overall)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h5">{analysis.scores.overall}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Issues: {analysis.issues.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Broken Links: {analysis.structure.brokenLinks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Issues Section */}
      <Typography variant="h6" gutterBottom>
        Technical Issues
      </Typography>
      <List>
        {analysis.issues.map((issue, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={issue.severity} 
                      size="small" 
                      sx={{ 
                        mr: 1, 
                        bgcolor: getSeverityColor(issue.severity),
                        color: 'white'
                      }} 
                    />
                    <Typography variant="subtitle1">
                      {issue.description}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Category:</strong> {issue.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Impact:</strong> {issue.impact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < analysis.issues.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Recommendations Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Recommendations
      </Typography>
      <List>
        {analysis.recommendations.map((recommendation, index) => (
          <ListItem key={index}>
            <ListItemText primary={recommendation} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TechnicalSEODashboard; 