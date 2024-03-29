const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');
const Task = require("./Task.cjs");

const unique = objectionUnique({ fields: ['id'] });

module.exports = class Label extends unique(BaseModel) {
  static get tableName() {
    return 'labels';
  }
  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }
  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Task,
        join: {
          from: 'tasks.id',
          to: 'labels.id'
        },
      },
    }
  }
  
}
