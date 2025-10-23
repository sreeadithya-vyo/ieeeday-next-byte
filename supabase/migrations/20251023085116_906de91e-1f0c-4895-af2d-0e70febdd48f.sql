-- Add CODESPRINT 2025 event
INSERT INTO events (
  id,
  title,
  chapter_id,
  day,
  date,
  venue,
  short_desc,
  description,
  long_desc,
  image,
  registration_amount,
  capacity,
  organizer,
  rules,
  criteria,
  schedule
) VALUES (
  gen_random_uuid(),
  'CODESPRINT 2025',
  '20000000-0000-0000-0000-000000000002',
  2,
  '2025-11-01',
  'Computer Lab, ALAN TURING Block',
  'The Ultimate Coding Challenge - 3 intense rounds of programming problems',
  'CODESPRINT 2025 is an intense coding competition designed to ignite students'' passion for programming and problem-solving. Compete through three progressively challenging rounds inspired by Codeforces, LeetCode, and CodeChef.',
  'An intense and inspiring coding competition providing a platform for participants to showcase their logical thinking and coding efficiency through three progressively challenging rounds. Platform: HackerRank. Team Size: 1-2 Members. Prizes: 1st Prize ₹3,000 + Certificate, 2nd Prize ₹2,000 + Certificate.',
  '/images/codesprint-gen.jpg',
  200,
  30,
  'IEEE Computer Society',
  ARRAY[
    'Each team must consist of 1-2 members (maximum 2)',
    'A total of 30 teams will be allowed to participate',
    'No AI tools allowed',
    'All submissions must be original work',
    'Platform: HackerRank'
  ],
  ARRAY[
    'Correctness of solutions',
    'Code Efficiency & Optimization',
    'Execution Time',
    'Every question has points',
    'Tie-breaker: Total submission time'
  ],
  jsonb_build_array(
    jsonb_build_object('time', '9:00 AM - 9:45 AM', 'activity', 'Level 1 - Basic Programming (Easy)', 'duration', '45 minutes'),
    jsonb_build_object('time', '10:00 AM - 11:00 AM', 'activity', 'Level 2 - Algorithmic Challenges (Medium)', 'duration', '60 minutes'),
    jsonb_build_object('time', '11:30 AM - 1:00 PM', 'activity', 'Level 3 - Advanced Problem Solving (Hard)', 'duration', '90 minutes'),
    jsonb_build_object('time', '1:30 PM', 'activity', 'Results & Prize Distribution', 'duration', '')
  )
);

-- Update IDEATHON 2025 to Day 1
UPDATE events
SET day = 1, date = '2025-10-31'
WHERE id = '6407aabf-af55-4126-ac95-98a0eda0763c';