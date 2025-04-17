
import Appraisal from '../models/Appraisal.js';
import User from '../models/User.js';
import Question from '../models/Question.js';


export const getAppraisals = async (req, res) => {
  try {
    const appraisals = await Appraisal.find()
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.json(appraisals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAppraisalById = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id)
      .populate('targetUser', 'name email manager')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    const user = req.user;

    if (user.role === 'admin') {
      return res.json(appraisal);
    }

    if (user.role === 'manager') {
      if (
        appraisal.submittedBy._id.toString() === user._id.toString() ||
        appraisal.targetUser._id.toString() === user._id.toString() ||
        (appraisal.isSelfAppraisal &&
          appraisal.targetUser.manager &&
          appraisal.targetUser.manager.toString() === user._id.toString())
      ) {
        return res.json(appraisal);
      }
    } else {
      if (appraisal.submittedBy._id.toString() === user._id.toString()) {
        return res.json(appraisal);
      }
    }

    res.status(403).json({ message: 'Not authorized to view this appraisal' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const createAppraisal = async (req, res) => {
  try {
    const { targetUser, submittedBy, answers } = req.body;

    const targetUserExists = await User.findById(targetUser);
    if (!targetUserExists) {
      return res.status(400).json({ message: 'Target user not found' });
    }

    const submittedByUser = await User.findById(submittedBy);
    if (!submittedByUser) {
      return res.status(400).json({ message: 'Submitting user not found' });
    }

    for (const answer of answers) {
      const question = await Question.findById(answer.question);
      if (!question) {
        return res.status(400).json({ message: `Question with ID ${answer.question} not found` });
      }
    }

    const isSelfAppraisal = targetUser === submittedBy;

    const existingAppraisal = await Appraisal.findOne({ targetUser, submittedBy });
    if (existingAppraisal) {
      return res.status(400).json({ message: 'You have already submitted an appraisal for this user' });
    }

    const appraisal = await Appraisal.create({
      targetUser,
      submittedBy,
      answers,
      isSelfAppraisal
    });

    const populatedAppraisal = await Appraisal.findById(appraisal._id)
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.status(201).json(populatedAppraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateAppraisal = async (req, res) => {
  try {
    const { answers } = req.body;

    const appraisal = await Appraisal.findById(req.params.id);

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    if (appraisal.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this appraisal' });
    }

    for (const answer of answers) {
      const question = await Question.findById(answer.question);
      if (!question) {
        return res.status(400).json({ message: `Question with ID ${answer.question} not found` });
      }
    }

    appraisal.answers = answers;
    const updatedAppraisal = await appraisal.save();

    const populatedAppraisal = await Appraisal.findById(updatedAppraisal._id)
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.json(populatedAppraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    await appraisal.remove();
    res.json({ message: 'Appraisal removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getManagerAppraisals = async (req, res) => {
  try {
    const managerId = req.params.id;
    const teamMembers = await User.find({ manager: managerId });
    const teamMemberIds = teamMembers.map(member => member._id);

    const appraisals = await Appraisal.find({
      $or: [
        { targetUser: { $in: teamMemberIds } },
        { targetUser: managerId },
        { submittedBy: managerId }
      ]
    })
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.json(appraisals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserAppraisals = async (req, res) => {
  try {
    const userId = req.params.id;

    const appraisals = await Appraisal.find({ submittedBy: userId })
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.json(appraisals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTargetUserAppraisals = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = req.user;

    let query = { targetUser: targetUserId };

    if (user.role === 'staff' && user._id.toString() !== targetUserId) {
      return res.status(403).json({ message: 'Not authorized to view these appraisals' });
    } else if (user.role === 'manager') {
      const isTeamMember = await User.findOne({
        _id: targetUserId,
        manager: user._id
      });

      if (!isTeamMember && user._id.toString() !== targetUserId) {
        return res.status(403).json({ message: 'Not authorized to view these appraisals' });
      }
    }

    const appraisals = await Appraisal.find(query)
      .populate('targetUser', 'name email')
      .populate('submittedBy', 'name email')
      .populate('answers.question', 'text');

    res.json(appraisals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
