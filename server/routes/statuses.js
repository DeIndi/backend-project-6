import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      console.log('statuss: ', statuses);
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newstatus' }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { name: 'createStatus' }, async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);
      try {
        const validStatus = app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.status.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new status');
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, error });
      }
      return reply;
    })
    .get('/statuses/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      // TODO: убрать проверки на id
      const statusId = req.params.id;
      let status = null;
      try {
        status = await app.objection.models.status.query()
          .findById(statusId);
        if (!status) {
          return reply.status(404).send('status not found');
        }
      } catch (error) {
        console.error(error);
        reply.status(500).send('Internal Server Error');
      }
      reply.render('statuses/new', { status, editing: true });
      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);
      try {
        const validStatus = app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().update(validStatus);
        req.flash('info', i18next.t('flash.status.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new status');
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, error });
      }
      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const statusId = req.params.id;
      try {
        await app.objection.models.status.query()
          .deleteById(statusId);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (error) {
        console.error(error);
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });
};
