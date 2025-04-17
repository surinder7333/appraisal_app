import Question from '../models/Question.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const createQuestion = async (req, res) => {
  try {
    const { text } = req.body;

    const question = await Question.create({
      text
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { text, isActive } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.text = text || question.text;

    if (isActive !== undefined) {
      question.isActive = isActive;
    }

    const updatedQuestion = await question.save();

    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isActive = false;
    await question.save();

    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
