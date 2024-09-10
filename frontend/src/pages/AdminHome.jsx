import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';


const AdminHomePage = () => {
    const actions = [
        { title: 'Ver Productos', description: 'Administra los productos disponibles', link: '/admin/products' },
        { title: 'Ver Categorías', description: 'Administra las categorías de productos', link: '/admin/categories' },
        { title: 'Ver Órdenes', description: 'Administra las órdenes de compra', link: '/admin/orders' },
        { title: 'Ver Usuarios', description: 'Administra los usuarios del sistema', link: '/admin/users' },
    ];

    return (
            <Grid container spacing={3}>
                {actions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {action.description}
                                </Typography>
                                <Button variant="contained" color="primary" href={action.link} style={{ marginTop: '10px' }}>
                                    Ir
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
    );
};

export default AdminHomePage;
