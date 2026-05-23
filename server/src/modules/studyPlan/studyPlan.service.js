import { StudyPlan } from './studyPlan.model.js';
import { StudyTask } from './studyTask.model.js';
import { createOpenAIClient } from '../aiTutor/openai.client.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';

const client = createOpenAIClient();

export async function getActiveStudyPlan(userId) {
  let plan = await StudyPlan.findOne({ user: userId, status: 'active' });
  if (!plan) {
    return null;
  }

  const tasks = await StudyTask.find({ user: userId, studyPlan: plan._id }).sort({ date: 1, createdAt: 1 });
  return { plan, tasks };
}

export async function generateStudyPlan(userId, payload) {
  const { examTarget, examDate, dailyHours, strongSubjects, weakSubjects, prepLevel, language } = payload;

  // Deactivate any existing active plans
  await StudyPlan.updateMany({ user: userId, status: 'active' }, { status: 'archived' });

  let weeklyPlan = [];
  let timetable = {};
  let monthlyRevisionPlan = '';
  let mockTestSchedule = '';

  const aiInstructions = `
    You are an expert Indian Railways Exam Prep Learning Scientist.
    Create a highly personalized Study Plan for a candidate with the following profile:
    - Target Exam: ${examTarget}
    - Exam Date: ${examDate}
    - Daily Study Hours: ${dailyHours} hours
    - Strong Subjects: ${strongSubjects.join(', ')}
    - Weak Subjects: ${weakSubjects.join(', ')}
    - Prep Level: ${prepLevel}
    - Language: ${language}

    Format your output strictly as a JSON object with this shape:
    {
      "weeklyPlan": [
        {
          "week": "Week 1: Quantitative Aptitude Foundations",
          "stationName": "Aptitude Junction (APT)",
          "topics": ["Simplification", "Percentage", "Profit & Loss"],
          "progress": 0,
          "status": "In Progress",
          "haltTime": "6 hrs halt time",
          "haltColor": "text-emerald-500"
        }
      ],
      "timetable": {
        "Monday": "2 hrs Maths, 1 hr General Science",
        "Tuesday": "2 hrs Reasoning, 1 hr GK",
        "Wednesday": "2 hrs Maths, 1 hr Current Affairs",
        "Thursday": "2 hrs Reasoning, 1 hr Science",
        "Friday": "2 hrs Maths, 1 hr GK",
        "Saturday": "3 hrs Revision, 1 hr Current Affairs",
        "Sunday": "3 hrs Mock Test & detailed analysis"
      },
      "monthlyRevisionPlan": "Weekly revision sessions on Saturdays. Space repetition intervals set for every 7 days.",
      "mockTestSchedule": "Take 1 Full-Length Mock Test every Sunday. In the last 30 days before exam, switch to 3 mocks per week."
    }
  `;

  let responseText = '';
  if (client) {
    try {
      const response = await client.responses.create({
        model: env.OPENAI_TUTOR_MODEL,
        instructions: 'You are an EdTech expert planner. Generate structural study plans strictly in JSON format.',
        input: [
          {
            role: 'user',
            content: aiInstructions,
          },
        ],
      });
      responseText = response.output_text;
    } catch (_error) {
      responseText = '';
    }
  }

  // Fallback to beautiful default mock plan if AI client fails or is omitted
  if (!responseText) {
    weeklyPlan = [
      {
        week: 'Week 1: Quantitative Aptitude Foundations',
        stationName: 'Aptitude Junction (APT)',
        topics: ['Simplification & Approximation', 'Percentage & Ratio Proportion', 'Profit & Loss', 'Simple & Compound Interest'],
        progress: 0,
        status: 'In Progress',
        haltTime: 'Current Halt - Train Arrived',
        haltColor: 'text-amber-500 font-extrabold animate-pulse',
      },
      {
        week: 'Week 2: Logical & Analytical Reasoning',
        stationName: 'Reasoning Central (RSN)',
        topics: ['Coding-Decoding & Analogy', 'Blood Relations & Syllogism', 'Puzzles & Seating Arrangement', 'Non-Verbal Reasoning'],
        progress: 0,
        status: 'Upcoming',
        haltTime: 'Scheduled Stop (5 hrs)',
        haltColor: 'text-slate-400',
      },
      {
        week: 'Week 3: General Science & Current Affairs',
        stationName: 'Science Terminal (SCI)',
        topics: ['Physics & Chemistry Concepts', 'Life Sciences Basics', 'Railway History & Budget Notes', 'National & International News'],
        progress: 0,
        status: 'Upcoming',
        haltTime: 'Scheduled Stop (4 hrs)',
        haltColor: 'text-slate-400',
      },
      {
        week: 'Week 4: Revision & Full Mock Drills',
        stationName: 'Mock Junction & Revision Depot',
        topics: ['Previous Years Question Analysis', 'Formula Sheet Revision', '10 Full-Length Mock Exams', 'Time Management Strategy'],
        progress: 0,
        status: 'Upcoming',
        haltTime: 'Final Terminal Destination',
        haltColor: 'text-slate-400',
      },
    ];

    timetable = {
      Monday: `${Math.ceil(dailyHours * 0.6)} hrs Arithmetic, ${Math.floor(dailyHours * 0.4)} hr General Science`,
      Tuesday: `${Math.ceil(dailyHours * 0.6)} hrs Logical Reasoning, ${Math.floor(dailyHours * 0.4)} hr GK Notes`,
      Wednesday: `${Math.ceil(dailyHours * 0.6)} hrs Algebra & Speed Maths, ${Math.floor(dailyHours * 0.4)} hr Science Lab`,
      Thursday: `${Math.ceil(dailyHours * 0.6)} hrs Analytical Reasoning, ${Math.floor(dailyHours * 0.4)} hr General Awareness`,
      Friday: `${Math.ceil(dailyHours * 0.6)} hrs Data Interpretation, ${Math.floor(dailyHours * 0.4)} hr Current Affairs bulletin`,
      Saturday: `${Math.ceil(dailyHours * 0.5)} hrs Topic revision, ${Math.floor(dailyHours * 0.5)} hrs PYQ solve`,
      Sunday: `Mock Test shift simulation (${dailyHours} hrs total including analysis)`,
    };

    monthlyRevisionPlan = 'Spaced repetition schedule: revision sessions every Saturday. Complete weak topic review checklist every 10 days.';
    mockTestSchedule = '1 Full CBT Mock Test every Sunday morning. Upgraded to daily mock schedules in the final two weeks of the route.';
  } else {
    try {
      // Find JSON block
      const cleanJson = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      const parsed = JSON.parse(cleanJson);
      weeklyPlan = parsed.weeklyPlan || [];
      timetable = parsed.timetable || {};
      monthlyRevisionPlan = parsed.monthlyRevisionPlan || '';
      mockTestSchedule = parsed.mockTestSchedule || '';
    } catch (_e) {
      // JSON parse fallback
      weeklyPlan = [
        {
          week: 'Week 1: Quantitative Aptitude Foundations',
          stationName: 'Aptitude Junction (APT)',
          topics: ['Simplification & Approximation', 'Percentage & Ratio Proportion'],
          progress: 0,
          status: 'In Progress',
          haltTime: 'Current Halt',
          haltColor: 'text-amber-500',
        },
      ];
      timetable = { Monday: '3 hrs Maths' };
      monthlyRevisionPlan = 'Revision sessions on weekends.';
      mockTestSchedule = '1 Mock Test weekly.';
    }
  }

  const studyPlan = await StudyPlan.create({
    user: userId,
    examTarget,
    examDate,
    dailyHours,
    strongSubjects,
    weakSubjects,
    prepLevel,
    language,
    weeklyPlan,
    timetable,
    monthlyRevisionPlan,
    mockTestSchedule,
    status: 'active',
  });

  // Pre-generate standard starting tasks for the active week
  const categories = ['Maths', 'Reasoning', 'Science', 'GK', 'Current Affairs', 'Mock Test'];
  const baseTasks = [
    { title: `Revise Quant formulas: ${weakSubjects[0] || 'Profit & Loss'}`, category: 'Maths', time: '40 mins', difficulty: 'Medium' },
    { title: `Solve 20 reasoning questions on Coding-Decoding`, category: 'Reasoning', time: '30 mins', difficulty: 'Easy' },
    { title: `Take custom weak topic practice on ${weakSubjects[0] || 'Syllogism'}`, category: 'Reasoning', time: '45 mins', difficulty: 'Hard' },
    { title: `Read daily Current Affairs and Railway History note sheets`, category: 'Current Affairs', time: '15 mins', difficulty: 'Easy' },
    { title: `Solve general physics and chemistry MCQ practice sets`, category: 'Science', time: '20 mins', difficulty: 'Medium' },
  ];

  const createdTasks = [];
  const today = new Date();
  for (let i = 0; i < baseTasks.length; i++) {
    const task = await StudyTask.create({
      user: userId,
      studyPlan: studyPlan._id,
      title: baseTasks[i].title,
      category: baseTasks[i].category,
      time: baseTasks[i].time,
      difficulty: baseTasks[i].difficulty,
      completed: false,
      date: today,
    });
    createdTasks.push(task);
  }

  return { plan: studyPlan, tasks: createdTasks };
}

