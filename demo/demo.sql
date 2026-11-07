-- Monthly revenue per active customer.
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

WITH monthly AS (
  SELECT customer_id,
         date_trunc('month', created_at) AS month,
         SUM(total) AS revenue
  FROM orders
  WHERE created_at >= '2026-01-01' AND total > 0
  GROUP BY 1, 2
)
SELECT c.name, m.month, m.revenue, COUNT(*) OVER (PARTITION BY c.id) AS months
FROM monthly m
JOIN customers c ON c.id = m.customer_id
WHERE c.active = TRUE AND c.deleted_at IS NULL
ORDER BY m.revenue DESC
LIMIT 10;
