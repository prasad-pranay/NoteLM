import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'My Workspace',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Notebook = mongoose.model('Notebook', notebookSchema);
export default Notebook;
