-- Insert APS Chapter Events
INSERT INTO events (
  id, title, chapter_id, date, day, start_time, end_time, venue, 
  description, short_desc, long_desc, guest, organizer, 
  program_outcomes, criteria, rules, topics, capacity
) VALUES 
-- APS Event 1: ML Antenna Workshop
(
  '10000000-0000-0000-0000-000000000001',
  'Integration of Machine Learning in Antenna Modelling, Design, and Optimization',
  '20000000-0000-0000-0000-000000000001',
  '2025-10-31',
  1,
  '09:00:00',
  '16:15:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'One-Day Workshop on Integration of Machine Learning in Antenna Modelling, Design, and Optimization',
  'Hands-on workshop combining theoretical sessions with practical implementation of ML techniques in antenna design',
  'The first day of IEEE Day 2025 focuses on a hands-on workshop that combines theoretical sessions with practical implementation. The event features a keynote address, technical sessions, and a live demonstration of ML techniques applied to antenna design and optimization.',
  'Dr. K. Vasu Babu, Professor, BVRIT HYDERABAD College of Engineering for Women',
  'Sasi IEEE Antenna''s & Propagation Society Chapter',
  ARRAY[
    'Enhanced understanding of antenna design and ML-based optimization',
    'Gained hands-on experience with design and implementation tools',
    'Encouraged research and innovation in intelligent antenna systems'
  ],
  ARRAY[
    'Open to all engineering students',
    'Prior knowledge of antenna basics recommended',
    'Laptop required for hands-on sessions'
  ],
  NULL,
  ARRAY['Machine Learning', 'Antenna Design', 'Optimization', 'Signal Processing'],
  100
),
-- APS Event 2: PPT Contest
(
  '10000000-0000-0000-0000-000000000002',
  'PPT Presentation Contest on 5G & 6G Communications',
  '20000000-0000-0000-0000-000000000001',
  '2025-11-01',
  2,
  '13:00:00',
  '15:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'PPT Presentation Contest on 5G & 6G Communications',
  'Student presentation competition focused on emerging 5G and 6G wireless communication technologies',
  'Day 2 of IEEE Day 2025 celebrations focuses on student competitions. The PPT Presentation Contest allows students to showcase their knowledge and research on cutting-edge 5G and 6G communication technologies.',
  'Prof. Satish Rama Chowdary, Chair, AP-S Chapter, IEEE Vizag Bay Section',
  'Sasi IEEE Antenna''s & Propagation Society Chapter',
  ARRAY[
    'Improved knowledge of emerging 5G and 6G technologies',
    'Strengthened presentation and communication skills',
    'Fostered innovative thinking and awareness of wireless advancements'
  ],
  ARRAY[
    'Teams of 2-3 students',
    'Presentation time: 10-12 minutes',
    'Original research or innovative ideas required'
  ],
  ARRAY[
    'PPT format only',
    'No plagiarism allowed',
    'Judges decision is final'
  ],
  ARRAY['5G Communications', '6G Technologies', 'Wireless Networks', 'Future Communications'],
  50
),
-- APS Event 3: Circuit Mania
(
  '10000000-0000-0000-0000-000000000003',
  'Circuit Mania Contest',
  '20000000-0000-0000-0000-000000000001',
  '2025-11-01',
  2,
  '10:10:00',
  '12:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Circuit Design Competition - Hands-on Circuit Design Challenge',
  'Hands-on circuit design competition testing practical electronics and problem-solving skills',
  'Circuit Mania is an exciting hands-on competition where students design and build circuits to solve specific challenges. Participants will apply their theoretical knowledge to practical tasks and compete for prizes.',
  'Prof. Satish Rama Chowdary, Chair, AP-S Chapter, IEEE Vizag Bay Section',
  'Sasi IEEE Antenna''s & Propagation Society Chapter',
  ARRAY[
    'Applied theoretical knowledge to practical circuit design tasks',
    'Developed problem-solving and teamwork skills',
    'Promoted creativity and technical excellence in electronics design'
  ],
  ARRAY[
    'Teams of 2-4 students',
    'Basic circuit design knowledge required',
    'Components will be provided'
  ],
  ARRAY[
    'Use only provided components',
    'Follow safety guidelines',
    'Complete within time limit'
  ],
  ARRAY['Circuit Design', 'Electronics', 'Hardware', 'Problem Solving'],
  60
);

