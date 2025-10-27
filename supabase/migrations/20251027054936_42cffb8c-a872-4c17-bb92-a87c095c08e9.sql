-- Update registration amounts for all events

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%AI Arena%';

UPDATE public.events 
SET registration_amount = 200 
WHERE title ILIKE '%Ideathon%';

UPDATE public.events 
SET registration_amount = 250 
WHERE title ILIKE '%Professional Empowerment%' OR title ILIKE '%Digital Presence%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Escape Room%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Integration of ML%' OR title ILIKE '%Antenna%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%PPT Presentation%' OR title ILIKE '%5G%' OR title ILIKE '%6G%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Mind Sphere%' OR title ILIKE '%MINDSPHERE%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Circuit Mania%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Reverse Coding%';

UPDATE public.events 
SET registration_amount = 150 
WHERE title ILIKE '%Web Craft%' OR title ILIKE '%WEBCRAFT%';

UPDATE public.events 
SET registration_amount = 100 
WHERE title ILIKE '%Tech Quiz%';

UPDATE public.events 
SET registration_amount = 200 
WHERE title ILIKE '%Codesprint%' OR title ILIKE '%CODE SPRINT%';