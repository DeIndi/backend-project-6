// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      console.log('users: ', users);
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        const validUser = app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.user.create.success'));
        reply.redirect(app.reverse('root'));
        await req.logIn(user);
      } catch (error) {
        console.log('could not create new user');
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, error });
      }
      return reply;
    })
    .get('/users/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const userId = req.params.id;
      if (req.user.id !== Number(userId)) {
        reply.redirect(app.reverse('users'));
        return reply;
      }
      let user = null;
      try {
        user = await app.objection.models.user.query()
          .findById(userId);
        if (!user) {
          return reply.status(404).send('User not found');
        }
      } catch (error) {
        console.error(error);
        reply.status(500).send('Internal Server Error');
      }
      reply.render('users/new', { user, editing: true });
      return reply;
    })
    .patch('/users/:id', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        const validUser = app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().update(validUser);
        req.flash('info', i18next.t('flash.user.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new user');
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, error });
      }
      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const userId = req.params.id;
      if (req.user.id !== Number(userId)) {
        reply.redirect(app.reverse('users'));
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply;
      }
      try {
        await app.objection.models.user.query()
          .deleteById(userId);
        /* if (!user) { */
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch (error) {
        console.error(error);
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });

  // eslint-disable-next-line max-len
  /* TODO: `+buttonTo(route('user', { id: user.id }), 'delete')(class="btn btn-danger" value=t('views.user.delete.submit'))` */
};
