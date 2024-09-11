import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Contextos
import { AuthContext } from '../../context/AuthContext';

const AdminUsersPage = () => {
    const { fetchUsers } = useContext(AuthContext);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsersData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    const handleRowClick = (id) => {
        const selectedUser = usersData.find(user => user.idUsuarios === id);
        navigate(`/admin/users/${id}`, { state: { userDetails: selectedUser } });
    };

    const handleCreateButtonClick = () => {
        navigate('/admin/users/create');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Paper>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div" style={{ padding: '16px' }}>
                    Historial de Usuarios
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateButtonClick}
                >
                    Crear Usuario
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>ID</TableCell>
                            <TableCell>Nombre completo</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Teléfono</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersData.map((user) => (
                            <TableRow
                                key={user.idUsuarios}
                                hover
                                onClick={() => handleRowClick(user.idUsuarios)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{user.idUsuarios}</TableCell>
                                <TableCell>{user.Nombre_completo}</TableCell>
                                <TableCell>{user.Rol}</TableCell>
                                <TableCell>{user.Estado}</TableCell>
                                <TableCell>{user.Correo}</TableCell>
                                <TableCell>{user.telefono}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminUsersPage;
