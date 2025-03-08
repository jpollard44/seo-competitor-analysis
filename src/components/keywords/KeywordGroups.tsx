import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { KeywordGroup } from '../../types/keyword';

interface KeywordGroupsProps {
  groups: KeywordGroup[];
  onSelectGroup: (groupId: string) => void;
  selectedGroupId?: string;
}

const KeywordGroups: React.FC<KeywordGroupsProps> = ({
  groups,
  onSelectGroup,
  selectedGroupId,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Keyword Groups
        </Typography>
        <List>
          {groups.map((group) => (
            <React.Fragment key={group.id}>
              <ListItem
                button
                selected={selectedGroupId === group.id}
                onClick={() => onSelectGroup(group.id)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(group.id);
                    }}
                  >
                    {expandedGroups.has(group.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
              >
                <ListItemText
                  primary={group.name}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={`${group.keywords.length} keywords`}
                        size="small"
                      />
                      <Chip
                        label={`Volume: ${group.totalVolume.toLocaleString()}`}
                        size="small"
                      />
                      <Chip
                        label={`Difficulty: ${group.averageDifficulty}`}
                        size="small"
                      />
                    </Box>
                  }
                />
              </ListItem>
              <Collapse in={expandedGroups.has(group.id)}>
                <List disablePadding>
                  {group.keywords.slice(0, 5).map((keyword) => (
                    <ListItem
                      key={keyword.id}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText
                        primary={keyword.term}
                        secondary={`Volume: ${keyword.searchVolume} | Difficulty: ${keyword.difficulty}`}
                      />
                    </ListItem>
                  ))}
                  {group.keywords.length > 5 && (
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText
                        secondary={`${group.keywords.length - 5} more keywords...`}
                      />
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default KeywordGroups; 