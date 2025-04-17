import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const QuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Question', QuestionSchema);
