-- Insert ProComm Chapter Events
INSERT INTO events (
  chapter_id,
  title,
  short_desc,
  long_desc,
  date,
  day,
  start_time,
  end_time,
  venue,
  capacity,
  guest,
  organizer,
  image
) VALUES
-- ProComm Day 1
(
  '20000000-0000-0000-0000-000000000004',
  'Professional Empowerment Workshop: Shaping Your Digital Presence',
  'One-day workshop on building professional identity and digital portfolios in the Industry 4.0 era',
  'IEEE Day celebrates the first time in history when engineers worldwide gathered to share their technical ideas. This workshop focuses on Content Building for Personal Portfolio and Personal Branding, helping students develop personalized statements, project summaries, and create their digital portfolio websites.',
  '2025-10-31',
  1,
  '09:30:00',
  '15:45:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  100,
  'Mr. Niranjan - IEEE YP Representative, ProCom Society',
  'Sasi IEEE Professional Communication Society Chapter',
  '/placeholder.svg'
),
-- ProComm Day 2
(
  '20000000-0000-0000-0000-000000000004',
  'Tech Quiz',
  'Technical quiz competition testing knowledge across various technical domains',
  'Day 2 features a comprehensive Tech Quiz event along with sessions on Creating Your Digital Portfolio & Website. Participants will compete in a technical quiz covering multiple domains while learning to build live portfolios using GitHub Pages, WordPress, or Notion.',
  '2025-11-01',
  2,
  '09:30:00',
  '16:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  100,
  'Mr. Heyram - Zoho Corporations, ExCom Member IEEE Madras Young Professionals',
  'Sasi IEEE Professional Communication Society Chapter',
  '/placeholder.svg'
),
-- APS Day 1
(
  '20000000-0000-0000-0000-000000000001',
  'Integration of Machine Learning in Antenna Modelling',
  'Hands-on workshop combining ML techniques with antenna design and optimization',
  'A comprehensive workshop featuring keynote addresses, technical sessions, and live demonstrations of Machine Learning techniques applied to antenna design and optimization. Includes hands-on experience and Q&A sessions.',
  '2025-10-31',
  1,
  '09:00:00',
  '16:15:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  80,
  'Dr. K. Vasu Babu - Professor, BVRIT HYDERABAD College of Engineering for Women',
  'Sasi IEEE Antenna & Propagation Society Chapter',
  '/placeholder.svg'
),
-- APS Day 2
(
  '20000000-0000-0000-0000-000000000001',
  'PPT Contest on 5G & 6G Communications',
  'Presentation competition on next-generation wireless communications',
  'Student competition focused on 5G and 6G communications technology. Participants will present their research and ideas on next-generation wireless communications through comprehensive PowerPoint presentations.',
  '2025-11-01',
  2,
  '09:00:00',
  '15:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  50,
  'Dr. Addepalli Tatababu - Aditya University, Surampalem',
  'Sasi IEEE Antenna & Propagation Society Chapter',
  '/placeholder.svg'
),
-- APS Circuit Mania
(
  '20000000-0000-0000-0000-000000000001',
  'Circuit Mania Contest',
  'Hands-on circuit design competition',
  'An exciting circuit design competition where participants showcase their skills in designing and building circuits. This hands-on contest tests both theoretical knowledge and practical implementation skills.',
  '2025-11-01',
  2,
  '10:10:00',
  '12:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  50,
  'Dr. Addepalli Tatababu - Aditya University, Surampalem',
  'Sasi IEEE Antenna & Propagation Society Chapter',
  '/placeholder.svg'
),
-- SPS Day 1
(
  '20000000-0000-0000-0000-000000000003',
  'Escape Room',
  'Interactive puzzle-solving challenge in a themed scenario',
  'An interactive experience where teams are placed into a themed scenario and must solve a series of clues, puzzles, and challenges to reach the final objective before time runs out. Tests problem-solving, critical thinking, and teamwork.',
  '2025-10-31',
  1,
  '09:00:00',
  '16:20:00',
  'Nikola Tesla Block, Sasi Institute of Technology and Engineering',
  60,
  'Dr. Naveen Kishore - HOD',
  'Sasi IEEE Signal Processing Society Chapter',
  '/placeholder.svg'
),
-- SPS Reverse Coding
(
  '20000000-0000-0000-0000-000000000003',
  'Reverse Coding',
  'Challenge to understand and recreate code from output',
  'A unique coding competition where participants must reverse-engineer code by analyzing the expected output. Tests analytical skills, programming knowledge, and problem-solving abilities.',
  '2025-11-01',
  2,
  '09:30:00',
  '12:00:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  50,
  NULL,
  'Sasi IEEE Signal Processing Society Chapter',
  '/placeholder.svg'
),
-- SPS Mindsphere Quiz
(
  '20000000-0000-0000-0000-000000000003',
  'Mindsphere Quiz',
  'Technical quiz testing knowledge across multiple domains',
  'A comprehensive technical quiz competition covering multiple technical domains. Tests participants knowledge, quick thinking, and decision-making abilities under time constraints.',
  '2025-11-01',
  2,
  '13:00:00',
  '15:30:00',
  'Sasi Institute of Technology and Engineering, Tadepalligudem',
  50,
  NULL,
  'Sasi IEEE Signal Processing Society Chapter',
  '/placeholder.svg'
),
-- CS Events
-- AI Arena
(
  '20000000-0000-0000-0000-000000000002',
  'AI Arena',
  'Competitive Machine Learning challenge with real-world datasets',
  'A competitive ML challenge where teams develop AI models to achieve highest accuracy. Participants receive predefined datasets and must build models promoting analytical thinking, coding skills, and AI problem-solving. Prizes: 1st ₹3,000, 2nd ₹2,000. Registration: ₹200/team (₹150 IEEE members).',
  '2025-10-31',
  1,
  '09:00:00',
  '16:30:00',
  'Alan Turing Block, Sasi Institute of Technology and Engineering',
  25,
  NULL,
  'S. Sai Suma Sri, S. Bhagya Rekha',
  '/placeholder.svg'
),
-- IDEATHON
(
  '20000000-0000-0000-0000-000000000002',
  'IDEATHON 2025',
  'Creative innovation challenge for real-world problem solving',
  'Teams brainstorm and present innovative solutions based on 5 themes: AI for Social Good, Sustainability, Smart Education, Digital Transformation, and HealthTech. Prizes: 1st ₹3,000, 2nd ₹2,000. Registration: ₹200/team (₹150 IEEE members). Team size: 2-4 members.',
  '2025-11-01',
  2,
  '09:00:00',
  '16:30:00',
  'AIML Seminar Hall, Sasi Institute of Technology and Engineering',
  30,
  NULL,
  'IEEE Computer Society Chapter',
  '/placeholder.svg'
),
-- WEBCRAFT
(
  '20000000-0000-0000-0000-000000000002',
  'WEBCRAFT',
  'Web design and development competition using modern tools',
  'Front-end development challenge using Figma, HTML, CSS, JavaScript, and Bootstrap. Teams design and build interactive websites based on given themes. Tests creativity, code efficiency, responsiveness, and design implementation. Prizes: 1st ₹3,000, 2nd ₹2,000. Registration: ₹200 (₹150 IEEE members).',
  '2025-11-01',
  2,
  '10:00:00',
  '15:00:00',
  'Alan Turing Block, Sasi Institute of Technology and Engineering',
  40,
  NULL,
  'N. Jahnavi, B. Tejasree',
  '/placeholder.svg'
);