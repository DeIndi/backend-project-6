// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        accessError: 'Access denied!',
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        labels: 'Labels',
        tasks: 'Tasks',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Created at',
        username: 'Username',
        firstName: 'First name',
        lastName: 'Last name',
        password: 'Password',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          submit: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
      },
      tasks: {
        id: 'ID',
        creatorId: 'creatorId',
        createdAt: 'Created at',
        statusId: 'statusId',
        executorId: 'executorId',
        new: {
          submit: 'Create',
          create: 'Create task',
        },
        edit: {
          submit: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        new: {
          submit: 'Create',
          create: 'Create status',
        },
        edit: {
          submit: 'Edit',
        },
        delete: {
          delete: 'Delete',
          submit: 'Delete',
        },
      },
      labels: {
        id: 'ID',
        name: 'Name',
        new: {
          submit: 'Create',
          create: 'Create label',
        },
        edit: {
          submit: 'Edit',
        },
        delete: {
          delete: 'Delete',
          submit: 'Delete',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
    },
  },
};
