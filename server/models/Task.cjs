const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');
const Status = require('./Status.cjs');
const User = require('./User.cjs');

const unique = objectionUnique({ fields: ['id'] });

module.exports = class Task extends unique(BaseModel) {
  static get tableName() {
    return 'tasks';
  }
  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId', 'executorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer', minimum: 1 },
        executorId: { type: 'integer', minimum: 1 },
      },
    };
  }
  
  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id'
        },
      },
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id'
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id'
        },
      }
    }
  }
  
}

// TODO: запуск через heroku
