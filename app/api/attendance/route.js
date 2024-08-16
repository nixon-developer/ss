import connectToDB from '@/utils/db';
import Attendance from '@/models/Attendance';
import Staff from '@/models/Staff';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    const { qrCodeData } = req.body;

    const staff = await Staff.findOne({ name: qrCodeData });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const latestAttendance = await Attendance.findOne({ staffId: staff._id }).sort({ date: -1 });

    const newType = latestAttendance?.type === 'in' ? 'out' : 'in';

    const attendance = new Attendance({
      staffId: staff._id,
      date: new Date(),
      type: newType
    });

    await attendance.save();

    res.status(201).json(attendance);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
