using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Shop.Billing;

/// <summary>Calculates invoices.</summary>
/// <param name="currency">ISO code, e.g. <c>"EUR"</c>.</param>
public sealed class InvoiceService(string currency) : IDisposable
{
    private const decimal TaxRate = 0.08m;
    private static readonly Regex SkuPattern = new(@"^[A-Z]{3}-\d{4}$", RegexOptions.Compiled);
    private readonly Dictionary<string, decimal> _prices = new();

    public event EventHandler<string>? Issued;

    public string Currency { get; } = currency;
    public int Count => _prices.Count;

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

public enum Status { Pending, Shipped, Returned }

public interface IRepository<T> where T : class
{
    T? Find(int id);
    IReadOnlyList<T> All();
}

public record Order(int Id, string Customer, decimal Amount, Status Status = Status.Pending);

public readonly struct Money(decimal amount, string currency)
{
    public decimal Amount { get; } = amount;
    public string Currency { get; } = currency;

    public static Money operator +(Money a, Money b) => new(a.Amount + b.Amount, a.Currency);
    public override string ToString() => $"{Amount:0.00} {Currency}";
}

public delegate void OrderHandler(Order order);

public static class OrderExtensions
{
    public static bool IsLate(this Order order, int days = 7) =>
        order.Status == Status.Pending && days > 3;

    public static string Describe(this Order order) => order switch
    {
        { Status: Status.Shipped } => "shipped",
        { Amount: > 100m } => "large",
        null => throw new ArgumentNullException(nameof(order)),
        _ => 'p' + "ending\t…",
    };

    public static IEnumerable<int> Ids(this IRepository<Order> repo) =>
        from o in repo.All() where !o.IsLate() orderby o.Id select o.Id;
}

#region Helpers
internal static class Program
{
    private static async Task Main(string[] args)
    {
        // Run with: dotnet run
        var service = new InvoiceService("EUR");
        var orders = new List<Order> { new(1, "Ada", 42.5m), new(2, "Linus", 120m, Status.Shipped) };
        OrderHandler log = order => Console.WriteLine(order.Describe());
        orders.ForEach(o => log(o));
        int? missing = null;
        var label = missing ?? -1;
        var sum = new Money(1m, "EUR") + new Money(2m, "EUR");
        Console.WriteLine($"{sum} {label} {typeof(Order).Name} {true}");
        try
        {
            await service.TotalAsync(args);
        }
        catch (InvalidOperationException ex) when (ex.Message is not null)
        {
            throw;
        }
    }
}
#endregion
