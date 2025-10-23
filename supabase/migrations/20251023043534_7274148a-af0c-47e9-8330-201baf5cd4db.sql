-- Delete all events except the specified 11 events
DELETE FROM events 
WHERE id NOT IN (
  '10000000-0000-0000-0000-000000000001',  -- APS: Integration of Machine Learning in Antenna Modelling
  '10000000-0000-0000-0000-000000000002',  -- APS: PPT Presentation Contest on 5G & 6G
  '5d341093-581c-4881-be82-2979462269b1',  -- APS: Circuit Mania
  '10000000-0000-0000-0000-000000000004',  -- PROCOM: Professional Empowerment Workshop
  'f78193e7-b899-4a1b-9e48-26a790019ca6',  -- PROCOM: Tech Quiz
  'a8958e24-6e1a-481d-80f4-da49f8a85449',  -- SPS: Escape Room
  '9d6a4e76-f9c3-4edf-87d4-c8b1ebc4b636',  -- SPS: Reverse Coding
  'ba44ac5a-0ca9-403d-b7ab-0b93bf32c3af',  -- SPS: Mindsphere Quiz
  'e64254aa-75d6-420d-9d92-a43f1cc65e18',  -- CS: AI Arena
  '6407aabf-af55-4126-ac95-98a0eda0763c',  -- CS: IDEATHON 2025
  '1a3b1af9-4d67-44ce-9dd6-db9993ca88cf'   -- CS: WEBCRAFT
);