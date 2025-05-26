import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Import models
import Role from './Role';
import Usuario from './Usuario';
import Especialidad from './Especialidad';
import Medico from './Medico';
import Paciente from './Paciente';
import CategoriaQuirofano from './CategoriaQuirofano';
import Quirofano from './Quirofano';
import TipoCirugia from './TipoCirugia';
import EntidadSuministradora from './EntidadSuministradora';
import CategoriaItem from './CategoriaItem';
import Item from './Item';
import Stock from './Stock';
import Cirugia from './Cirugia';
import CirugiaPersonal from './CirugiaPersonal';
import CirugiaStockAsignado from './CirugiaStockAsignado';
import ConteoInstrumentacion from './ConteoInstrumentacion';
import DetalleConteo from './DetalleConteo';
import EntregaStock from './EntregaStock';
import SolicitudCirugia from './SolicitudCirugia';
import Esterilizacion from './Esterilizacion';
import Incidente from './Incidente';
import Notificacion from './Notificacion';
import SesionUsuario from './SesionUsuario';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'hospital_cirugias',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: console.log,
  models: [
    Role,
    Usuario,
    Especialidad,
    Medico,
    Paciente,
    CategoriaQuirofano,
    Quirofano,
    TipoCirugia,
    EntidadSuministradora,
    CategoriaItem,
    Item,
    Stock,
    Cirugia,
    CirugiaPersonal,
    CirugiaStockAsignado,
    ConteoInstrumentacion,
    DetalleConteo,
    EntregaStock,
    SolicitudCirugia,
    Esterilizacion,
    Incidente,
    Notificacion,
    SesionUsuario
  ]
});

export default sequelize; 