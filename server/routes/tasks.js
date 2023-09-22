// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newtask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', { task, users, statuses, labels });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      const task = new app.objection.models.task();
      console.log('req body from task post: ', req.body);
      // task.$set(req.body.data);
      try {
        const formData = req.body.data;
        const taskData = {
          ...formData,
          statusId: Number(formData.statusId),
          creatorId: Number(req.user.id),
          executorId: !formData.executorId ? null : Number(formData.executorId),
          labels: Number(formData.labels),
        };
        await app.objection.models.task.query().insert(taskData);
        req.flash('info', i18next.t('flash.task.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/new', {
          task, users, statuses, labels, errors: error.data,
        });
      }
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'edittask', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      if (req.task.id !== Number(taskId)) {
        reply.redirect(app.reverse('tasks'));
        return reply;
      }
      let task = null;
      try {
        task = await app.objection.models.task.query()
          .findById(taskId);
        if (!task) {
          return reply.status(404).send('task not found');
        }
      } catch (error) {
        reply.status(500).send('Internal Server Error');
      }
      reply.render('tasks/new', { task, editing: true });
      return reply;
    })
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      if (req.user.id !== task.creatorId) {
        req.flash('error', i18next.t('flash.tasks.accessError'));
        reply.redirect(app.reverse('tasks'));
      }
      task.$set(req.body.data);
      try {
        const validtask = app.objection.models.task.fromJson(req.body.data);
        await app.objection.models.task.query().update(validtask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, error });
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deletetask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);

      if (!task) {
        return reply.status(404).send('Task not found');
      }
      if (req.user.id !== task.creatorId) {
        req.flash('error', i18next.t('flash.tasks.accessError'));
        reply.redirect(app.reverse('tasks'));
      } else {
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
      }
      return reply;
    });
};
