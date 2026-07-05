-- Create BigQuery dataset and populate the inventory_data table
-- Run in BigQuery console or via `bq query`

CREATE SCHEMA IF NOT EXISTS `decisioniq`;

CREATE TABLE IF NOT EXISTS `decisioniq.inventory_data` (
  product_name          STRING    NOT NULL,
  category              STRING    NOT NULL,
  avg_weekly_sales_units INT64    NOT NULL,
  current_stock_units   INT64     NOT NULL,
  shelf_life_days       INT64     NOT NULL,
  unit_cost             FLOAT64   NOT NULL,
  unit_price            FLOAT64   NOT NULL,
  weather_sensitivity   STRING    NOT NULL,
  local_event_flag      BOOL      NOT NULL
);

INSERT INTO `decisioniq.inventory_data` VALUES
  ('Bananas',              'Fruits',     120, 80,  5,  0.30, 0.75, 'low',  TRUE),
  ('Strawberries',         'Fruits',     60,  30,  3,  1.20, 2.80, 'high', TRUE),
  ('Avocados',             'Fruits',     55,  30,  4,  0.90, 2.00, 'low',  FALSE),
  ('Blueberries (150g)',   'Fruits',     48,  22,  4,  1.80, 3.50, 'high', TRUE),
  ('Whole Milk (1L)',      'Dairy',      200, 150, 7,  0.90, 1.60, 'low',  FALSE),
  ('Greek Yogurt',         'Dairy',      80,  45,  10, 1.10, 2.20, 'low',  FALSE),
  ('Eggs (12 pack)',       'Dairy',      150, 100, 21, 2.00, 3.80, 'low',  FALSE),
  ('Mozzarella (250g)',    'Dairy',      45,  25,  8,  1.50, 3.20, 'low',  TRUE),
  ('Sourdough Bread',      'Bakery',     50,  20,  4,  1.80, 3.50, 'high', TRUE),
  ('Croissants',           'Bakery',     40,  15,  2,  0.80, 2.00, 'high', TRUE),
  ('Chicken Breast (500g)','Meat',       90,  55,  3,  3.50, 6.00, 'low',  FALSE),
  ('Salmon Fillet (300g)', 'Seafood',    35,  18,  2,  5.00, 9.50, 'high', TRUE),
  ('Spinach (250g)',       'Vegetables', 70,  40,  5,  0.60, 1.50, 'low',  FALSE),
  ('Tomatoes (500g)',      'Vegetables', 100, 65,  6,  0.80, 1.80, 'low',  FALSE),
  ('Orange Juice (1L)',    'Beverages',  85,  60,  14, 1.20, 2.50, 'high', TRUE);
