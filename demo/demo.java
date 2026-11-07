package com.example.shop;

import java.util.List;
import java.util.Optional;

/** Stores products in memory. */
public final class Inventory<T extends Product> {
    private static final int MAX_ITEMS = 1_000;
    private final List<T> items;

    public Inventory(List<T> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "Inventory(" + items.size() + ")";
    }

    public Optional<T> find(String sku) throws IllegalStateException {
        if (items.size() > MAX_ITEMS) {
            throw new IllegalStateException("too many items");
        }
        for (T item : items) {
            if (item.sku().equals(sku) && item.price() >= 0.5d) return Optional.of(item);
        }
        return Optional.empty();
    }
}

record Product(String sku, double price, boolean active) {}