export async function addStudyTask(userId, payload) {
  const activePlan = await StudyPlan.findOne({ user: userId, status: 'active' });
  if (!activePlan) {
    throw new ApiError(404, 'No active study plan found. Please generate one first.');
  }

  const task = await StudyTask.create({
    user: userId,
    studyPlan: activePlan._id,
    title: payload.title,
    category: payload.category || 'General',
    time: payload.time || '30 mins',
    difficulty: payload.difficulty || 'Medium',
    completed: false,
    date: new Date(),
  });

  return task;
}

export async function toggleStudyTask(taskId, userId) {
  const task = await StudyTask.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new ApiError(404, 'Study task not found');
  }

  task.completed = !task.completed;
  await task.save();

  // Dynamically update corresponding week's progress inside StudyPlan if applicable
  const activePlan = await StudyPlan.findOne({ _id: task.studyPlan, user: userId });
  if (activePlan) {
    const allTasks = await StudyTask.find({ studyPlan: activePlan._id, user: userId });
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const progress = Math.round((completedTasks / allTasks.length) * 100);

    // Update first in-progress or active week progress
    const activeWeekIdx = activePlan.weeklyPlan.findIndex((w) => w.status === 'In Progress');
    if (activeWeekIdx !== -1) {
      activePlan.weeklyPlan[activeWeekIdx].progress = progress;
      if (progress === 100) {
        activePlan.weeklyPlan[activeWeekIdx].status = 'Completed';
        activePlan.weeklyPlan[activeWeekIdx].haltTime = '6 hrs halt time';
        activePlan.weeklyPlan[activeWeekIdx].haltColor = 'text-emerald-500';
        
        // Progress next week
        if (activeWeekIdx + 1 < activePlan.weeklyPlan.length) {
          activePlan.weeklyPlan[activeWeekIdx + 1].status = 'In Progress';
          activePlan.weeklyPlan[activeWeekIdx + 1].haltTime = 'Current Halt - Train Arrived';
          activePlan.weeklyPlan[activeWeekIdx + 1].haltColor = 'text-amber-500 font-extrabold animate-pulse';
        }
      }
      activePlan.markModified('weeklyPlan');
      await activePlan.save();
    }
  }

  return task;
}
