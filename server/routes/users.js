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
        // req.logIn(user);
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new user');
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, error });
      }
      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
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
    .patch('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        const validUser = app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().update(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        console.log('could not create new user');
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, error });
      }
      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      if (Number(id) !== req.user.id) {
        req.flash('error', i18next.t('flash.users.accessError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }

      await app.objection.models.user.query().deleteById(id);
      req.logOut();
      req.flash('info', i18next.t('flash.users.delete.success'));

      reply.redirect(app.reverse('users'));
      return reply;
    });
};
