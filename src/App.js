import React, { useState, useEffect } from 'react';

const ModuleSimulator = () => {
  // User input states
  const [learningGoal, setLearningGoal] = useState('explore');
  const [learningPreferences, setLearningPreferences] = useState([]);
  const [role, setRole] = useState('individual-contributor');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  
  // Modifier weight adjustment states (actual integer values)
  const [goalModifierMultiplier, setGoalModifierMultiplier] = useState(1);
  const [roleModifierValue, setRoleModifierValue] = useState(20); // Default +20 from docs
  const [skillLevelModifierValue, setSkillLevelModifierValue] = useState(15); // Default +15 from docs
  const [preferenceModifierValue, setPreferenceModifierValue] = useState(10); // Default +10 from docs
  
  // Threshold adjustment states (normalized weight boundaries 0-100)
  const [expandedThreshold, setExpandedThreshold] = useState(80); // Default 80 from docs
  const [standardThreshold, setStandardThreshold] = useState(50); // Default 50 from docs
  
  // UI state for collapsible sections
  const [isModifierSectionExpanded, setIsModifierSectionExpanded] = useState(false);

  // Module weight and state calculation
  const [moduleStates, setModuleStates] = useState({});
  
  // Base weight matrix from documentation
  const baseWeights = {
    'explore': {
      'guided-learning': 80,
      'browse-by-modality': 100,
      'content-experiments': 90,
      'answers': 40,
      'dig-deeper': 60
    },
    'level-up': {
      'guided-learning': 100,
      'browse-by-modality': 80,
      'content-experiments': 60,
      'answers': 40,
      'dig-deeper': 60
    },
    'certification': {
      'guided-learning': 100,
      'browse-by-modality': 60,
      'content-experiments': 40,
      'answers': 40,
      'dig-deeper': 80
    },
    'problem-solving': {
      'guided-learning': 40,
      'browse-by-modality': 60,
      'content-experiments': 70,
      'answers': 100,
      'dig-deeper': 60
    }
  };

  // Role modifiers - Using the adjusted value from controls
  const getRoleModifier = (roleType, moduleId) => {
    if (roleType === 'leadership' && moduleId === 'dig-deeper') return roleModifierValue;
    if (roleType === 'individual-contributor' && moduleId === 'browse-by-modality') return roleModifierValue;
    if (roleType === 'entry-level' && moduleId === 'guided-learning') return roleModifierValue;
    if (roleType === 'researcher' && moduleId === 'dig-deeper') return roleModifierValue;
    return 0;
  };

  // Skill level modifiers - Using the adjusted value from controls
  const getSkillLevelModifier = (level, moduleId) => {
    if (level === 'beginner' && moduleId === 'guided-learning') return skillLevelModifierValue;
    if (level === 'advanced' && moduleId === 'dig-deeper') return skillLevelModifierValue;
    return 0;
  };

  // Learning preference modifiers - Using the adjusted value from controls
  const getPreferenceModifier = (preference, moduleId) => {
    if (preference === 'read' && moduleId === 'dig-deeper') return preferenceModifierValue;
    if (preference === 'watch' && moduleId === 'guided-learning') return preferenceModifierValue;
    if (preference === 'do' && moduleId === 'browse-by-modality') return preferenceModifierValue;
    return 0;
  };

  // Module desrcriptions for display
  const moduleMetadata = {
    'guided-learning': {
      title: 'Guided Learning',
      description: 'Structured content with learning paths',
      icon: '📚'
    },
    'browse-by-modality': {
      title: 'Browse by Modality',
      description: 'Discover content by format type',
      icon: '🔍'
    },
    'content-experiments': {
      title: 'Content Experiments',
      description: 'Innovative formats and trending content',
      icon: '🧪'
    },
    'answers': {
      title: 'Answers',
      description: 'Solutions to specific problems',
      icon: '💡'
    },
    'dig-deeper': {
      title: 'Dig Deeper',
      description: 'Advanced content for in-depth learning',
      icon: '🔎'
    }
  };

  // Mock content examples for learning goal and preference
  const contentExamples = {
    'guided-learning': {
      'explore': {
        'read': ['Expert Playlist: Introduction to Data Science', 'Learning Path: Frontend Development Fundamentals'],
        'watch': ['Course: Python Programming Essentials', 'Live Course: Cloud Architecture Basics'],
        'do': ['Interactive Course: JavaScript Fundamentals', 'Lab: Building Your First API'],
        'no-preference': ['Expert Playlist: Introduction to Data Science', 'Course: Python Programming Essentials']
      },
      'level-up': {
        'read': ['Expert Playlist: Advanced React Patterns', 'Learning Path: Machine Learning Engineering'],
        'watch': ['Course: Microservice Architecture Deep Dive', 'Live Course: Advanced Data Modeling'],
        'do': ['Interactive Course: Advanced React with Hooks', 'Lab: Building Scalable Applications'],
        'no-preference': ['Expert Playlist: Advanced React Patterns', 'Course: Microservice Architecture Deep Dive']
      },
      'certification': {
        'read': ['Certification Guide: AWS Solutions Architect', 'Expert Playlist: CompTIA Security+'],
        'watch': ['Course: Azure Administrator Certification Prep', 'Live Course: Google Cloud Professional Exam Prep'],
        'do': ['Practice Exam: AWS Solutions Architect', 'Interactive Labs: Kubernetes Certification Prep'],
        'no-preference': ['Certification Guide: AWS Solutions Architect', 'Course: Azure Administrator Certification Prep']
      },
      'problem-solving': {
        'read': ['Expert Playlist: Debugging React Applications', 'Guide: Optimizing Database Performance'],
        'watch': ['Course: Troubleshooting Network Issues', 'Live Course: Debug Like a Pro'],
        'do': ['Interactive Course: Fixing Common Python Errors', 'Sandbox: Troubleshooting CI/CD Pipelines'],
        'no-preference': ['Expert Playlist: Debugging React Applications', 'Course: Troubleshooting Network Issues']
      }
    },
    'browse-by-modality': {
      // Content examples for each tab (Books, Courses, Interactive, etc.)
      'explore': {
        'read': ['Book: The Pragmatic Programmer', 'Article: Web Development Trends 2025'],
        'watch': ['Course: Introduction to TypeScript', 'Video Short: Understanding Containers'],
        'do': ['Lab: Build a React App', 'Sandbox: Python Data Analysis'],
        'no-preference': ['Book: The Pragmatic Programmer', 'Course: Introduction to TypeScript']
      },
      'level-up': {
        'read': ['Book: Designing Data-Intensive Applications', 'Article: Advanced CSS Techniques'],
        'watch': ['Course: Advanced Node.js', 'Video Short: System Design Patterns'],
        'do': ['Lab: Advanced Machine Learning Projects', 'Sandbox: Full-Stack Application Development'],
        'no-preference': ['Book: Designing Data-Intensive Applications', 'Course: Advanced Node.js']
      },
      'certification': {
        'read': ['Book: CompTIA Network+ Certification Guide', 'Article: Exam Preparation Strategies'],
        'watch': ['Course: AWS Certified Developer', 'Video Short: Certification Tips and Tricks'],
        'do': ['Lab: Kubernetes Certification Practice', 'Sandbox: Cloud Architecture Practical Exercises'],
        'no-preference': ['Book: CompTIA Network+ Certification Guide', 'Course: AWS Certified Developer']
      },
      'problem-solving': {
        'read': ['Book: Effective Debugging', 'Article: Common Performance Bottlenecks'],
        'watch': ['Course: Debugging JavaScript Applications', 'Video Short: Quick Fixes for Common Errors'],
        'do': ['Lab: Troubleshooting Microservices', 'Sandbox: Performance Testing Environment'],
        'no-preference': ['Book: Effective Debugging', 'Course: Debugging JavaScript Applications']
      }
    },
    // Additional content examples for other modules would follow the same pattern
  };

  // Calculate module weights and states
  useEffect(() => {
    // Get base weights for selected learning goal
    const baseWeightsForGoal = baseWeights[learningGoal];
    
    // Apply modifiers
    const finalWeights = {};
    const modules = Object.keys(baseWeightsForGoal);
    
    modules.forEach(module => {
      // Base weight is multiplied by the goal modifier multiplier
      let weight = baseWeightsForGoal[module] * goalModifierMultiplier;
      
      // Add role modifier if applicable (using the adjusted value)
      const roleModifierForModule = getRoleModifier(role, module);
      if (roleModifierForModule > 0) {
        weight += roleModifierForModule;
      }
      
      // Add skill level modifier if applicable (using the adjusted value)
      const skillModifierForModule = getSkillLevelModifier(skillLevel, module);
      if (skillModifierForModule > 0) {
        weight += skillModifierForModule;
      }
      
      // Add learning preference modifiers if applicable (using the adjusted value)
      // Apply modifiers for each selected preference
      if (learningPreferences.length > 0) {
        learningPreferences.forEach(preference => {
          const prefModifierForModule = getPreferenceModifier(preference, module);
          if (prefModifierForModule > 0) {
            weight += prefModifierForModule;
          }
        });
      }
      
      finalWeights[module] = weight;
    });
    
    // Normalize weights
    const maxWeight = Math.max(...Object.values(finalWeights));
    const normalizedWeights = {};
    
    modules.forEach(module => {
      normalizedWeights[module] = Math.round((finalWeights[module] / maxWeight) * 100);
    });
    
    // Determine states
    const states = {};
    modules.forEach(module => {
      if (normalizedWeights[module] >= expandedThreshold) {
        states[module] = 'expanded';
      } else if (normalizedWeights[module] >= standardThreshold) {
        states[module] = 'standard';
      } else {
        states[module] = 'collapsed';
      }
    });
    
    // Ensure at least one module is expanded
    if (!Object.values(states).includes('expanded')) {
      const highestModule = modules.reduce((a, b) => 
        normalizedWeights[a] > normalizedWeights[b] ? a : b);
      states[highestModule] = 'expanded';
    }
    
    // Ensure at least one module is standard
    if (!Object.values(states).includes('standard')) {
      const modulesByWeight = [...modules].sort((a, b) => 
        normalizedWeights[b] - normalizedWeights[a]);
      
      // Select the second highest module if it's not already expanded
      const candidateForStandard = modulesByWeight.find(module => 
        states[module] !== 'expanded');
      
      if (candidateForStandard) {
        states[candidateForStandard] = 'standard';
      }
    }
    
    // Set module states with weights for display
    setModuleStates(
      Object.keys(states).reduce((acc, module) => {
        acc[module] = {
          state: states[module],
          weight: normalizedWeights[module]
        };
        return acc;
      }, {})
    );
  }, [learningGoal, role, skillLevel, learningPreferences, 
     goalModifierMultiplier, roleModifierValue, skillLevelModifierValue, preferenceModifierValue, expandedThreshold, standardThreshold]);

  // Get content examples for a specific module based on current user inputs
  const getContentExamplesForModule = (module) => {
    if (!contentExamples[module]) return ['Content example 1', 'Content example 2'];
    
    const goalExamples = contentExamples[module][learningGoal] || contentExamples[module]['explore'];
    
    // If multiple preferences are selected, prioritize them in this order: do, watch, read
    if (learningPreferences.length > 0) {
      if (learningPreferences.includes('do') && goalExamples['do']) {
        return goalExamples['do'];
      } else if (learningPreferences.includes('watch') && goalExamples['watch']) {
        return goalExamples['watch'];
      } else if (learningPreferences.includes('read') && goalExamples['read']) {
        return goalExamples['read'];
      }
    }
    
    return goalExamples['no-preference'];
  };

  // Render popularity sorting parameter based on learning goal
  const renderSortingParameter = () => {
    switch(learningGoal) {
      case 'explore':
        return 'users + usage (Equal Weight) - "Most Popular"';
      case 'level-up':
        return 'avg_usage → users - "Top Engagement"';
      case 'certification':
        return 'avg_usage → usage - "Proven Resources"';
      case 'problem-solving':
        return 'users → avg_usage - "Most Used"';
      default:
        return 'users + usage (Equal Weight)';
    }
  };

  // Render a module based on its calculated state
  const renderModule = (moduleId) => {
    if (!moduleStates[moduleId]) return null;
    
    const { state, weight } = moduleStates[moduleId];
    const { title, description, icon } = moduleMetadata[moduleId];
    const contentExamplesList = getContentExamplesForModule(moduleId);
    
    // Different rendering based on state
    switch(state) {
      case 'expanded':
        return (
          <div className="border border-blue-400 bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{icon}</span>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                {weight}% - Expanded
              </div>
            </div>
            <p className="mb-3">{description}</p>
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-semibold mb-2">Content Examples:</h4>
              <ul className="pl-5 list-disc">
                {contentExamplesList.map((item, idx) => (
                  <li key={idx} className="mb-1">{item}</li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Content sorted by: {renderSortingParameter()}
                </span>
              </div>
            </div>
          </div>
        );
        
      case 'standard':
        return (
          <div className="border border-gray-300 bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-xl mr-2">{icon}</span>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <div className="bg-gray-600 text-white px-2 py-0.5 rounded text-sm">
                {weight}% - Standard
              </div>
            </div>
            <p className="text-sm mb-2">{description}</p>
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {contentExamplesList.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 border rounded p-2 w-48">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'collapsed':
        return (
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-2 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-1">{icon}</span>
                <h3 className="font-medium">{title}</h3>
              </div>
              <div className="bg-gray-400 text-white px-2 py-0.5 rounded text-xs">
                {weight}% - Collapsed
              </div>
            </div>
            <div className="text-xs text-gray-500 truncate mt-1">
              {contentExamplesList[0]}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Determine the sort order for modules based on weights
  const getSortedModules = () => {
    return Object.keys(moduleStates).sort((a, b) => 
      moduleStates[b].weight - moduleStates[a].weight
    );
  };

  return (
    <div className="font-sans max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Content Module Presentation Simulator</h1>
        
        {/* User inputs section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium mb-1">Learning Goal</label>
            <select 
              className="w-full rounded border border-gray-300 p-2" 
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
            >
              <option value="explore">Explore & Discover</option>
              <option value="level-up">Level Up Skills</option>
              <option value="certification">Prepare for Certification</option>
              <option value="problem-solving">Solve a Problem</option>
            </select>
          </div>
          
          <div className="learn-pref">
            <label className="block text-sm font-medium mb-1">Learning Preferences (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600" 
                  checked={learningPreferences.includes('read')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLearningPreferences([...learningPreferences, 'read']);
                    } else {
                      setLearningPreferences(learningPreferences.filter(p => p !== 'read'));
                    }
                  }}
                />
                <span className="ml-2">Reading</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600" 
                  checked={learningPreferences.includes('watch')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLearningPreferences([...learningPreferences, 'watch']);
                    } else {
                      setLearningPreferences(learningPreferences.filter(p => p !== 'watch'));
                    }
                  }}
                />
                <span className="ml-2">Watching</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600" 
                  checked={learningPreferences.includes('do')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLearningPreferences([...learningPreferences, 'do']);
                    } else {
                      setLearningPreferences(learningPreferences.filter(p => p !== 'do'));
                    }
                  }}
                />
                <span className="ml-2">Doing/Interactive</span>
              </label>
              
              <div className="w-full mt-1 text-xs text-gray-500">
                {learningPreferences.length === 0 ? "No preferences selected (default mix will be used)" : ""}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              className="w-full rounded border border-gray-300 p-2" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="individual-contributor">Individual Contributor</option>
              <option value="leadership">Leadership/Management</option>
              <option value="entry-level">Entry Level/Student</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Skill Level</label>
            <select 
              className="w-full rounded border border-gray-300 p-2" 
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        {/* Modifier weight adjustments - now collapsible */}
        <div className="mb-8 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <button 
            className="w-full p-3 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsModifierSectionExpanded(!isModifierSectionExpanded)}
          >
            <h3 className="font-semibold">Modifier Value Adjustments</h3>
            <span>{isModifierSectionExpanded ? '▲' : '▼'}</span>
          </button>
          
          {isModifierSectionExpanded && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Base Weight Multiplier: ×{goalModifierMultiplier.toFixed(1)}
                  </label>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-l"
                      onClick={() => setGoalModifierMultiplier(Math.max(0.5, goalModifierMultiplier - 0.1))}
                    >−</button>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.1"
                      value={goalModifierMultiplier} 
                      onChange={(e) => setGoalModifierMultiplier(parseFloat(e.target.value))}
                      className="flex-grow mx-2" 
                    />
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-r"
                      onClick={() => setGoalModifierMultiplier(Math.min(1.5, goalModifierMultiplier + 0.1))}
                    >+</button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Multiplies the base weights from learning goal matrix
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role Modifier: +{roleModifierValue}
                  </label>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-l"
                      onClick={() => setRoleModifierValue(Math.max(0, roleModifierValue - 5))}
                    >−</button>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      step="5"
                      value={roleModifierValue} 
                      onChange={(e) => setRoleModifierValue(parseInt(e.target.value))}
                      className="flex-grow mx-2" 
                    />
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-r"
                      onClick={() => setRoleModifierValue(Math.min(40, roleModifierValue + 5))}
                    >+</button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Points added to modules based on user role (default: +20)
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skill Level Modifier: +{skillLevelModifierValue}
                  </label>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-l"
                      onClick={() => setSkillLevelModifierValue(Math.max(0, skillLevelModifierValue - 5))}
                    >−</button>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      step="5"
                      value={skillLevelModifierValue} 
                      onChange={(e) => setSkillLevelModifierValue(parseInt(e.target.value))}
                      className="flex-grow mx-2" 
                    />
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-r"
                      onClick={() => setSkillLevelModifierValue(Math.min(30, skillLevelModifierValue + 5))}
                    >+</button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Points added to modules based on skill level (default: +15)
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preference Modifier: +{preferenceModifierValue}
                  </label>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-l"
                      onClick={() => setPreferenceModifierValue(Math.max(0, preferenceModifierValue - 5))}
                    >−</button>
                    <input 
                      type="range" 
                      min="0" 
                      max="25" 
                      step="5"
                      value={preferenceModifierValue} 
                      onChange={(e) => setPreferenceModifierValue(parseInt(e.target.value))}
                      className="flex-grow mx-2" 
                    />
                    <button 
                      className="bg-gray-200 px-3 py-1 rounded-r"
                      onClick={() => setPreferenceModifierValue(Math.min(25, preferenceModifierValue + 5))}
                    >+</button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Points added to modules based on learning preferences (default: +10)
                  </div>
                </div>
              </div>
              
           <div className="border-t border-gray-200 pt-4">
             <h4 className="font-medium mb-3">Module State Thresholds</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium mb-1">
                   Expanded Threshold: ≥{expandedThreshold}%
                 </label>
                 <div className="flex items-center">
                   <button 
                     className="bg-gray-200 px-3 py-1 rounded-l"
                     onClick={() => {
                       const newValue = Math.max(standardThreshold + 5, expandedThreshold - 5);
                       setExpandedThreshold(newValue);
                     }}
                   >−</button>
                   <input 
                     type="range" 
                     min={standardThreshold + 5} 
                     max="95" 
                     step="5"
                     value={expandedThreshold} 
                     onChange={(e) => setExpandedThreshold(parseInt(e.target.value))}
                     className="flex-grow mx-2" 
                   />
                   <button 
                     className="bg-gray-200 px-3 py-1 rounded-r"
                     onClick={() => setExpandedThreshold(Math.min(95, expandedThreshold + 5))}
                   >+</button>
                 </div>
                 <div className="text-xs text-gray-500 mt-1">
                   Score threshold for Expanded state (default: 80%)
                 </div>
               </div>
                
               <div>
                 <label className="block text-sm font-medium mb-1">
                   Standard Threshold: ≥{standardThreshold}%
                 </label>
                 <div className="flex items-center">
                   <button 
                     className="bg-gray-200 px-3 py-1 rounded-l"
                     onClick={() => setStandardThreshold(Math.max(5, standardThreshold - 5))}
                   >−</button>
                   <input 
                     type="range" 
                     min="5" 
                     max={expandedThreshold - 5} 
                     step="5"
                     value={standardThreshold} 
                     onChange={(e) => setStandardThreshold(parseInt(e.target.value))}
                     className="flex-grow mx-2" 
                   />
                   <button 
                     className="bg-gray-200 px-3 py-1 rounded-r"
                     onClick={() => {
                       const newValue = Math.min(expandedThreshold - 5, standardThreshold + 5);
                       setStandardThreshold(newValue);
                     }}
                   >+</button>
                 </div>
                 <div className="text-xs text-gray-500 mt-1">
                   Score threshold for Standard state (default: 50%)
                 </div>
               </div>
             </div>
              
             <div className="mt-3 bg-blue-50 p-3 rounded border border-blue-200 text-sm">
               <p className="mb-1 font-medium">Current State Ranges:</p>
               <ul className="pl-5 list-disc text-sm">
                 <li>Expanded: ≥{expandedThreshold}% score</li>
                 <li>Standard: {standardThreshold}% - {expandedThreshold-1}% score</li>
                 <li>Collapsed: &lt;{standardThreshold}% score</li>
               </ul>
             </div>
           </div>
         </div>
          )}
        </div>
        
        {/* Explanation of current configuration */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <h3 className="font-semibold mb-1">Current Configuration</h3>
          <p className="text-sm mb-2">
            Based on your inputs, content is filtered by role/skills and sorted using 
            <strong> {renderSortingParameter()}</strong>
          </p>
          <div className="text-sm text-gray-700">
            <strong>Learning Goal Effect:</strong> Determines module order and content prioritization<br />
            <strong>Learning Preferences Effect:</strong> {learningPreferences.length > 0 ? 
              `Filters content by selected formats: ${learningPreferences.join(', ')}` : 
              "No preferences selected (default mix will be used)"}<br />
            <strong>Role Effect:</strong> Applies weight modifiers to certain modules<br />
            <strong>Skill Level Effect:</strong> Adjusts content depth and module prominence
          </div>
        </div>
        
        {/* Modules visualization */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Resulting Module Presentation</h2>
          <div className="module-visualization">
            {getSortedModules().map(moduleId => renderModule(moduleId))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSimulator;