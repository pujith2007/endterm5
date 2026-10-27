/**
 * Smart Skill Matching Engine
 * Compares a user's skills against a project's required skills.
 * Handles normalization, aliases (e.g. node / node.js, react / react.js),
 * and calculates exact compatibility percentage, matching skills, and missing skills.
 */

// Common tech aliases mapping
const TECH_ALIASES = {
  'react': 'react',
  'react.js': 'react',
  'reactjs': 'react',
  'node': 'nodejs',
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'express': 'express',
  'express.js': 'express',
  'expressjs': 'express',
  'js': 'javascript',
  'javascript': 'javascript',
  'ts': 'typescript',
  'typescript': 'typescript',
  'py': 'python',
  'python': 'python',
  'vue': 'vue',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'next': 'nextjs',
  'next.js': 'nextjs',
  'nextjs': 'nextjs',
  'tailwind': 'tailwind',
  'tailwindcss': 'tailwind',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'docker': 'docker',
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',
};

export const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  return TECH_ALIASES[cleaned] || cleaned;
};

/**
 * Calculates skill compatibility between user's skills and project's required skills.
 * @param {Array<string>} userSkills
 * @param {Array<string>} requiredSkills
 * @returns {{ matchPercentage: number, matchingSkills: string[], missingSkills: string[] }}
 */
export const calculateSkillMatch = (userSkills = [], requiredSkills = []) => {
  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchingSkills: [],
      missingSkills: [],
    };
  }

  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchingSkills: [],
      missingSkills: [...requiredSkills],
    };
  }

  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill));

  const matchingSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    const norm = normalizeSkill(skill);
    if (normalizedUserSkills.has(norm)) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchPercentage = Math.round(
    (matchingSkills.length / requiredSkills.length) * 100
  );

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
  };
};

/**
 * Enhances a project or list of projects with user-specific compatibility data
 * @param {Object|Array} projects
 * @param {Object} user
 */
export const attachSkillMatchToProjects = (projects, user) => {
  const userSkills = user && user.skills ? user.skills : [];

  if (Array.isArray(projects)) {
    return projects.map((p) => {
      const projObj = p.toObject ? p.toObject() : { ...p };
      const match = calculateSkillMatch(userSkills, projObj.requiredSkills || []);
      return {
        ...projObj,
        compatibility: match.matchPercentage,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
      };
    });
  } else if (projects) {
    const projObj = projects.toObject ? projects.toObject() : { ...projects };
    const match = calculateSkillMatch(userSkills, projObj.requiredSkills || []);
    return {
      ...projObj,
      compatibility: match.matchPercentage,
      matchingSkills: match.matchingSkills,
      missingSkills: match.missingSkills,
    };
  }
  return projects;
};
