import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { JoinRequest } from '../models/JoinRequest.js';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';

export const runSeed = async ({ force = false } = {}) => {
  const userCount = await User.countDocuments();
  if (userCount > 0 && !force) {
    console.log(`[Seed] Database already contains ${userCount} users. Skipping auto-seed.`);
    return;
  }

  if (force) {
    console.log('[Seed] Force clearing existing database collections...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await JoinRequest.deleteMany({});
    await Task.deleteMany({});
    await Notification.deleteMany({});
  }

  console.log('[Seed] Seeding realistic demo data for CrewUp...');

  const usersData = [
    {
      name: 'Alex Rivera',
      email: 'alex@student.edu',
      password: 'password123',
      college: 'Massachusetts Institute of Technology (MIT)',
      bio: 'Full-stack software developer passionate about building developer tools, real-time web applications, and intuitive UI designs.',
      skills: ['react', 'node.js', 'mongodb', 'express', 'tailwind css', 'typescript', 'docker'],
      interests: ['Web Development', 'Open Source', 'System Design'],
      githubUrl: 'https://github.com/alexrivera-demo',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@student.edu',
      password: 'password123',
      college: 'Stanford University',
      bio: 'AI/ML researcher and data scientist exploring computer vision, large language models, and agentic workflows.',
      skills: ['python', 'pytorch', 'tensorflow', 'fastapi', 'data science', 'machine learning', 'docker'],
      interests: ['Artificial Intelligence', 'Computer Vision', 'Deep Learning'],
      githubUrl: 'https://github.com/sarahchen-ai',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
    },
    {
      name: 'Marcus Johnson',
      email: 'marcus@student.edu',
      password: 'password123',
      college: 'UC Berkeley',
      bio: 'Mobile architect and cloud enthusiast. Building cross-platform experiences that delight users on both iOS and Android.',
      skills: ['react native', 'flutter', 'firebase', 'node.js', 'aws', 'kotlin', 'swift'],
      interests: ['Mobile Applications', 'Cloud Architecture', 'DevOps'],
      githubUrl: 'https://github.com/marcusj-mobile',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
    },
    {
      name: 'Elena Rostova',
      email: 'elena@student.edu',
      password: 'password123',
      college: 'Carnegie Mellon University',
      bio: 'Product designer and frontend engineer obsessed with design systems, fluid micro-interactions, and high-performance WebGL animations.',
      skills: ['react', 'figma', 'tailwind css', 'next.js', 'ui/ux', 'javascript', 'css'],
      interests: ['Design Systems', 'Frontend Performance', 'User Experience'],
      githubUrl: 'https://github.com/elenarostova-ux',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
    },
    {
      name: 'Devon Patel',
      email: 'devon@student.edu',
      password: 'password123',
      college: 'Georgia Tech',
      bio: 'Distributed systems & smart contracts engineer. Experienced with EVM, cryptography, and zero-knowledge proofs.',
      skills: ['solidity', 'ethereum', 'node.js', 'go', 'rust', 'web3', 'cryptography'],
      interests: ['Blockchain', 'Decentralized Identity', 'Security'],
      githubUrl: 'https://github.com/devonpatel-web3',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devon',
    },
  ];

  const users = [];
  for (const u of usersData) {
    const created = await User.create(u);
    users.push(created);
  }

  const [alex, sarah, marcus, elena, devon] = users;

  // Projects
  const project1 = await Project.create({
    title: 'CampusHub: Student Resource & Project Exchange',
    description: 'An all-in-one web portal where university students exchange textbook notes, rent campus equipment, and pitch hackathon project ideas with interactive live chat and review systems.',
    category: 'Web Development',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Socket.io'],
    requiredSkills: ['react', 'node.js', 'mongodb', 'tailwind css'],
    maxMembers: 4,
    owner: alex._id,
    status: 'Recruiting',
    githubRepo: 'https://github.com/alexrivera-demo/campushub',
    demoUrl: 'https://campushub-demo.vercel.app',
    members: [
      { user: alex._id, role: 'Owner', joinedAt: new Date(Date.now() - 7 * 86400000) },
      { user: elena._id, role: 'Member', joinedAt: new Date(Date.now() - 4 * 86400000) },
    ],
  });

  const project2 = await Project.create({
    title: 'MediScan: AI Dermatology Diagnostic Assistant',
    description: 'A deep learning computer vision assistant that analyzes skin lesion images to provide early-stage risk assessments and connects students with certified clinical guidance.',
    category: 'AI / Machine Learning',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'React', 'Tailwind CSS'],
    requiredSkills: ['python', 'pytorch', 'machine learning', 'fastapi', 'react'],
    maxMembers: 4,
    owner: sarah._id,
    status: 'Recruiting',
    githubRepo: 'https://github.com/sarahchen-ai/mediscan-core',
    demoUrl: '',
    members: [
      { user: sarah._id, role: 'Owner', joinedAt: new Date(Date.now() - 10 * 86400000) },
    ],
  });

  const project3 = await Project.create({
    title: 'EchoVerse: Spatial Audio Campus Radio & Podcasting',
    description: 'A mobile-first spatial audio platform for student-run podcasts, live lecture summaries, and ambient study rooms with WebRTC spatial sound rendering.',
    category: 'Mobile App',
    techStack: ['React Native', 'WebRTC', 'Node.js', 'Firebase', 'AWS S3'],
    requiredSkills: ['react native', 'firebase', 'node.js', 'mobile development'],
    maxMembers: 3,
    owner: marcus._id,
    status: 'Recruiting',
    githubRepo: 'https://github.com/marcusj-mobile/echoverse-app',
    members: [
      { user: marcus._id, role: 'Owner', joinedAt: new Date(Date.now() - 12 * 86400000) },
    ],
  });

  const project4 = await Project.create({
    title: 'DecentraCred: Verifiable Student Credentials on Ethereum',
    description: 'A decentralized protocol enabling university registrars to issue cryptographically verifiable tamper-proof certificates, micro-degrees, and badges directly on-chain.',
    category: 'Blockchain / Web3',
    techStack: ['Solidity', 'Ethereum', 'React', 'Node.js', 'Ethers.js', 'IPFS'],
    requiredSkills: ['solidity', 'ethereum', 'react', 'node.js', 'web3'],
    maxMembers: 3,
    owner: devon._id,
    status: 'In Progress',
    githubRepo: 'https://github.com/devonpatel-web3/decentracred-contracts',
    members: [
      { user: devon._id, role: 'Owner', joinedAt: new Date(Date.now() - 15 * 86400000) },
      { user: alex._id, role: 'Member', joinedAt: new Date(Date.now() - 8 * 86400000) },
    ],
  });

  const project5 = await Project.create({
    title: 'GreenTrack: IoT Smart Campus Energy Optimizer',
    description: 'Network of ESP32 environmental sensors tracking classroom occupancy and HVAC energy consumption with automated peak-load shaving dashboards.',
    category: 'IoT / Robotics',
    techStack: ['Python', 'MQTT', 'Docker', 'React', 'Tailwind CSS', 'InfluxDB'],
    requiredSkills: ['python', 'docker', 'react', 'iot', 'mqtt'],
    maxMembers: 5,
    owner: marcus._id,
    status: 'Recruiting',
    members: [
      { user: marcus._id, role: 'Owner', joinedAt: new Date(Date.now() - 5 * 86400000) },
    ],
  });

  // Requests
  await JoinRequest.create({
    project: project1._id,
    applicant: sarah._id,
    message: 'Hi Alex! I would love to build an automated recommendation engine for textbook swapping on CampusHub using Python and FastAPI microservices.',
    status: 'pending',
  });

  await JoinRequest.create({
    project: project1._id,
    applicant: marcus._id,
    message: 'Hey Alex, I can help build the native companion app for CampusHub using React Native and push notifications.',
    status: 'pending',
  });

  await JoinRequest.create({
    project: project1._id,
    applicant: elena._id,
    message: 'Excited to design the component library and modern user experience in Tailwind CSS.',
    status: 'accepted',
  });

  await JoinRequest.create({
    project: project4._id,
    applicant: alex._id,
    message: 'Happy to build the frontend portal connecting MetaMask with your Solidity smart contracts.',
    status: 'accepted',
  });

  // Tasks
  await Task.create([
    {
      project: project1._id,
      title: 'Design high-fidelity Figma mockups for marketplace card feed',
      description: 'Create responsive UI components for the item card, filter sidebar, and bottom navigation sheet.',
      assignedTo: elena._id,
      status: 'done',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 86400000),
      createdBy: alex._id,
    },
    {
      project: project1._id,
      title: 'Implement MongoDB indexing and search aggregation pipeline',
      description: 'Ensure compound text queries on title, tags, and category run under 20ms.',
      assignedTo: alex._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 4 * 86400000),
      createdBy: alex._id,
    },
    {
      project: project1._id,
      title: 'Integrate live WebSockets for instant peer messaging',
      description: 'Add Socket.io connection for buyer-seller real-time negotiations.',
      assignedTo: alex._id,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 86400000),
      createdBy: alex._id,
    },
    {
      project: project1._id,
      title: 'Set up automated GitHub Actions CI/CD pipeline',
      description: 'Linting, unit tests, and automated Docker staging build on pull requests.',
      assignedTo: null,
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 10 * 86400000),
      createdBy: alex._id,
    },
    {
      project: project4._id,
      title: 'Deploy ERC-721 credential verification smart contract on Sepolia testnet',
      description: 'Audit gas consumption and write hardhat test suite.',
      assignedTo: devon._id,
      status: 'done',
      priority: 'high',
      dueDate: new Date(Date.now() - 1 * 86400000),
      createdBy: devon._id,
    },
    {
      project: project4._id,
      title: 'Connect wagmi / ethers.js wallet connection modal in React',
      description: 'Support MetaMask, Coinbase Wallet, and WalletConnect v2.',
      assignedTo: alex._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 86400000),
      createdBy: devon._id,
    },
  ]);

  // Notifications
  await Notification.create([
    {
      recipient: alex._id,
      sender: sarah._id,
      project: project1._id,
      type: 'application_received',
      title: 'New Team Application',
      message: 'Sarah Chen applied to join your project "CampusHub: Student Resource & Project Exchange"',
      link: `/projects/${project1._id}`,
      read: false,
    },
    {
      recipient: alex._id,
      sender: marcus._id,
      project: project1._id,
      type: 'application_received',
      title: 'New Team Application',
      message: 'Marcus Johnson applied to join your project "CampusHub: Student Resource & Project Exchange"',
      link: `/projects/${project1._id}`,
      read: false,
    },
    {
      recipient: alex._id,
      sender: devon._id,
      project: project4._id,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'Devon Patel assigned you the task: "Connect wagmi / ethers.js wallet connection modal in React"',
      link: `/workspace/${project4._id}`,
      read: true,
    },
    {
      recipient: elena._id,
      sender: alex._id,
      project: project1._id,
      type: 'application_accepted',
      title: 'Application Accepted! 🎉',
      message: 'Congratulations! Your request to join "CampusHub: Student Resource & Project Exchange" has been accepted.',
      link: `/workspace/${project1._id}`,
      read: true,
    },
  ]);

  console.log('[Seed] Database populated with demo data.');
};
