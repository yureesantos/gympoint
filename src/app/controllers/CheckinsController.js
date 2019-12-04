import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinsController {
  async store(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const subDate = subDays(new Date(), 7);
    const todayDate = new Date();

    const checkinVerify = await Checkin.findAll({
      where: {
        created_at: {
          [Op.between]: [startOfDay(subDate), endOfDay(todayDate)],
        },
      },
    });

    if (checkinVerify.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You have exceeded the number of checkins' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinsController();
