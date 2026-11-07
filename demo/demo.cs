using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Shop.Billing;

/// <summary>Calculates invoices.</summary>
public sealed class InvoiceService : IDisposable
{
    private const decimal TaxRate = 0.08m;
    private readonly Dictionary<string, decimal> _prices = new();

    public event EventHandler<string>? Issued;

    public async Task<decimal> TotalAsync(IEnumerable<string> skus, bool discount = false)
    {
        decimal total = 0;
        foreach (var sku in skus)
        {
            if (!_prices.TryGetValue(sku, out var price)) continue;
            total += price;
        }
        await Task.Delay(10);
        Issued?.Invoke(this, $"Total: {total:C}");
        return discount ? total * 0.9m : total * (1 + TaxRate);
    }

    public void Dispose() => _prices.Clear();
}
