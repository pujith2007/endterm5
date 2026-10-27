import mongoose from 'mongoose';

const memberSubSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Owner', 'Member'],
      default: 'Member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile App',
        'AI / Machine Learning',
        'Data Science',
        'Blockchain / Web3',
        'IoT / Robotics',
        'Game Development',
        'Cloud & DevOps',
        'Cybersecurity',
        'Open Source',
        'Other',
      ],
      default: 'Web Development',
    },
    techStack: {
      type: [String],
      default: [],
      set: (items) =>
        Array.isArray(items)
          ? items.map((t) => t.trim()).filter(Boolean)
          : [],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill must be specified'],
      set: (skills) =>
        Array.isArray(skills)
          ? skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
          : [],
      validate: [
        (val) => val.length > 0,
        'Please specify at least one required skill',
      ],
    },
    maxMembers: {
      type: Number,
      required: true,
      min: [2, 'Maximum team members must be at least 2'],
      max: [12, 'Maximum team members cannot exceed 12'],
      default: 4,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: {
      type: [memberSubSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['Recruiting', 'In Progress', 'Completed'],
      default: 'Recruiting',
      index: true,
    },
    githubRepo: {
      type: String,
      trim: true,
      default: '',
    },
    demoUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for current member count
projectSchema.virtual('currentMemberCount').get(function () {
  return this.members ? this.members.length : 0;
});

// Virtual for isFull
projectSchema.virtual('isFull').get(function () {
  return (this.members ? this.members.length : 0) >= this.maxMembers;
});

// Compound indexes for fast searching & filtering
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, status: 1 });

export const Project = mongoose.model('Project', projectSchema);
