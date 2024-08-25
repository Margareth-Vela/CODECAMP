const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Ruta para leer los estados
exports.getAllStates = async (req, res) => {
    try {
      const users = await sequelize.query("SELECT * FROM VistaEstados");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Ruta para crear un estado
exports.createEstado = async (req, res) => {
    const { idEstados, Nombre } = req.body;

    try {
        await sequelize.query(`
            EXEC InsertarEstados @idEstados=:idEstados, @Nombre=:Nombre`, {
            replacements: { idEstados, Nombre }
        });

        res.status(201).json({ message: 'Estado creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear estado:', error);
        res.status(500).json({ error: 'Error al crear el estado.' });
    }
};

// Ruta para actualizar un estado
exports.updateEstado = async (req, res) => {
    const { idEstados } = req.params;
    const { Nombre } = req.body;

    try {
        await sequelize.query(`
            EXEC ActualizarEstados @idEstados=:idEstados, @Nombre=:Nombre
        `, {
            replacements: { idEstados, Nombre }
        });

        res.status(200).json({ message: 'Estado actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar el estado.' });
    }
};
