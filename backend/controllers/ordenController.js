const express = require('express');
const router = express.Router();
const sequelize = require('../config/database.js');

// Ruta para leer todas las ordenes
exports.getAllOrdenes = async (req, res) => {
    try {
      const users = await sequelize.query("SELECT * FROM VistaOrdenes");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Ruta para leer las ordenes de un usuario
exports.getOrdenUser = async (req, res) => {
    const { idUsuarios } = req.params;
    try {
      const users = await sequelize.query(`SELECT * FROM VistaOrdenes where idUsuarios=:idUsuarios`, {replacements: {idUsuarios} ,
        type: sequelize.QueryTypes.SELECT});
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Ruta para leer una orden 
exports.getOrderDetails = async (req, res) => {
    const { idOrden } = req.params;
    try {
        // Consulta la vista para obtener los detalles de la orden
        const results = await sequelize.query(
            'SELECT * FROM OrdenDetallesVista WHERE idOrden = :idOrden',
            {
                replacements: { idOrden },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener los detalles de la orden:', err);
        res.status(500).json({ error: err.message });
    }
};

// Ruta para crear una nueva orden
exports.createOrder = async (req, res) => {
    const {nombre_completo, correo, telefono, direccion, fecha_entrega, detallesOrden } = req.body;
    const idUsuarios = req.user.userId;
    const orderData = {
        nombre_completo,
        correo,
        telefono,
        direccion,
        fecha_entrega,
        detallesOrden
    };
    const orderDataJson = JSON.stringify(orderData);

    try {
        // Crear Orden
        const [result] = await sequelize.query(`
            EXEC CrearOrden @json=:orderDataJson, @idUsuarios=:idUsuarios
        `, {
            replacements: { orderDataJson, idUsuarios }
        });

        const idOrden = result[0].idOrden;
        res.status(201).json({ message: 'Orden creada exitosamente.', idOrden });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error al crear la orden.' });
    }
};

// Ruta para actualizar el estado de una orden 
exports.updateOrder = async (req, res) => {
    const { idOrden } = req.params;
    const { nombre_completo, direccion, telefono, correo, fecha_entrega, total_orden, idEstados, motivo_rechazo } = req.body;

    try {
        let sqlQuery = `
            EXEC ActualizarOrden @idOrden=:idOrden, @nombre_completo=:nombre_completo, @direccion=:direccion, @telefono=:telefono, @correo=:correo, @fecha_entrega=:fecha_entrega, @total_orden=:total_orden, @idEstados=:idEstados
        `;

        const replacements = { idOrden, nombre_completo, direccion, telefono, correo, fecha_entrega, total_orden, idEstados };

        // Agregar motivo_rechazo solo si el estado es "Cancelado" o "Devuelto"
        if ((idEstados === 2 || idEstados === 6) && motivo_rechazo) {
            sqlQuery += `, @motivo_rechazo=:motivo_rechazo`;
            replacements.motivo_rechazo = motivo_rechazo;
        }

        await sequelize.query(sqlQuery, {
            replacements
        });

        res.status(200).json({ message: 'Orden actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ error: 'Error al actualizar la orden.' });
    }
};
