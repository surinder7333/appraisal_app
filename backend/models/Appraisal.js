import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const AnswerSchema = new Schema({
  question: {
    type: Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const AppraisalSchema = new Schema({
  targetUser: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [AnswerSchema],
  isSelfAppraisal: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

AppraisalSchema.pre('save', function(next) {
  if (this.targetUser.toString() === this.submittedBy.toString()) {
    this.isSelfAppraisal = true;
  }
  next();
});

export default model('Appraisal', AppraisalSchema);
