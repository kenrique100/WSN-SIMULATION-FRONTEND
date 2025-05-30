import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import React from 'react';

export interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  action?: React.ReactNode; // ✅ Add this line
}

export default function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) =>
            crumb.href ? (
              <Link color="inherit" href={crumb.href} key={index}>
                {crumb.label}
              </Link>
            ) : (
              <Typography color="textPrimary" key={index}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
