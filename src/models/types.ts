// Enum types for the hospital surgery system

export enum TipoSangre {
  A_POSITIVO = 'A+',
  A_NEGATIVO = 'A-',
  B_POSITIVO = 'B+',
  B_NEGATIVO = 'B-',
  AB_POSITIVO = 'AB+',
  AB_NEGATIVO = 'AB-',
  O_POSITIVO = 'O+',
  O_NEGATIVO = 'O-',
  OTRO = 'OTRO'
}

export enum EstadoQuirofano {
  LIBRE = 'libre',
  OCUPADO = 'ocupado',
  MANTENIMIENTO = 'mantenimiento',
  LIMPIEZA = 'limpieza',
  FUERA_SERVICIO = 'fuera_servicio',
  OTRO = 'otro'
}

export enum NivelComplejidad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica',
  OTRO = 'otro'
}

export enum TipoEntidad {
  CENTRAL = 'central',
  FARMACIA = 'farmacia',
  OTRO = 'otro'
}

export enum TipoItem {
  INSTRUMENTO = 'instrumento',
  MEDICAMENTO = 'medicamento',
  MATERIAL = 'material',
  EQUIPO = 'equipo',
  OTRO = 'otro'
}

export enum EstadoCirugia {
  PROGRAMADA = 'programada',
  EN_PREPARACION = 'en_preparacion',
  CONTEO_INICIAL = 'conteo_inicial',
  EN_CURSO = 'en_curso',
  CONTEO_FINAL = 'conteo_final',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
  POSPUESTA = 'pospuesta',
  OTRO = 'otro'
}

export enum Prioridad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente',
  OTRO = 'otro'
}

export enum RolCirugia {
  CIRUJANO_AUXILIAR = 'cirujano_auxiliar',
  ANESTESIOLOGO = 'anestesiologo',
  RESIDENTE = 'residente',
  OBSERVADOR = 'observador',
  OTRO = 'otro'
}

export enum TipoConteo {
  INICIAL = 'inicial',
  FINAL = 'final',
  OTRO = 'otro'
}

export enum EstadoConteo {
  CORRECTO = 'correcto',
  FALTANTE = 'faltante',
  SOBRANTE = 'sobrante',
  DAÑADO = 'dañado',
  OTRO = 'otro'
}

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
  OTRO = 'otro'
}

export enum MetodoEsterilizacion {
  AUTOCLAVE = 'autoclave',
  OXIDO_ETILENO = 'oxido_etileno',
  PLASMA = 'plasma',
  VAPOR = 'vapor',
  OTRO = 'otro'
}

export enum TipoIncidente {
  INSTRUMENTO_PERDIDO = 'instrumento_perdido',
  INSTRUMENTO_CONTAMINADO = 'instrumento_contaminado',
  INSTRUMENTO_DAÑADO = 'instrumento_dañado',
  COMPLICACION_MEDICA = 'complicacion_medica',
  FALTA_MATERIAL = 'falta_material',
  OTRO = 'otro'
}

export enum TipoNotificacion {
  SOLICITUD_MATERIAL = 'solicitud_material',
  STOCK_BAJO = 'stock_bajo',
  CIRUGIA_PROGRAMADA = 'cirugia_programada',
  INCIDENTE = 'incidente',
  SISTEMA = 'sistema',
  OTRO = 'otro'
} 