-- Insert ProComm Chapter Events
INSERT INTO events (
  id, title, chapter_id, date, day, start_time, end_time, venue,
  description, short_desc, long_desc, guest, organizer,
  program_outcomes, criteria, rules, topics, capacity
) VALUES
-- ProComm Event 1: Digital Presence Workshop
(
  '10000000-0000-0000-0000-000000000004',
  'Professional Empowerment Workshop: Shaping Your Digital Presence in the Industry 4.0 Era',
  '20000000-0000-0000-0000-000000000004',
  '2025-10-31',
  1,
  '09:30:00',
  '15:45:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Workshop on building professional digital presence, personal branding, and portfolio creation',
  'Two-day workshop covering content building, digital portfolio creation, personal branding, and professional presentation skills',
  'IEEE Day celebrates the first time in history when engineers worldwide gathered to share their technical ideas. For 2025, the Sasi IEEE Professional Communication Society Chapter organizes this workshop to enhance professional communication and digital presence skills among students in the Industry 4.0 era.',
  'Mr. Niranjan (IEEE YP Representative, ProCom Society), Mr. Heyram (Zoho Corporations, IEEE Madras YP), Mr. Ashvanth (MassMutual India, IEEE SSIT SAC)',
  'Sasi IEEE Professional Communication Society Chapter',
  ARRAY[
    'Gained strategies to build a strong digital identity and personal brand',
    'Developed professionalism and career readiness aligned with Industry 4.0',
    'Learned effective digital communication and online portfolio management for career growth'
  ],
  ARRAY[
    'Open to all students',
    'Laptop required for practical sessions',
    'Basic knowledge of web technologies helpful'
  ],
  NULL,
  ARRAY['Digital Portfolio', 'Personal Branding', 'Professional Communication', 'Career Development', 'Industry 4.0'],
  80
),
-- ProComm Event 2: Tech Quiz
(
  '10000000-0000-0000-0000-000000000005',
  'Tech Quiz',
  '20000000-0000-0000-0000-000000000004',
  '2025-11-01',
  2,
  '09:30:00',
  '15:30:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Multi-round technical quiz competition covering mathematics, general knowledge, and technology',
  'Interactive quiz competition testing knowledge across multiple domains including technology, mathematics, and current affairs',
  'Day 2 of IEEE Day 2025 features an engaging Tech Quiz competition that challenges participants across various technical and general knowledge domains, promoting quick thinking and analytical skills.',
  'Guest speakers and IEEE representatives',
  'Sasi IEEE Professional Communication Society Chapter',
  ARRAY[
    'Enhanced knowledge and problem-solving skills across mathematics, general knowledge, and technology',
    'Improved aptitude, observation, and memory through multi-round challenges',
    'Developed quick thinking and analytical skills by solving diverse quiz rounds'
  ],
  ARRAY[
    'Teams of 2-3 students',
    'Multiple elimination rounds',
    'Questions from tech, GK, and aptitude'
  ],
  ARRAY[
    'No mobile phones allowed',
    'Answer sheets provided',
    'Time limit per round will be announced'
  ],
  ARRAY['Technology', 'General Knowledge', 'Mathematics', 'Current Affairs', 'Aptitude'],
  60
);

