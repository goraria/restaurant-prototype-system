-- ================================
-- 🍽️ RESTAURANT MANAGEMENT DATABASE
-- Migration Script for Constraints & Triggers
-- ================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- 📋 CHECK CONSTRAINTS
-- ================================

-- Order Items: Quantity must be positive
ALTER TABLE "order_items" 
ADD CONSTRAINT "chk_order_items_quantity_positive" 
CHECK (quantity > 0);

-- Order Items: Price must be positive
ALTER TABLE "order_items" 
ADD CONSTRAINT "chk_order_items_price_positive" 
CHECK (price_at_purchase >= 0);

-- Reviews: Rating between 1 and 5
ALTER TABLE "reviews" 
ADD CONSTRAINT "chk_reviews_rating_range" 
CHECK (rating >= 1 AND rating <= 5);

-- Tables: Capacity must be positive
ALTER TABLE "tables" 
ADD CONSTRAINT "chk_tables_capacity_positive" 
CHECK (capacity > 0);

-- Reservations: Party size must be positive and within table capacity
ALTER TABLE "reservations" 
ADD CONSTRAINT "chk_reservations_party_size_positive" 
CHECK (party_size > 0);

-- Staff Schedules: End time after start time
ALTER TABLE "staff_schedules" 
ADD CONSTRAINT "chk_staff_schedules_time_order" 
CHECK (end_time > start_time);

-- Inventory: Quantities must be non-negative
ALTER TABLE "inventory_items" 
ADD CONSTRAINT "chk_inventory_quantity_nonnegative" 
CHECK (quantity >= 0);

-- Vouchers: Discount value must be positive
ALTER TABLE "vouchers" 
ADD CONSTRAINT "chk_vouchers_discount_positive" 
CHECK (discount_value > 0);

-- Vouchers: End date after start date
ALTER TABLE "vouchers" 
ADD CONSTRAINT "chk_vouchers_date_order" 
CHECK (end_date > start_date);

-- Orders: Amounts must be non-negative
ALTER TABLE "orders" 
ADD CONSTRAINT "chk_orders_amounts_nonnegative" 
CHECK (total_amount >= 0 AND shipping_fee >= 0 AND discount_amount >= 0 AND final_amount >= 0);

-- ================================
-- 🔄 FUNCTIONS & TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 📊 REVENUE REPORTING TRIGGERS
-- ================================

-- Function to automatically update revenue reports
CREATE OR REPLACE FUNCTION update_revenue_reports()
RETURNS TRIGGER AS $$
DECLARE
    restaurant_id_val UUID;
    report_date_val DATE;
    current_revenue DECIMAL(14,2);
    current_orders INTEGER;
    current_customers INTEGER;
