import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Tarefa extends Model {
  declare id: number;
  declare titulo: string;
  declare etiqueta: string;
  declare prioridade: string;
  declare status_conclusao: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Tarefa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    etiqueta: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Baixa',
    },
    status_conclusao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'tarefas',
    timestamps: true,
  },
);
