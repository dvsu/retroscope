package com.example.shop;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Stores products in memory.
 *
 * @param <T> the kind of product
 */
public final class Inventory<T extends Product> implements Iterable<T> {
    private static final int MAX_ITEMS = 1_000;
    private static final String PREFIX = "SKU-";
    private final List<T> items;
    private int version = 0;

    public Inventory(List<T> items) {
        this.items = new ArrayList<>(items);
    }

    @Override
    public java.util.Iterator<T> iterator() {
        return items.iterator();
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

    public synchronized void add(T item) {
        if (item == null || !item.active()) return;
        items.add(item);
        version += 1;
    }

    public Map<Boolean, List<String>> split(Function<T, Boolean> rule) {
        return items.stream()
                .filter(p -> p.price() > 0)
                .collect(Collectors.partitioningBy(rule::apply, Collectors.mapping(Product::sku, Collectors.toList())));
    }

    public String label(T item) {
        var name = item.sku().startsWith(PREFIX) ? item.sku() : PREFIX + item.sku();
        return switch (item.status()) {
            case IN_STOCK -> name + " (in stock)";
            case SOLD_OUT -> name + " (sold out)";
            default -> name;
        };
    }

    public static long count(Object value) {
        if (value instanceof Inventory<?> inventory) {
            return inventory.items.size();
        }
        char unit = 'x';
        long mask = 0xFF & 0b1010L;
        return unit == 'x' ? mask : -1;
    }

    public double total() {
        try {
            return items.stream().mapToDouble(Product::price).sum();
        } catch (ArithmeticException e) {
            System.err.println("bad price: " + e.getMessage() + "\t…");
            return Double.NaN;
        } finally {
            version++;
        }
    }
}

enum Status { IN_STOCK, SOLD_OUT, RETIRED }

interface Priced {
    double price();

    default boolean isFree() {
        return price() == 0;
    }
}

record Product(String sku, double price, boolean active, Status status) implements Priced {
    Product {
        if (price < 0) throw new IllegalArgumentException("negative price");
    }
}

@FunctionalInterface
interface Rule<T> {
    boolean test(T value);
}
