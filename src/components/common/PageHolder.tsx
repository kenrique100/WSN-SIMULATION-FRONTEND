import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { ReactNode } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
    title: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: ReactNode;
}

export default function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <Box sx={{ mb: 4 }}>
            {breadcrumbs && (
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
                    <Link href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        crumb.href ? (
                            <Link key={index} href={crumb.href}>
                                {crumb.label}
                            </Link>
                        ) : (
                            <Typography key={index} color="text.primary">
                                {crumb.label}
                            </Typography>
                        )
                    ))}
                </Breadcrumbs>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    {title}
                </Typography>
                {actions && <Box>{actions}</Box>}
            </Box>
        </Box>
    );
}