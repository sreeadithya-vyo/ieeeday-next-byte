-- Update CodeSprint event with detailed information
UPDATE events 
SET 
  title = 'CODESPRINT – The Ultimate Coding Challenge',
  venue = 'Computer Lab, Alan Turing Block',
  short_desc = 'An intense coding competition with three progressive challenge rounds inspired by Codeforces, LeetCode, and CodeChef patterns.',
  long_desc = 'CODESPRINT 2025 is an intense and inspiring coding competition designed to ignite students'' passion for programming and problem-solving. The event provides a platform for participants to showcase their logical thinking and coding efficiency through three progressively challenging rounds inspired by Codeforces, LeetCode, and CodeChef problem patterns. Compete on HackerRank and prove your skills!',
  capacity = 30,
  registration_amount = 200,
  rules = ARRAY[
    'Each team must consist of 1-2 members (maximum 2)',
    'A total of 30 teams will be allowed to participate',
    'Platform used: HackerRank',
    'Not allowed to use AI tools during the competition',
    'Registration fee: ₹200 per team (₹100 for IEEE members)',
    'Original work only – plagiarism will lead to disqualification',
    'Every question has points based on difficulty'
  ],
  criteria = ARRAY[
    'Correctness of solutions',
    'Code Efficiency & Optimization',
    'Execution Time',
    'Tie-breaker: Total submission time'
  ],
  topics = ARRAY[
    'Level 1 – Basic Programming (Easy Level) - 45 Minutes: Fundamental programming concepts and logic',
    'Level 2 – Algorithmic Challenges (Medium Level) - 60 Minutes: Arrays, strings, and logic-based algorithms',
    'Level 3 – Advanced Problem Solving (Hard Level) - 90 Minutes: Algorithm optimization and data structure skills'
  ],
  program_outcomes = ARRAY[
    'Enhanced problem-solving and logical thinking abilities',
    'Improved coding efficiency under time pressure',
    'Experience with competitive programming platforms',
    'Strengthened algorithm optimization skills'
  ],
  schedule = jsonb_build_object(
    'Level 1', 'Basic Programming (45 Minutes) - Fundamental programming concepts and logic',
    'Level 2', 'Algorithmic Challenges (60 Minutes) - Arrays, strings, and logic-based algorithms',
    'Level 3', 'Advanced Problem Solving (90 Minutes) - Algorithm optimization and data structure skills',
    'Prize Pool', '1st Prize: ₹3,000 + Certificate of Excellence | 2nd Prize: ₹2,000 + Certificate of Merit'
  ),
  updated_at = now()
WHERE id = '46df2035-6e29-469b-b170-233e34d4a897';