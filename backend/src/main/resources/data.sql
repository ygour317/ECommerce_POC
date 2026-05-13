-- Sample catalog (loaded after Hibernate DDL when using embedded H2).
-- See DevUserSeed for default login accounts (not stored here so passwords stay BCrypt-correct in code).

INSERT INTO products (name, description, price, stock_quantity, sku) VALUES
('Ergonomic Wireless Mouse', '2.4 GHz connection, silent clicks, contoured shape for all-day comfort.', 29.99, 140, 'SKU-EWM-001'),
('Mechanical Keyboard RGB', 'Hot-swappable switches, per-key RGB, aluminum frame.', 119.50, 62, 'SKU-MKB-002'),
('27" QHD Monitor', 'IPS panel, 75 Hz, thin bezels, height-adjustable stand.', 289.00, 34, 'SKU-MON-003'),
('USB-C Hub 7-in-1', 'HDMI 4K, SD/microSD, USB 3.0, pass-through charging.', 45.00, 210, 'SKU-HUB-004'),
('Noise-Cancelling Headphones', '40 h battery, plush ear cushions, fold-flat design.', 179.99, 88, 'SKU-HDP-005'),
('Webcam Pro 1080p', 'Auto light correction, dual mics, privacy shutter.', 69.49, 150, 'SKU-WBC-006'),
('Laptop Stand Aluminum', 'Ventilated, fits up to 16" laptops, rubber pads.', 39.95, 95, 'SKU-LPS-007'),
('Portable SSD 1TB', 'USB 3.2 Gen 2, shock-resistant, 1050 MB/s read.', 129.00, 73, 'SKU-SSD-008');
