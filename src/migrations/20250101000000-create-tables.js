'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create or replace update function for all tables
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create roles table
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create usuarios table
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      cedula: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20)
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create trigger for updated_at on usuarios
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_usuarios_updated_at
      BEFORE UPDATE ON usuarios
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create especialidades table
    await queryInterface.createTable('especialidades', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create medicos table
    await queryInterface.createTable('medicos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      numero_licencia: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      especialidad_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'especialidades',
          key: 'id'
        }
      },
      anos_experiencia: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create pacientes table
    await queryInterface.createTable('pacientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cedula: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(20)
      },
      direccion: {
        type: Sequelize.TEXT
      },
      tipo_sangre: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'OTRO')
      },
      alergias: {
        type: Sequelize.TEXT
      },
      condiciones_medicas: {
        type: Sequelize.TEXT
      },
      contacto_emergencia_nombre: {
        type: Sequelize.STRING(100)
      },
      contacto_emergencia_telefono: {
        type: Sequelize.STRING(20)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create trigger for updated_at on pacientes
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_pacientes_updated_at
      BEFORE UPDATE ON pacientes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create categorias_quirofanos table
    await queryInterface.createTable('categorias_quirofanos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create quirofanos table
    await queryInterface.createTable('quirofanos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categorias_quirofanos',
          key: 'id'
        }
      },
      estado: {
        type: Sequelize.ENUM('libre', 'ocupado', 'mantenimiento', 'limpieza', 'fuera_servicio', 'otro'),
        defaultValue: 'libre'
      },
      capacidad_personas: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      equipamiento_especial: {
        type: Sequelize.TEXT
      },
      ubicacion: {
        type: Sequelize.STRING(100)
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create trigger for updated_at on quirofanos
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_quirofanos_updated_at
      BEFORE UPDATE ON quirofanos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create tipos_cirugia table
    await queryInterface.createTable('tipos_cirugia', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      duracion_estimada_minutos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      nivel_complejidad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'critica', 'otro'),
        defaultValue: 'media'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create entidades_suministradoras table
    await queryInterface.createTable('entidades_suministradoras', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('central', 'farmacia', 'otro'),
        allowNull: false
      },
      ubicacion: {
        type: Sequelize.STRING(200)
      },
      telefono: {
        type: Sequelize.STRING(20)
      },
      responsable_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create categorias_items table
    await queryInterface.createTable('categorias_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      tipo: {
        type: Sequelize.ENUM('instrumento', 'medicamento', 'material', 'equipo', 'otro'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create items table
    await queryInterface.createTable('items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias_items',
          key: 'id'
        }
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      es_reutilizable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      requiere_esterilizacion: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      unidad_medida: {
        type: Sequelize.STRING(20),
        defaultValue: 'unidad'
      },
      proveedor: {
        type: Sequelize.STRING(200)
      },
      fecha_vencimiento: {
        type: Sequelize.DATEONLY
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create stock table
    await queryInterface.createTable('stock', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      cantidad_disponible: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      cantidad_en_uso: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      cantidad_minima: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      lote: {
        type: Sequelize.STRING(50)
      },
      fecha_vencimiento: {
        type: Sequelize.DATEONLY
      },
      ubicacion_almacen: {
        type: Sequelize.STRING(100)
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create trigger for updated_at on stock
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_stock_updated_at
      BEFORE UPDATE ON stock
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Add a unique constraint to stock
    await queryInterface.addConstraint('stock', {
      fields: ['item_id', 'entidad_suministradora_id', 'lote'],
      type: 'unique',
      name: 'unique_item_entidad_lote'
    });

    // Create cirugias table
    await queryInterface.createTable('cirugias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      paciente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pacientes',
          key: 'id'
        }
      },
      tipo_cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_cirugia',
          key: 'id'
        }
      },
      quirofano_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quirofanos',
          key: 'id'
        }
      },
      cirujano_principal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medicos',
          key: 'id'
        }
      },
      instrumentador_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      fecha_programada: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_fin: {
        type: Sequelize.DATE
      },
      estado: {
        type: Sequelize.ENUM('programada', 'en_preparacion', 'conteo_inicial', 'en_curso', 'conteo_final', 'finalizada', 'cancelada', 'pospuesta', 'otro'),
        defaultValue: 'programada'
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente', 'otro'),
        defaultValue: 'media'
      },
      observaciones_previas: {
        type: Sequelize.TEXT
      },
      observaciones_finales: {
        type: Sequelize.TEXT
      },
      diagnostico_preoperatorio: {
        type: Sequelize.TEXT
      },
      diagnostico_postoperatorio: {
        type: Sequelize.TEXT
      },
      duracion_real_minutos: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create trigger for updated_at on cirugias
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_cirugias_updated_at
      BEFORE UPDATE ON cirugias
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create cirugia_personal table
    await queryInterface.createTable('cirugia_personal', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      medico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medicos',
          key: 'id'
        }
      },
      rol_en_cirugia: {
        type: Sequelize.ENUM('cirujano_auxiliar', 'anestesiologo', 'residente', 'observador', 'otro'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add a unique constraint to cirugia_personal
    await queryInterface.addConstraint('cirugia_personal', {
      fields: ['cirugia_id', 'medico_id', 'rol_en_cirugia'],
      type: 'unique',
      name: 'unique_cirugia_medico_rol'
    });

    // Create cirugia_stock_asignado table
    await queryInterface.createTable('cirugia_stock_asignado', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      cantidad_asignada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      es_adicional: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fecha_asignacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      asignado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create conteos_instrumentacion table
    await queryInterface.createTable('conteos_instrumentacion', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tipo_conteo: {
        type: Sequelize.ENUM('inicial', 'final', 'otro'),
        allowNull: false
      },
      fecha_conteo: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      realizado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      confirmado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create detalle_conteos table
    await queryInterface.createTable('detalle_conteos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      conteo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conteos_instrumentacion',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      cantidad_esperada: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cantidad_contada: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('correcto', 'faltante', 'sobrante', 'dañado', 'otro'),
        allowNull: false,
        defaultValue: 'correcto'
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create entregas_stock table
    await queryInterface.createTable('entregas_stock', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      cantidad_entregada: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_entrega: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      entregado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      recibido_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      es_urgente: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create solicitudes_cirugia table
    await queryInterface.createTable('solicitudes_cirugia', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      cantidad_solicitada: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente', 'otro'),
        defaultValue: 'media'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en_proceso', 'entregada', 'cancelada', 'otro'),
        defaultValue: 'pendiente'
      },
      fecha_solicitud: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      solicitado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      fecha_entrega: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create esterilizaciones table
    await queryInterface.createTable('esterilizaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      cirugia_origen_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'cirugias',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      fecha_esterilizacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      metodo_esterilizacion: {
        type: Sequelize.ENUM('autoclave', 'oxido_etileno', 'plasma', 'vapor', 'otro'),
        defaultValue: 'otro'
      },
      responsable_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      lote_esterilizacion: {
        type: Sequelize.STRING(50)
      },
      temperatura: {
        type: Sequelize.DECIMAL(5, 2)
      },
      tiempo_minutos: {
        type: Sequelize.INTEGER
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create incidentes table
    await queryInterface.createTable('incidentes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cirugia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cirugias',
          key: 'id'
        }
      },
      tipo_incidente: {
        type: Sequelize.ENUM('instrumento_perdido', 'instrumento_contaminado', 'instrumento_dañado', 'complicacion_medica', 'falta_material', 'otro'),
        allowNull: false
      },
      severidad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'critica', 'otro'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      reportado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      fecha_incidente: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      resuelto: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fecha_resolucion: {
        type: Sequelize.DATE
      },
      acciones_tomadas: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create notificaciones table
    await queryInterface.createTable('notificaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      entidad_suministradora_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'entidades_suministradoras',
          key: 'id'
        }
      },
      tipo: {
        type: Sequelize.ENUM('solicitud_material', 'stock_bajo', 'cirugia_programada', 'incidente', 'sistema', 'otro'),
        allowNull: false
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente', 'otro'),
        defaultValue: 'media'
      },
      leida: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      url_accion: {
        type: Sequelize.STRING(500)
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      fecha_lectura: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create sesiones_usuario table
    await queryInterface.createTable('sesiones_usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      token_sesion: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      fecha_expiracion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45)
      },
      user_agent: {
        type: Sequelize.TEXT
      },
      activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create indexes
    await queryInterface.addIndex('cirugias', ['fecha_programada'], { name: 'idx_cirugias_fecha' });
    await queryInterface.addIndex('cirugias', ['estado'], { name: 'idx_cirugias_estado' });
    await queryInterface.addIndex('cirugias', ['quirofano_id'], { name: 'idx_cirugias_quirofano' });
    await queryInterface.addIndex('stock', ['item_id', 'entidad_suministradora_id'], { name: 'idx_stock_item_entidad' });
    await queryInterface.addIndex('solicitudes_cirugia', ['estado'], { name: 'idx_solicitudes_estado' });
    await queryInterface.addIndex('solicitudes_cirugia', ['prioridad'], { name: 'idx_solicitudes_prioridad' });
    await queryInterface.addIndex('notificaciones', ['usuario_id', 'leida'], { name: 'idx_notificaciones_usuario' });
    await queryInterface.addIndex('entregas_stock', ['fecha_entrega'], { name: 'idx_entregas_fecha' });
    await queryInterface.addIndex('incidentes', ['severidad', 'resuelto'], { name: 'idx_incidentes_severidad' });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('sesiones_usuario');
    await queryInterface.dropTable('notificaciones');
    await queryInterface.dropTable('incidentes');
    await queryInterface.dropTable('esterilizaciones');
    await queryInterface.dropTable('solicitudes_cirugia');
    await queryInterface.dropTable('entregas_stock');
    await queryInterface.dropTable('detalle_conteos');
    await queryInterface.dropTable('conteos_instrumentacion');
    await queryInterface.dropTable('cirugia_stock_asignado');
    await queryInterface.dropTable('cirugia_personal');
    await queryInterface.dropTable('cirugias');
    await queryInterface.dropTable('stock');
    await queryInterface.dropTable('items');
    await queryInterface.dropTable('categorias_items');
    await queryInterface.dropTable('entidades_suministradoras');
    await queryInterface.dropTable('tipos_cirugia');
    await queryInterface.dropTable('quirofanos');
    await queryInterface.dropTable('categorias_quirofanos');
    await queryInterface.dropTable('pacientes');
    await queryInterface.dropTable('medicos');
    await queryInterface.dropTable('especialidades');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('roles');
  }
}; 