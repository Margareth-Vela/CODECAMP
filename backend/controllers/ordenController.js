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
      const users = await sequelize.query(`SELECT * FROM VistaFacturasUsuario where idUsuarios=:idUsuarios`, {replacements: {idUsuarios} ,
        type: sequelize.QueryTypes.SELECT});
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Ruta para crear una nueva orden
exports.createOrder = async (req, res) => {
    const { idUsuario, direccion, fecha_entrega, detallesOrden } = req.body;
    const total = 0.00;
    try {
        // Obtener datos del usuario desde la tabla Usuarios
        const usuario = await sequelize.query(`
            SELECT Correo, Nombre_completo, telefono FROM Usuarios WHERE idUsuarios = :idUsuario
        `, {
            replacements: { idUsuario },
            type: sequelize.QueryTypes.SELECT
        });

        
        // Crear la orden en estado "Confirmado"
        const [order] = await sequelize.query(`
            EXEC InsertarOrden @idUsuarios=:idUsuarios, @idEstados=:idEstados, @correo=:correo, @nombre_completo=:nombre_completo, @telefono=:telefono, @direccion=:direccion, @total_orden=:total_orden, @fecha_entrega=:fecha_entrega
        `, {
            replacements: { idUsuarios: idUsuario, idEstados : 1, correo: usuario[0].Correo, nombre_completo: usuario[0].Nombre_completo, telefono: usuario[0].telefono, direccion, total_orden : total, fecha_entrega }
        });

        

        const idOrden = order[0].idOrden;
        console.log(order);
        console.log(order[0].idOrden);
        let totalOrden = 0;

        // Insertar los detalles de la orden con los precios correctos y calcular el subtotal
        for (let detalle of detallesOrden) {
            // Obtener el precio del producto
            const producto = await sequelize.query(`
                SELECT precio FROM Productos WHERE idProductos = :idProducto
            `, {
                replacements: { idProducto: detalle.idProducto },
                type: sequelize.QueryTypes.SELECT
            });

            const precio = producto[0].precio;
            const cantidad = detalle.cantidad;
            const subtotal = precio * cantidad; // Calcular el subtotal

            // Sumar el subtotal al total de la orden
            totalOrden += subtotal;

            await sequelize.query(`
                EXEC InsertarOrdenDetalles @idOrden=:idOrden, @idProductos=:idProductos, @cantidad=:cantidad, @precio=:precio, @subtotal=:subtotal
            `, {
                replacements: { idOrden, idProductos: detalle.idProducto, cantidad, precio, subtotal }
            });
        }

        // Actualizar la tabla Orden con el total de la orden
        await sequelize.query(`
            UPDATE Orden
            SET total_orden = :totalOrden
            WHERE idOrden = :idOrden
        `, {
            replacements: { totalOrden, idOrden }
        });

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
