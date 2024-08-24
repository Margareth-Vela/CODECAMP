const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Ruta para leer una categoria de producto
exports.getAllCategories = async (req, res) => {
    try {
      const users = await sequelize.query("SELECT * FROM VistaCategoriasProductos");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Ruta para crear una categoria de producto
exports.createCategory = async (req, res) => {
    const { idCategoriaProductos, idUsuarios, nombre, idEstados } = req.body;

    try {
        await sequelize.query(`
            EXEC InsertarCatProductos @idCategoriaProductos =:idCategoriaProductos, @idUsuarios=:idUsuarios, @nombre=:nombre, @idEstados=:idEstados`,
        {
            replacements: { idCategoriaProductos, idUsuarios, nombre, idEstados }
        });
        res.status(201).json({ message: 'Categoría de producto creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear categoría de producto:', error);
        res.status(500).json({ error: 'Error al crear la categoría de producto.' });
    }
};

// Ruta para actualizar las categorias de productos 
exports.updateCategory = async (req, res) => {
    const { idCategoriaProductos } = req.params;
    const { idUsuarios, nombre, idEstados } = req.body;

    try {
        await sequelize.query(`
            EXEC ActualizarCatProductos @idCategoriaProductos=:idCategoriaProductos, @idUsuarios=:idUsuarios, @nombre=:nombre, @idEstados=:idEstados`,
        {
            replacements: { idCategoriaProductos, idUsuarios, nombre, idEstados }
        });
        res.status(200).json({ message: 'Categoría de producto actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar categoría de producto:', error);
        res.status(500).json({ error: 'Error al actualizar la categoría de producto.' });
    }
};
