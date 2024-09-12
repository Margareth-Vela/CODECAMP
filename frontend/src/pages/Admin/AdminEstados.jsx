import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { AuthContext } from '../../context/AuthContext';

//Schema
import stateSchema from '../../validation/stateSchema';

//Componentes
import TextFieldController from '../../components/TextFieldController';

//Iconos de la aplicacion
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const AdminStatesPage = () => {
    const { fetchStates, updateStates, createState } = useContext(AuthContext);
    const [statesData, setStatesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStateId, setEditingStateId] = useState(null);
    const [newState, setNewState] = useState(null); // State for new state
    const navigate = useNavigate();

    const { control: editControl, handleSubmit: handleEditSubmit, setValue: setEditValue, formState: { errors: editErrors } } = useForm({
        resolver: yupResolver(stateSchema),
        defaultValues: {
            idEstados: '',
            Nombre: '',
        }
    });

    const { control: createControl, handleSubmit: handleCreateSubmit, setValue: setCreateValue, formState: { errors: createErrors } } = useForm({
        resolver: yupResolver(stateSchema),
        defaultValues: {
            idEstados: '',
            Nombre: '',
        }
    });

    useEffect(() => {
        const fetchAllStates = async () => {
            try {
                const data = await fetchStates();
                setStatesData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStates();
    }, []);

    const getNextStateId = (states) => {
        if (!states || states.length === 0) {
            return 1;
        }
        const maxId = states.reduce((max, state) => Math.max(max, state?.idEstados), 0);
        return maxId + 1;
    };

    const nextStateId = getNextStateId(statesData);

    const handleRowClick = (id, name) => {
        setEditingStateId(id);
        setEditValue('Nombre', name);
        setEditValue('idEstados', id);
    };

    const handleEditSave = async (data) => {
        try {
            await updateStates(data);
            alert('Estado actualizado con éxito');
            setStatesData((prevData) =>
                prevData.map((state) =>
                    state.idEstados === editingStateId ? { ...state, Nombre: data.Nombre } : state
                )
            );
            setEditingStateId(null);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    const handleCreateSave = async (data) => {
        try {
            await createState(data);
            setStatesData((prevData) => [...prevData, { idEstados: nextStateId, Nombre: data.Nombre }]);
            setNewState(data);
            setNewState(null);
            alert('Estado creado con éxito');
            setCreateValue('Nombre', '');
        } catch (error) {
            console.error('Error al crear el estado:', error);
        }
    };

    const handleCreateButtonClick = async () => {

        try {
            setCreateValue('idEstados', nextStateId)
            setNewState(nextStateId);
            navigate('/admin/states');
        } catch (error) {
            console.error('Error al crear el estado:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingStateId(null);
        setEditValue('Nombre', '');
    };

    const handleCancelCreate = () => {
        setNewState(null);
        setCreateValue('Nombre', '');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
                <Paper style={{ padding: '20px' }}>
                    <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
                        <Typography variant="h5" component="div" style={{ padding: '16px' }}>
                            Lista de Estados
                        </Typography>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre Estado</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statesData.map((state) => (
                                    <TableRow
                                        key={state?.idEstados}
                                        hover
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{state?.idEstados}</TableCell>
                                        <TableCell>
                                            {editingStateId === state?.idEstados ? (
                                                <form onSubmit={handleEditSubmit(handleEditSave)}>
                                                    <TextFieldController
                                                        name="Nombre"
                                                        control={editControl}
                                                        label="Nombre del estado"
                                                        errors={editErrors}
                                                    />
                                                    <IconButton onClick={handleCancelEdit}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </form>
                                            ) : (
                                                state?.Nombre
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingStateId === state?.idEstados ? (
                                                <IconButton onClick={handleEditSubmit(handleEditSave)}>
                                                    <CheckIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => handleRowClick(state.idEstados, state.Nombre)}>
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {newState && (
                                    <TableRow key={`new-${newState}`} id={newState?.idEstados}>
                                        <TableCell>Nuevo</TableCell>
                                        <TableCell>
                                            <form onSubmit={handleCreateSubmit(handleCreateSave)}>
                                                <TextFieldController
                                                    name="Nombre"
                                                    control={createControl}
                                                    label="Nombre del estado"
                                                    errors={createErrors}
                                                />

                                                <Button type="submit" color="primary">Guardar</Button>
                                                <IconButton onClick={handleCancelCreate}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </form>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateButtonClick}
                        >
                            Crear Estado
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminStatesPage;
