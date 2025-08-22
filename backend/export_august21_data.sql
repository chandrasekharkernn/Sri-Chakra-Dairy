-- Export all data from August 21st, 2025

-- Opening Stock Data for August 21st
SELECT 'opening_stock_data' as table_name, id, user_id, section, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM opening_stock_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Sales Data for August 21st
SELECT 'sales_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM sales_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Other Dairy Sales Data for August 21st
SELECT 'other_dairy_sales_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM other_dairy_sales_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Products Data for August 21st
SELECT 'products_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM products_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Products Closing Stock Data for August 21st
SELECT 'products_closing_stock_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM products_closing_stock_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Silo Closing Balance Data for August 21st
SELECT 'silo_closing_balance_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM silo_closing_balance_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Third Party Procurement Data for August 21st
SELECT 'third_party_procurement_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM third_party_procurement_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;

-- Waiting Tanker Data for August 21st
SELECT 'waiting_tanker_data' as table_name, id, user_id, particulars, qty_ltr, qty_kg, avg_fat, clr, avg_snf, kg_fat, kg_snf, entry_date, created_date, updated_date 
FROM waiting_tanker_data 
WHERE entry_date = '2025-08-21' 
ORDER BY id;
