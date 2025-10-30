-- Add registration_open field to events table
ALTER TABLE events 
ADD COLUMN registration_open boolean DEFAULT true;

-- Close registrations for ML Antenna event
UPDATE events 
SET registration_open = false 
WHERE title = 'Integration of Machine Learning in Antenna Modelling, Design, and Optimization';