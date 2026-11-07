# frozen_string_literal: true

require "json"

module Shop
  # A shopping cart.
  class Cart
    attr_reader :items

    TAX = 0.08

    def initialize(items = [])
      @items = items
      @@count ||= 0
    end

    def total(discount: false)
      sum = items.sum { |item| item[:price] * item.fetch(:qty, 1) }
      discount ? sum * 0.9 : sum * (1 + TAX)
    end

    def to_json(*args) = { items: items, total: total }.to_json(*args)
  end
end

cart = Shop::Cart.new([{ price: 9.5, qty: 2 }, { price: 3 }])
puts "Total: #{cart.total.round(2)}" if cart.items.any? && !nil