-- Insert SPS Chapter Events
INSERT INTO events (
  id, title, chapter_id, date, day, start_time, end_time, venue,
  description, short_desc, long_desc, guest, organizer,
  program_outcomes, criteria, rules, topics, capacity
) VALUES
-- SPS Event 1: Escape Room
(
  '10000000-0000-0000-0000-000000000006',
  'Escape Room',
  '20000000-0000-0000-0000-000000000003',
  '2025-10-31',
  1,
  '09:00:00',
  '16:20:00',
  'Nikola Tesla Block, Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Interactive Escape Room experience with themed scenarios and technical challenges',
  'Interactive escape room event where teams solve puzzles and challenges to complete objectives within time limits',
  'The first day of IEEE Day 2025 focuses on an Escape Room event. It is an interactive experience in which a team is placed into a Themed Scenario (physical or virtual), given a time limit, and must solve a series of clues/puzzles/challenges in order to "escape" or reach the final objective before time runs out.',
  'Dr. Naveen Kishore (HOD)',
  'Sasi IEEE Signal Processing Society Chapter',
  ARRAY[
    'Technical Knowledge Application - Apply core ECE concepts to solve practical challenges',
    'Problem-Solving and Critical Thinking - Analyze complex problems and use systematic reasoning',
    'Teamwork and Collaboration - Effectively collaborate and communicate under pressure'
  ],
  ARRAY[
    'Teams of 4-6 students',
    'ECE background preferred',
    'All team members must participate'
  ],
  ARRAY[
    'Complete challenges within time limit',
    'No external help allowed',
    'Follow safety guidelines'
  ],
  ARRAY['Problem Solving', 'Critical Thinking', 'Teamwork', 'Circuit Analysis', 'Logic Design'],
  50
),
-- SPS Event 2: Reverse Coding
(
  '10000000-0000-0000-0000-000000000007',
  'Reverse Coding',
  '20000000-0000-0000-0000-000000000003',
  '2025-11-01',
  2,
  '09:30:00',
  '12:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Reverse engineering coding challenge where participants decode and understand existing code',
  'Challenging coding competition focused on reverse engineering, debugging, and understanding algorithms',
  'Day 2 of IEEE Day 2025 celebrations features Reverse Coding competition where students reverse engineer code, understand algorithms, and improve their debugging abilities.',
  'Technical experts and IEEE representatives',
  'Sasi IEEE Signal Processing Society',
  ARRAY[
    'Enhanced Problem-Solving Skills',
    'Improved Debugging Abilities',
    'Deeper Understanding of Algorithms and Logic',
    'Exposure to Real-World Coding Practices'
  ],
  ARRAY[
    'Individual or teams of 2',
    'Programming knowledge required',
    'Laptops required'
  ],
  ARRAY[
    'No internet access during contest',
    'Standard IDE only',
    'Complete within time limit'
  ],
  ARRAY['Coding', 'Algorithms', 'Debugging', 'Reverse Engineering', 'Problem Solving'],
  40
),
-- SPS Event 3: Mindsphere Quiz
(
  '10000000-0000-0000-0000-000000000008',
  'Mindsphere Quiz',
  '20000000-0000-0000-0000-000000000003',
  '2025-11-01',
  2,
  '13:00:00',
  '15:30:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  'Comprehensive quiz competition covering engineering concepts, current affairs, and general knowledge',
  'Multi-domain quiz testing knowledge in engineering, current affairs, and general topics',
  'Day 2 of IEEE Day 2025 concludes with the Mindsphere Quiz, a comprehensive competition that tests participants on diverse topics including engineering concepts, current affairs, and general knowledge.',
  'Quiz masters and IEEE representatives',
  'Sasi IEEE Signal Processing Society',
  ARRAY[
    'Enhance general knowledge by staying updated on current affairs and global events',
    'Encourage teamwork and quick thinking through competitive quizzing',
    'Strengthen understanding of core engineering concepts alongside broader knowledge',
    'Foster healthy competition and boost confidence in recalling information under pressure'
  ],
  ARRAY[
    'Teams of 2-3 students',
    'Multiple rounds',
    'Questions from varied domains'
  ],
  ARRAY[
    'No mobile phones',
    'Buzzer rounds follow buzzer rules',
    'Judges decision is final'
  ],
  ARRAY['Engineering', 'Current Affairs', 'General Knowledge', 'Technology', 'Science'],
  60
);