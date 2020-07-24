import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAutheticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentController';
import ProviderAppointmetsController from '../controllers/ProviderAppointmetsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController();
const providerAppointmetsController = new ProviderAppointmetsController();

appointmentsRouter.use(ensureAutheticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentController.create,
);
appointmentsRouter.get('/me', providerAppointmetsController.index);

export default appointmentsRouter;
