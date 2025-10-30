-- Update APS event prices to 150
UPDATE events 
SET registration_amount = 150 
WHERE organizer = 'APS' 
AND title IN (
  'Integration of Machine Learning in Antenna Modelling, Design, and Optimization',
  'PPT Presentation Contest on 5G & 6G Communications',
  'Circuit Mania Contest'
);