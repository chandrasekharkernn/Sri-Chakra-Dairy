-- Check existing IDs in Supabase tables

-- Check opening_stock_data IDs
SELECT 'opening_stock_data' as table_name, MAX(id) as max_id FROM opening_stock_data;

-- Check sales_data IDs  
SELECT 'sales_data' as table_name, MAX(id) as max_id FROM sales_data;

-- Check other_dairy_sales_data IDs
SELECT 'other_dairy_sales_data' as table_name, MAX(id) as max_id FROM other_dairy_sales_data;

-- Check products_data IDs
SELECT 'products_data' as table_name, MAX(id) as max_id FROM products_data;

-- Check products_closing_stock_data IDs
SELECT 'products_closing_stock_data' as table_name, MAX(id) as max_id FROM products_closing_stock_data;

-- Check silo_closing_balance_data IDs
SELECT 'silo_closing_balance_data' as table_name, MAX(id) as max_id FROM silo_closing_balance_data;

-- Check third_party_procurement_data IDs
SELECT 'third_party_procurement_data' as table_name, MAX(id) as max_id FROM third_party_procurement_data;

-- Check waiting_tanker_data IDs
SELECT 'waiting_tanker_data' as table_name, MAX(id) as max_id FROM waiting_tanker_data;
