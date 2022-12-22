import { Application } from 'express';
import ordersRouter from './ordersRouter';
import collectionsRouter from './collectionsRouter';
import usersRouter from './usersRouter';
const express = require('express');

export default class Routes {

  constructor(app: Application) {
    // orders reoutes
    app.use('/api/v1/orders', ordersRouter);
    // collections routes
    app.use('/api/v1/collections', collectionsRouter);
    // users routes
    app.use('/api/v1/users', usersRouter);
    // uploads
    app.use('/uploads', express.static(__dirname + '/../../uploads'));
  }
}