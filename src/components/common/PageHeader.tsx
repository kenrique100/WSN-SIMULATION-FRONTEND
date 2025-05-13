import { Breadcrumbs, Typography, Link, Box } from '@mui/material';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbs.map((crumb, index) =>
                    crumb.href ? (
                        <Link key={index} color="inherit" href={crumb.href}>
                            {crumb.label}
                        </Link>
                    ) : (
                        <Typography key={index} color="text.primary">
                            {crumb.label}
                        </Typography>
                    )
                )}
            </Breadcrumbs>
        </Box>
    );
}