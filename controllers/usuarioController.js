const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const Favorito = require("../models/favorito");
const Producto = require("../models/producto");
const Imagen = require("../models/imagen");
const Caracteristica = require("../models/caracteristica");

exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rolId } = req.body;

    console.log("Datos recibidos para la creación de usuario:", req.body);

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Validar que el rolId sea válido
    const rolExistente = await Rol.findByPk(rolId);
    if (!rolExistente) {
      return res.status(400).json({ message: "El rol especificado no existe" });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rolId,
    });

    console.log("Usuario creado:", nuevoUsuario);

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario: " + error, error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rolId: usuario.rolId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "apellido", "email", "rolId"],
      include: {
        model: Rol,
        attributes: ["nombre"],
      },
    });

    console.log("Usuarios obtenidos:", usuarios);

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

exports.cambiarRol = async (req, res) => {
  try {
    const { id, rolId } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.rolId = rolId;
    await usuario.save();

    res.json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol del usuario", error });
  }
};

// Marcar o desmarcar producto como favorito
exports.toggleFavorito = async (req, res) => {
  const { rolId, productoId } = req.body; // Cambié usuarioId por rolId

  try {
    // Verificar si ya existe el favorito
    const favoritoExistente = await Favorito.findOne({
      where: { rolId: rolId, producto_id: productoId }, // Cambié usuario_id por rolId
    });

    if (favoritoExistente) {
      // Si existe, eliminarlo (desmarcar favorito)
      await favoritoExistente.destroy();
      return res.json({ message: "Producto eliminado de favoritos" });
    } else {
      // Si no existe, crear el favorito (marcar como favorito)
      await Favorito.create({ rolId: rolId, producto_id: productoId }); // Cambié usuario_id por rolId
      return res.json({ message: "Producto agregado a favoritos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al manejar el favorito", error });
  }
};

// Obtener la lista de favoritos del rol
exports.obtenerFavoritos = async (req, res) => {
  const { rolId } = req.params; // Cambié usuarioId por rolId

  try {
    // Buscar los favoritos del rol
    const rol = await Rol.findByPk(rolId, {
      include: [
        {
          model: Producto,
          as: "favoritos", // Asegúrate de que el alias esté bien configurado en el modelo
          include: [
            { model: Imagen, as: "imagenes" }, // Incluir imágenes del producto si es necesario
            { model: Caracteristica, as: "caracteristicas" }, // Incluir características del producto si es necesario
          ],
        },
      ],
    });

    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.json(rol.favoritos); // Devuelve la lista completa de productos favoritos
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los favoritos", error });
  }
};

// Controlador para actualizar un usuario existente
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, rolId } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let hashedPassword = usuario.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await usuario.update(
      {
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rolId,
      },
      { fields: ["nombre", "apellido", "email", "password", "rolId"] }
    );

    res.json({ message: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};
