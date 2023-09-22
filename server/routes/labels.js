// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      console.log('labels: ', labels);
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newlabel' }, async (req, reply) => {
      const label = new app.objection.models.label();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      reply.render('labels/new', { label, users, statuses });
      return reply;
    })
    .post('/labels', async (req, reply) => {
      const label = new app.objection.models.label();
      // label.$set(req.body.data);
      try {
        const formData = req.body.data;
        /* const labelData = {
          ...formData,
          statusId: Number(formData.statusId),
          creatorId: Number(req.user.id),
          executorId: !formData.executorId ? null : Number(formData.executorId),
        }; */
        await app.objection.models.label.query().insert(formData);
        req.flash('info', i18next.t('flash.label.create.success'));
        reply.redirect(app.reverse('root'));
        await req.logIn(label);
      } catch (error) {
        console.log('could not create new label');
        req.flash('error', i18next.t('flash.labels.create.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        reply.render('labels/new', {
          label, users, statuses, errors: error.data,
        });
        console.log('error: ', error);
      }
      return reply;
    })
    .get('/labels/:id/edit', { name: 'editlabel', preValidation: app.authenticate }, async (req, reply) => {
      const labelId = req.params.id;
      if (req.label.id !== Number(labelId)) {
        reply.redirect(app.reverse('labels'));
        return reply;
      }
      let label = null;
      try {
        label = await app.objection.models.label.query()
          .findById(labelId);
        if (!label) {
          return reply.status(404).send('label not found');
        }
      } catch (error) {
        console.error(error);
        reply.status(500).send('Internal Server Error');
      }
      reply.render('labels/new', { label, editing: true });
      return reply;
    })
    .patch('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      if (req.user.id !== label.creatorId) {
        req.flash('error', i18next.t('flash.labels.accessError'));
        reply.redirect(app.reverse('labels'));
      }
      label.$set(req.body.data);
      try {
        const validlabel = app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().update(validlabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new label');
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, error });
      }
      return reply;
    })
    .delete('/labels/:id', { name: 'deletelabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);

      if (!label) {
        return reply.status(404).send('label not found');
      }
      if (req.user.id !== label.creatorId) {
        req.flash('error', i18next.t('flash.labels.accessError'));
        reply.redirect(app.reverse('labels'));
      } else {
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(app.reverse('labels'));
      }
      return reply;
    });
};