BEGIN
    -- Get restaurant_id from order
    SELECT r.id INTO restaurant_id_val
    FROM restaurants r
    JOIN restaurant_staffs rs ON rs.restaurant_id = r.id
    JOIN orders o ON o.user_id = rs.user_id
    WHERE o.id = NEW.id
    LIMIT 1;
    
    -- If we can't determine restaurant, try from table_orders
    IF restaurant_id_val IS NULL THEN
        SELECT r.id INTO restaurant_id_val
        FROM restaurants r
        JOIN tables t ON t.restaurant_id = r.id
        JOIN table_orders tord ON tord.table_id = t.id
        WHERE tord.order_id = NEW.id
        LIMIT 1;
    END IF;
    
    -- Skip if we still can't determine restaurant
    IF restaurant_id_val IS NULL THEN
        RETURN NEW;
    END IF;
    
    report_date_val := DATE(NEW.created_at);
    
    -- Calculate current day totals
    SELECT 
        COALESCE(SUM(final_amount), 0),
        COUNT(*),
        COUNT(DISTINCT user_id)
    INTO current_revenue, current_orders, current_customers
    FROM orders 
    WHERE DATE(created_at) = report_date_val 
    AND status = 'completed'
    AND id IN (
        SELECT DISTINCT o.id FROM orders o
        LEFT JOIN table_orders tord ON tord.order_id = o.id
        LEFT JOIN tables t ON t.id = tord.table_id
        WHERE t.restaurant_id = restaurant_id_val
    );
    
    -- Upsert daily revenue report
    INSERT INTO revenue_reports (
        id, restaurant_id, report_date, report_type, 
        total_revenue, total_orders, total_customers, 
        avg_order_value, created_at
    ) VALUES (
        uuid_generate_v4(),
        restaurant_id_val,
        report_date_val,
        'daily',
        current_revenue,
        current_orders,
        current_customers,
        CASE WHEN current_orders > 0 THEN current_revenue / current_orders ELSE 0 END,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (restaurant_id, report_date, report_type)
    DO UPDATE SET
        total_revenue = EXCLUDED.total_revenue,
        total_orders = EXCLUDED.total_orders,
        total_customers = EXCLUDED.total_customers,
        avg_order_value = EXCLUDED.avg_order_value;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update revenue reports when order is completed
CREATE TRIGGER update_revenue_on_order_completion
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION update_revenue_reports();

-- ================================
-- 🔄 INVENTORY MANAGEMENT TRIGGERS
-- ================================

-- Function to automatically create inventory transaction
CREATE OR REPLACE FUNCTION create_inventory_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Create transaction record when inventory quantity changes
    IF OLD.quantity != NEW.quantity THEN
        INSERT INTO inventory_transactions (
            id, inventory_item_id, type, quantity, note, created_at
        ) VALUES (
            uuid_generate_v4(),
            NEW.id,
            CASE 
                WHEN NEW.quantity > OLD.quantity THEN 'import'
                ELSE 'export'
            END,
            ABS(NEW.quantity - OLD.quantity),
            'Auto-generated transaction',
            CURRENT_TIMESTAMP
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory transactions
CREATE TRIGGER auto_inventory_transaction
    AFTER UPDATE OF quantity ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION create_inventory_transaction();

-- ================================
-- 📅 TABLE MANAGEMENT FUNCTIONS
-- ================================

-- Function to automatically free up table after order completion
CREATE OR REPLACE FUNCTION manage_table_status()
RETURNS TRIGGER AS $$
DECLARE
    table_id_val UUID;
BEGIN
    -- Get table_id from table_orders
    SELECT table_id INTO table_id_val
    FROM table_orders 
    WHERE order_id = NEW.id;
    
    IF table_id_val IS NOT NULL THEN
        CASE NEW.status
            WHEN 'completed' THEN
                -- Mark table as available
                UPDATE tables 
                SET status = 'available', updated_at = CURRENT_TIMESTAMP
                WHERE id = table_id_val;
                
                -- Close table order session
                UPDATE table_orders 
                SET status = 'completed', closed_at = CURRENT_TIMESTAMP
                WHERE order_id = NEW.id;
                
            WHEN 'cancelled' THEN
                -- Mark table as available
                UPDATE tables 
                SET status = 'available', updated_at = CURRENT_TIMESTAMP
                WHERE id = table_id_val;
                
                -- Cancel table order session
                UPDATE table_orders 
                SET status = 'cancelled', closed_at = CURRENT_TIMESTAMP
                WHERE order_id = NEW.id;
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for table management
CREATE TRIGGER manage_table_on_order_status_change
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION manage_table_status();

-- ================================
-- 🔐 SECURITY & AUDIT FUNCTIONS
-- ================================

-- Function to create order status history
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO order_status_history (
            id, order_id, status, notes, created_at
        ) VALUES (
            uuid_generate_v4(),
            NEW.id,
            NEW.status,
            'Status changed from ' || OLD.status || ' to ' || NEW.status,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order status history
CREATE TRIGGER create_order_history
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION create_order_status_history();

-- ================================
-- 📊 ANALYTICS FUNCTIONS
-- ================================

-- Function to calculate popular menu items
CREATE OR REPLACE FUNCTION calculate_popular_items(restaurant_id_param UUID, date_param DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(item_stats ORDER BY total_quantity DESC)
    INTO result
    FROM (
        SELECT 
            mi.id,
            mi.name,
            SUM(oi.quantity) as total_quantity,
            COUNT(DISTINCT oi.order_id) as order_count,
            AVG(oi.price_at_purchase) as avg_price
        FROM menu_items mi
        JOIN order_items oi ON oi.menu_item_id = mi.id
        JOIN orders o ON o.id = oi.order_id
        JOIN table_orders tord ON tord.order_id = o.id
        JOIN tables t ON t.id = tord.table_id
        WHERE t.restaurant_id = restaurant_id_param
        AND DATE(o.created_at) = date_param
        AND o.status = 'completed'
        GROUP BY mi.id, mi.name
        LIMIT 10
    ) item_stats;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 📈 PERFORMANCE INDEXES
-- ================================

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_restaurant_status_date 
ON orders (created_at DESC, status) 
WHERE status IN ('pending', 'confirmed', 'preparing');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_orders_restaurant_status 
ON table_orders (opened_at DESC, status)
WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_menu_items_restaurant_available
ON menu_items (menu_id, is_available)
WHERE is_available = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_low_stock
ON inventory_items (restaurant_id, quantity)
WHERE quantity <= min_quantity;

-- ================================
-- 🎯 EXAMPLE QUERIES FOR TESTING
-- ================================

/*
-- Test popular items function
SELECT calculate_popular_items('your-restaurant-id'::UUID);

-- Check low stock items
SELECT i.name, i.quantity, i.min_quantity, r.name as restaurant_name
FROM inventory_items i
JOIN restaurants r ON r.id = i.restaurant_id
WHERE i.quantity <= i.min_quantity;

-- Daily revenue summary
SELECT r.name, rr.total_revenue, rr.total_orders, rr.avg_order_value
FROM revenue_reports rr
JOIN restaurants r ON r.id = rr.restaurant_id
WHERE rr.report_date = CURRENT_DATE
AND rr.report_type = 'daily';
*/

-- ================================
-- ✅ MIGRATION COMPLETE
-- ================================

COMMENT ON SCHEMA public IS 'Restaurant Management Database - Optimized for multi-platform applications';
