// @ts-check

import i18next from 'i18next';
import bcrypt from 'bcrypt';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
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
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .post('/users/register', async (req, reply) => {
      console.log('req: ', req);
      const userModel = app.objection.models.user;
      const {
        firstName, lastName, email, password,
      } = req.body;

      try {
        const existingUser = await userModel.query().where('email', email).first();
        if (existingUser) {
          throw new Error('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.query().insert({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: { email }, registrationError: error.message });
      }
    });
};
