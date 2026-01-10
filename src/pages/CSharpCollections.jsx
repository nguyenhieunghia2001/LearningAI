import React, { useState } from 'react';
import './LinqGuide.css';

const LinqInterviewGuide = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="linq-guide-container">
      <header className="guide-header">
        <h1>Câu hỏi phỏng vấn về LINQ & Collections trong C#</h1>
        <p className="subtitle">Tài liệu tham khảo chi tiết với lý thuyết và ví dụ code</p>
      </header>

      <nav className="table-of-contents">
        <h2>Mục lục</h2>
        <ul>
          <li><a href="#section1">1. IEnumerable vs IQueryable</a></li>
          <li><a href="#section2">2. List vs IEnumerable vs ICollection</a></li>
          <li><a href="#section3">3. Deferred Execution trong LINQ</a></li>
          <li><a href="#section4">4. First() vs FirstOrDefault() vs Single() vs SingleOrDefault()</a></li>
          <li><a href="#section5">5. LINQ Query Syntax vs Method Syntax</a></li>
          <li><a href="#section6">6. Lazy Loading vs Eager Loading</a></li>
          <li><a href="#section7">7. Select vs SelectMany</a></li>
          <li><a href="#section8">{'8. Any() vs Count() > 0'}</a></li>
          <li><a href="#section9">9. Implement Custom LINQ Operator</a></li>
        </ul>
      </nav>

      <main className="guide-content">
        {/* Section 1: IEnumerable vs IQueryable */}
        <section id="section1" className="guide-section">
          <h2 onClick={() => toggleSection(1)} className="section-title">
            1. IEnumerable&lt;T&gt; vs IQueryable&lt;T&gt; - Khi nào dùng cái nào?
            <span className="toggle-icon">{activeSection === 1 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 1 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Lý thuyết cơ bản</h3>
                <div className="comparison-grid">
                  <div className="comparison-item">
                    <h4>IEnumerable&lt;T&gt;</h4>
                    <ul>
                      <li>Namespace: <code>System.Collections.Generic</code></li>
                      <li>Dùng cho <strong>LINQ to Objects</strong> (in-memory)</li>
                      <li>Thực thi trên <strong>client-side</strong> (trong RAM)</li>
                      <li>Code C# chạy trên từng object trong memory</li>
                      <li>Phù hợp: Array, List, Dictionary</li>
                    </ul>
                  </div>
                  <div className="comparison-item">
                    <h4>IQueryable&lt;T&gt;</h4>
                    <ul>
                      <li>Namespace: <code>System.Linq</code></li>
                      <li>Kế thừa từ <code>IEnumerable&lt;T&gt;</code></li>
                      <li>Dùng cho <strong>LINQ to SQL/EF</strong></li>
                      <li>Build <strong>Expression Tree</strong> → SQL query</li>
                      <li>Thực thi trên <strong>server-side</strong> (database)</li>
                      <li>Phù hợp: Entity Framework, LINQ to SQL</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="code-example">
                <h4>So sánh cách hoạt động</h4>
                <pre><code>{`// IEnumerable<T> - In-memory execution
IEnumerable<Product> products = dbContext.Products.AsEnumerable();
var result = products.Where(p => p.Price > 1000);
// ↓
// 1. Load TẤT CẢ products từ DB vào memory
// 2. Loop qua từng product trong C#
// 3. Check p.Price > 1000 bằng C# code
// SQL: SELECT * FROM Products (load hết)

// IQueryable<T> - Database execution  
IQueryable<Product> products = dbContext.Products;
var result = products.Where(p => p.Price > 1000);
// ↓
// 1. Build Expression Tree: p => p.Price > 1000
// 2. Convert sang SQL: WHERE Price > 1000
// 3. Chỉ lấy records thỏa điều kiện từ DB
// SQL: SELECT * FROM Products WHERE Price > 1000`}</code></pre>
              </div>

              <div className="code-example">
                <h4>Ví dụ thực tế</h4>
                <pre><code>{`public class ProductService
{
    // ❌ SAI - IEnumerable load hết data vào memory
    public IEnumerable<Product> GetExpensiveProducts_Bad()
    {
        IEnumerable<Product> allProducts = _dbContext.Products.AsEnumerable();
        
        var result = allProducts
            .Where(p => p.Price > 1000)    // Loop 1 triệu items
            .OrderBy(p => p.Name)          // Sort 1 triệu items
            .Take(10);                      // Rồi mới lấy 10
        
        return result;
        // Vấn đề: Out of memory, chậm, lãng phí bandwidth
    }

    // ✅ ĐÚNG - IQueryable chỉ lấy đúng data cần thiết
    public IQueryable<Product> GetExpensiveProducts_Good()
    {
        IQueryable<Product> products = _dbContext.Products;
        
        var result = products
            .Where(p => p.Price > 1000)    // WHERE clause
            .OrderBy(p => p.Name)          // ORDER BY clause
            .Take(10);                      // TOP 10
        
        // SQL: SELECT TOP 10 * FROM Products 
        //      WHERE Price > 1000 ORDER BY Name
        return result; // Chỉ 10 records!
    }
}`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Khi nào dùng cái nào?</h4>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Tình huống</th>
                      <th>Dùng gì</th>
                      <th>Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Query database (EF, Dapper)</td>
                      <td><code>IQueryable&lt;T&gt;</code></td>
                      <td>Database xử lý, hiệu quả hơn</td>
                    </tr>
                    <tr>
                      <td>Data trong memory (List, Array)</td>
                      <td><code>IEnumerable&lt;T&gt;</code></td>
                      <td>Không có database để query</td>
                    </tr>
                    <tr>
                      <td>Complex logic không SQL hóa được</td>
                      <td><code>IEnumerable&lt;T&gt;</code></td>
                      <td>SQL không support custom C# methods</td>
                    </tr>
                    <tr>
                      <td>Cần filter/sort trên DB</td>
                      <td><code>IQueryable&lt;T&gt;</code></td>
                      <td>Giảm data transfer, tận dụng index</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: List vs IEnumerable vs ICollection */}
        <section id="section2" className="guide-section">
          <h2 onClick={() => toggleSection(2)} className="section-title">
            2. List&lt;T&gt; vs IEnumerable&lt;T&gt; vs ICollection&lt;T&gt;
            <span className="toggle-icon">{activeSection === 2 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 2 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Hierarchy của Collections</h3>
                <div className="hierarchy-diagram">
                  <div className="hierarchy-level">IEnumerable&lt;T&gt; ← Interface cơ bản nhất</div>
                  <div className="hierarchy-arrow">↓ (extends)</div>
                  <div className="hierarchy-level">ICollection&lt;T&gt; ← Thêm Count, Add, Remove</div>
                  <div className="hierarchy-arrow">↓ (extends)</div>
                  <div className="hierarchy-level">IList&lt;T&gt; ← Thêm Index access [i], Insert</div>
                  <div className="hierarchy-arrow">↓ (implements)</div>
                  <div className="hierarchy-level">List&lt;T&gt; ← Concrete class, dynamic array</div>
                </div>
              </div>

              <div className="code-example">
                <h4>1. IEnumerable&lt;T&gt; - "Tôi có thể duyệt qua"</h4>
                <pre><code>{`public interface IEnumerable<T>
{
    IEnumerator<T> GetEnumerator(); // CHỈ có method này!
}

// Đặc điểm:
// ✓ Có thể foreach
// ✓ Deferred execution (lazy)
// ✓ Read-only, forward-only
// ✗ KHÔNG biết Count
// ✗ KHÔNG thể Add/Remove
// ✗ KHÔNG thể access [index]

IEnumerable<int> numbers = GetNumbers();
foreach (var num in numbers) { }  // ✓ OK
var count = numbers.Count();      // ✓ OK (iterate hết)
numbers.Add(5);                   // ✗ COMPILE ERROR
var first = numbers[0];           // ✗ COMPILE ERROR`}</code></pre>
              </div>

              <div className="code-example">
                <h4>2. ICollection&lt;T&gt; - "Collection có thể thay đổi"</h4>
                <pre><code>{`public interface ICollection<T> : IEnumerable<T>
{
    int Count { get; }        // Property, O(1)
    bool IsReadOnly { get; }
    void Add(T item);
    void Remove(T item);
    void Clear();
    bool Contains(T item);
}

// ✓ Mọi thứ của IEnumerable
// ✓ Biết Count ngay lập tức
// ✓ Có thể Add/Remove items
// ✗ Vẫn KHÔNG có index access [i]

ICollection<int> numbers = new List<int>();
numbers.Add(1);              // ✓ OK
var count = numbers.Count;   // ✓ OK - Property
var first = numbers[0];      // ✗ COMPILE ERROR`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Return Types Best Practices</h4>
                <pre><code>{`public class ProductService
{
    // ✅ BEST - Linh hoạt nhất
    public IEnumerable<Product> GetProducts()
    {
        return _dbContext.Products.Where(p => p.IsActive);
        // Caller tự quyết định .ToList(), .ToArray()
    }

    // ⚠️ OK - Guarantee có Count và Add/Remove
    public ICollection<Product> GetEditableProducts()
    {
        return new List<Product> { /* ... */ };
    }

    // ❌ BAD - Tight coupling
    public List<Product> GetProductsList()
    {
        return _dbContext.Products.ToList();
    }
}`}</code></pre>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Deferred Execution */}
        <section id="section3" className="guide-section">
          <h2 onClick={() => toggleSection(3)} className="section-title">
            3. Deferred Execution trong LINQ là gì?
            <span className="toggle-icon">{activeSection === 3 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 3 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Lý thuyết cơ bản</h3>
                <p><strong>Deferred Execution</strong> (Lazy Evaluation) = Query không chạy ngay khi định nghĩa, mà chỉ execute khi:</p>
                <ul>
                  <li><strong>Iterate</strong> qua kết quả (foreach, for)</li>
                  <li>Gọi <strong>materialization operators</strong>: ToList(), ToArray(), Count(), First(), etc.</li>
                </ul>
                
                <div className="operators-grid">
                  <div>
                    <h4>Deferred (Lazy) 🐌</h4>
                    <code>Where, Select, SelectMany, OrderBy, Skip, Take, GroupBy, Join, Distinct</code>
                  </div>
                  <div>
                    <h4>Immediate (Eager) ⚡</h4>
                    <code>ToList, ToArray, Count, First, Single, Any, Sum, Average</code>
                  </div>
                </div>
              </div>

              <div className="code-example">
                <h4>Cách hoạt động</h4>
                <pre><code>{`public void HowDeferredExecutionWorks()
{
    var numbers = new List<int> { 1, 2, 3, 4, 5 };
    
    // Query ĐƯỢC ĐỊNH NGHĨA - chưa chạy
    var query = numbers.Where(n => n > 2);
    
    Console.WriteLine("Query defined but NOT executed!");
    
    // Thay đổi source SAU KHI định nghĩa query
    numbers.Add(6);
    numbers.Add(7);
    
    // BÂY GIỜ mới execute
    foreach (var num in query) // ← EXECUTE TẠI ĐÂY
    {
        Console.WriteLine(num); // 3, 4, 5, 6, 7
    }
}`}</code></pre>
              </div>

              <div className="warning-box">
                <h4>⚠️ Vấn đề: Disposed Context</h4>
                <pre><code>{`// ❌ LỖI PHỔ BIẾN
public IEnumerable<User> GetActiveUsers_Wrong()
{
    using (var context = new AppDbContext())
    {
        return context.Users.Where(u => u.IsActive);
    } // ← DbContext bị DISPOSE!
    // Exception: "Cannot access a disposed object"
}

// ✅ CÁCH SỬA
public IEnumerable<User> GetActiveUsers_Fixed()
{
    using (var context = new AppDbContext())
    {
        return context.Users
            .Where(u => u.IsActive)
            .ToList(); // Execute NGAY
    }
}`}</code></pre>
              </div>

              <div className="warning-box">
                <h4>⚠️ Vấn đề: Multiple Enumeration</h4>
                <pre><code>{`// ❌ Execute nhiều lần - lãng phí
var query = GetExpensiveQuery();
if (query.Any())              // Execute lần 1
{
    var count = query.Count(); // Execute lần 2
    foreach (var item in query) // Execute lần 3
    {
    }
}

// ✅ Materialize ngay
var list = GetExpensiveQuery().ToList(); // Execute 1 lần
if (list.Any())
{
    var count = list.Count;
    foreach (var item in list)
    {
    }
}`}</code></pre>
              </div>
            </div>
          )}
        </section>

        {/* Section 4: First vs FirstOrDefault vs Single vs SingleOrDefault */}
        <section id="section4" className="guide-section">
          <h2 onClick={() => toggleSection(4)} className="section-title">
            4. First() vs FirstOrDefault() vs Single() vs SingleOrDefault()
            <span className="toggle-icon">{activeSection === 4 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 4 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Bảng so sánh hành vi</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>0 elements</th>
                      <th>1 element</th>
                      <th>2+ elements</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>First()</code></td>
                      <td className="error-cell">❌ Exception</td>
                      <td className="success-cell">✅ Return element</td>
                      <td className="success-cell">✅ Return first</td>
                    </tr>
                    <tr>
                      <td><code>FirstOrDefault()</code></td>
                      <td className="success-cell">✅ Return default(T)</td>
                      <td className="success-cell">✅ Return element</td>
                      <td className="success-cell">✅ Return first</td>
                    </tr>
                    <tr>
                      <td><code>Single()</code></td>
                      <td className="error-cell">❌ Exception</td>
                      <td className="success-cell">✅ Return element</td>
                      <td className="error-cell">❌ Exception</td>
                    </tr>
                    <tr>
                      <td><code>SingleOrDefault()</code></td>
                      <td className="success-cell">✅ Return default(T)</td>
                      <td className="success-cell">✅ Return element</td>
                      <td className="error-cell">❌ Exception</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="code-example">
                <h4>Khi nào dùng cái nào?</h4>
                <pre><code>{`public class UserService
{
    // ✅ FIRST - Có nhiều kết quả, chỉ cần 1
    public User GetAnyAdminUser()
    {
        return _context.Users
            .Where(u => u.Role == "Admin")
            .First();
        // SQL: SELECT TOP 1 * FROM Users WHERE Role = 'Admin'
    }

    // ✅ FIRSTORDEFAULT - Có thể không có kết quả
    public User? FindUserByEmail(string email)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == email);
        
        if (user == null)
        {
            return null; // Không tìm thấy
        }
        return user;
    }

    // ✅ SINGLE - Expect ĐÚNG 1 (unique constraint)
    public User GetUserById(int id)
    {
        return _context.Users.Single(u => u.Id == id);
        // 0 records → Exception: Data corrupted
        // 2+ records → Exception: Duplicate key!
    }

    // ✅ SINGLEORDEFAULT - Unique NHƯNG cho phép null
    public User? FindUserByUsername(string username)
    {
        return _context.Users
            .SingleOrDefault(u => u.Username == username);
        // 0 records → null (OK)
        // 1 record → user (OK)
        // 2+ records → Exception (constraint violated!)
    }
}`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Performance Note</h4>
                <p><code>Single()</code> phải scan HẾT collection để đảm bảo chỉ có 1 element → chậm hơn <code>First()</code></p>
                <p><code>First()</code> dừng ngay khi tìm thấy → nhanh hơn</p>
              </div>
            </div>
          )}
        </section>

        {/* Section 5: Query vs Method Syntax */}
        <section id="section5" className="guide-section">
          <h2 onClick={() => toggleSection(5)} className="section-title">
            5. LINQ Query Syntax vs Method Syntax - Performance?
            <span className="toggle-icon">{activeSection === 5 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 5 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Performance: HOÀN TOÀN GIỐNG NHAU ✓</h3>
                <p>Query syntax được compiler convert sang method syntax → IL code generated là IDENTICAL</p>
              </div>

              <div className="code-example">
                <h4>Query Syntax (SQL-like)</h4>
                <pre><code>{`var result = from user in users
             where user.Age > 18
             orderby user.Name
             select user.Name;`}</code></pre>

                <h4>Method Syntax (Lambda)</h4>
                <pre><code>{`var result = users
    .Where(user => user.Age > 18)
    .OrderBy(user => user.Name)
    .Select(user => user.Name);`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Khi nào dùng:</h4>
                <ul>
                  <li><strong>Query syntax</strong>: Complex joins, dễ đọc với nhiều table</li>
                  <li><strong>Method syntax</strong>: Majority cases, có nhiều operators hơn (Take, Skip, Distinct)</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Section 6: Lazy Loading vs Eager Loading */}
        <section id="section6" className="guide-section">
          <h2 onClick={() => toggleSection(6)} className="section-title">
            6. Lazy Loading vs Eager Loading trong LINQ to SQL/EF
            <span className="toggle-icon">{activeSection === 6 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 6 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Lý thuyết cơ bản</h3>
                <div className="comparison-grid">
                  <div className="comparison-item">
                    <h4>Lazy Loading 🐌</h4>
                    <ul>
                      <li>Load related data <strong>khi access</strong> property</li>
                      <li>Sử dụng <code>virtual</code> keyword</li>
                      <li>Tự động query database khi cần</li>
                      <li>Dễ gây <strong>N+1 problem</strong></li>
                      <li>Mỗi navigation property = 1 query riêng</li>
                    </ul>
                  </div>
                  <div className="comparison-item">
                    <h4>Eager Loading ⚡</h4>
                    <ul>
                      <li>Load ALL data <strong>ngay từ đầu</strong></li>
                      <li>Sử dụng <code>.Include()</code></li>
                      <li>JOIN tables trong 1 query duy nhất</li>
                      <li>Tránh được N+1 problem</li>
                      <li>Performance tốt hơn (thường)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="code-example">
                <h4>Model Definition</h4>
                <pre><code>{`public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // 'virtual' enables lazy loading
    public virtual List<Order> Orders { get; set; }
    public virtual Address Address { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public decimal Total { get; set; }
    public virtual List<OrderItem> OrderItems { get; set; }
}`}</code></pre>
              </div>

              <div className="warning-box">
                <h4>⚠️ Lazy Loading - N+1 Problem</h4>
                <pre><code>{`// ❌ BAD - N+1 Problem
public void LazyLoadingProblem()
{
    var customers = dbContext.Customers.ToList(); // 1 query
    
    foreach (var customer in customers) // N customers
    {
        // Mỗi lần access Orders → 1 query mới!
        Console.WriteLine(customer.Orders.Count); // N queries
    }
    
    // Total: 1 + N queries
    // 100 customers = 101 queries! 💀
    
    // SQL executed:
    // 1. SELECT * FROM Customers
    // 2. SELECT * FROM Orders WHERE CustomerId = 1
    // 3. SELECT * FROM Orders WHERE CustomerId = 2
    // 4. SELECT * FROM Orders WHERE CustomerId = 3
    // ... 100 more queries!
}`}</code></pre>
              </div>

              <div className="code-example">
                <h4>✅ Eager Loading - Giải pháp</h4>
                <pre><code>{`public void EagerLoadingFixed()
{
    var customers = dbContext.Customers
        .Include(c => c.Orders)  // Load Orders cùng lúc
        .ToList();
    
    // Chỉ 1 query với JOIN!
    // SQL: SELECT * FROM Customers c 
    //      LEFT JOIN Orders o ON c.Id = o.CustomerId
    
    foreach (var customer in customers)
    {
        Console.WriteLine(customer.Orders.Count); // No extra query
    }
}

// Multiple levels
public void MultiLevelEagerLoading()
{
    var customers = dbContext.Customers
        .Include(c => c.Orders)
            .ThenInclude(o => o.OrderItems) // Nested include
        .Include(c => c.Address)             // Multiple includes
        .ToList();
    
    // 1 query với multiple JOINs
}

// Filtered include (EF Core 5+)
public void FilteredInclude()
{
    var customers = dbContext.Customers
        .Include(c => c.Orders.Where(o => o.Total > 1000))
        .ToList();
}`}</code></pre>
              </div>

              <div className="code-example">
                <h4>Explicit Loading - Middle Ground</h4>
                <pre><code>{`public void ExplicitLoading()
{
    var customer = dbContext.Customers.First();
    
    // Load khi cần, nhưng manual
    dbContext.Entry(customer)
        .Collection(c => c.Orders)
        .Load();
    
    // Load reference (1-to-1)
    dbContext.Entry(customer)
        .Reference(c => c.Address)
        .Load();
    
    // Filtered explicit load
    dbContext.Entry(customer)
        .Collection(c => c.Orders)
        .Query()
        .Where(o => o.Total > 100)
        .Load();
}`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Khi nào dùng cái nào?</h4>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Strategy</th>
                      <th>Khi nào dùng</th>
                      <th>Ưu điểm</th>
                      <th>Nhược điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Eager Loading</strong></td>
                      <td>Biết trước cần related data</td>
                      <td>1 query, tránh N+1</td>
                      <td>Load nhiều data không cần thiết</td>
                    </tr>
                    <tr>
                      <td><strong>Lazy Loading</strong></td>
                      <td>Hiếm khi dùng (legacy code)</td>
                      <td>Tiện, tự động</td>
                      <td>N+1 problem, khó debug</td>
                    </tr>
                    <tr>
                      <td><strong>Explicit Loading</strong></td>
                      <td>Load on-demand, conditional</td>
                      <td>Full control</td>
                      <td>Phải viết code thêm</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{marginTop: '20px'}}>Best Practice: Disable Lazy Loading</h4>
                <pre><code>{`// In DbContext
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseLazyLoadingProxies(false); // Disable lazy loading
}

// Force developers to use Include() explicitly
// Prevents accidental N+1 problems`}</code></pre>
              </div>
            </div>
          )}
        </section>

        {/* Section 7: Select vs SelectMany */}
        <section id="section7" className="guide-section">
          <h2 onClick={() => toggleSection(7)} className="section-title">
            7. Select vs SelectMany
            <span className="toggle-icon">{activeSection === 7 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 7 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Sự khác biệt cốt lõi</h3>
                <div className="comparison-grid">
                  <div className="comparison-item">
                    <h4>Select - Transform 1-to-1</h4>
                    <ul>
                      <li>Transform từng element</li>
                      <li>Input: <code>IEnumerable&lt;T&gt;</code></li>
                      <li>Output: <code>IEnumerable&lt;TResult&gt;</code></li>
                      <li>Giữ nguyên structure (nested nếu có)</li>
                      <li>Ví dụ: Transform User → UserDTO</li>
                    </ul>
                  </div>
                  <div className="comparison-item">
                    <h4>SelectMany - Flatten 1-to-Many</h4>
                    <ul>
                      <li>Flatten nested collections</li>
                      <li>Input: <code>IEnumerable&lt;IEnumerable&lt;T&gt;&gt;</code></li>
                      <li>Output: <code>IEnumerable&lt;T&gt;</code> (flat)</li>
                      <li>Giống SQL JOIN</li>
                      <li>Ví dụ: All products from all categories</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="code-example">
                <h4>Visual Comparison</h4>
                <pre><code>{`// Data
var schools = new List<School>
{
    new School 
    { 
        Name = "School A",
        Students = new[] { "John", "Jane" }
    },
    new School 
    { 
        Name = "School B",
        Students = new[] { "Bob", "Alice" }
    }
};

// SELECT - Returns nested structure
var selectResult = schools.Select(s => s.Students);
// Type: IEnumerable<IEnumerable<string>>
// Result: [["John", "Jane"], ["Bob", "Alice"]]
//         ↑ Nested arrays

foreach (var schoolStudents in selectResult)
{
    foreach (var student in schoolStudents) // Need 2 loops
    {
        Console.WriteLine(student);
    }
}

// SELECTMANY - Returns flat structure
var selectManyResult = schools.SelectMany(s => s.Students);
// Type: IEnumerable<string>
// Result: ["John", "Jane", "Bob", "Alice"]
//         ↑ Flat array

foreach (var student in selectManyResult) // 1 loop only
{
    Console.WriteLine(student);
}`}</code></pre>
              </div>

              <div className="code-example">
                <h4>Real-World Examples</h4>
                <pre><code>{`// Example 1: E-commerce
var orders = new List<Order>
{
    new Order 
    { 
        Id = 1,
        Items = new[]
        {
            new Item { Name = "Laptop", Price = 1000 },
            new Item { Name = "Mouse", Price = 50 }
        }
    },
    new Order 
    { 
        Id = 2,
        Items = new[]
        {
            new Item { Name = "Keyboard", Price = 100 }
        }
    }
};

// Get all items from all orders
var allItems = orders.SelectMany(o => o.Items);
// Result: [Laptop, Mouse, Keyboard]

var totalRevenue = orders
    .SelectMany(o => o.Items)
    .Sum(item => item.Price);
// 1000 + 50 + 100 = 1150

// Example 2: With projection (keep order info)
var itemsWithOrderId = orders.SelectMany(
    order => order.Items,
    (order, item) => new
    {
        OrderId = order.Id,
        ItemName = item.Name,
        Price = item.Price
    }
);
// Result:
// [
//   { OrderId: 1, ItemName: "Laptop", Price: 1000 },
//   { OrderId: 1, ItemName: "Mouse", Price: 50 },
//   { OrderId: 2, ItemName: "Keyboard", Price: 100 }
// ]`}</code></pre>
              </div>

              <div className="code-example">
                <h4>String Example</h4>
                <pre><code>{`var words = new[] { "Hello", "World" };

// Select - IEnumerable<char[]>
var selectChars = words.Select(w => w.ToCharArray());
// Result: [['H','e','l','l','o'], ['W','o','r','l','d']]
// Type: IEnumerable<char[]>

// SelectMany - IEnumerable<char>
var selectManyChars = words.SelectMany(w => w.ToCharArray());
// Result: ['H','e','l','l','o','W','o','r','l','d']
// Type: IEnumerable<char>

var joined = new string(selectManyChars.ToArray());
// "HelloWorld"`}</code></pre>
              </div>

              <div className="code-example">
                <h4>Database Example - JOIN equivalent</h4>
                <pre><code>{`// Traditional JOIN with Select
var categoryProducts = dbContext.Categories
    .Select(c => new
    {
        Category = c.Name,
        Products = c.Products // Still nested!
    });
// Result: Nested structure - need foreach loop

// SelectMany - Flatten like SQL JOIN
var allProducts = dbContext.Categories
    .SelectMany(
        category => category.Products,
        (category, product) => new
        {
            CategoryName = category.Name,
            ProductName = product.Name,
            Price = product.Price
        }
    );
// Result: Flat list of all products with category info
// Giống: SELECT c.Name, p.Name, p.Price 
//        FROM Categories c 
//        JOIN Products p ON c.Id = p.CategoryId`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>When to use what?</h4>
                <ul>
                  <li><strong>Select</strong>: Transform objects, maintain structure, projection</li>
                  <li><strong>SelectMany</strong>: Flatten nested collections, JOIN-like operations, get all items from multiple sources</li>
                </ul>
                
                <h4 style={{marginTop: '15px'}}>Quick Rule:</h4>
                <p>Nếu kết quả cần <strong>flat list</strong> từ nested collections → dùng <code>SelectMany</code></p>
                <p>Nếu chỉ cần <strong>transform</strong> từng item → dùng <code>Select</code></p>
              </div>
            </div>
          )}
        </section>

        {/* Section 8: Any vs Count */}
        <section id="section8" className="guide-section">
          <h2 onClick={() => toggleSection(8)} className="section-title">
            8. Any() vs Count() &gt; 0 - Performance?
            <span className="toggle-icon">{activeSection === 8 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 8 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Any() luôn tốt hơn ⚡</h3>
                <p><code>Any()</code> dừng ngay khi tìm thấy 1 element</p>
                <p><code>Count()</code> phải đếm HẾT tất cả elements</p>
              </div>

              <div className="code-example">
                <h4>Benchmark: 1 million items</h4>
                <pre><code>{`var numbers = Enumerable.Range(1, 1_000_000);

// Count() > 0 - BAD: ~15 ms
if (numbers.Count() > 0) { }

// Any() - GOOD: ~0.001 ms (15,000x faster!)
if (numbers.Any()) { }

// Database
// ✗ BAD: SELECT COUNT(*) FROM Users
if (dbContext.Users.Count() > 0) { }

// ✓ GOOD: SELECT TOP 1 FROM Users
if (dbContext.Users.Any()) { }`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Rule of thumb:</h4>
                <ul>
                  <li>Kiểm tra <strong>có hay không</strong>: Dùng <code>Any()</code></li>
                  <li>Cần <strong>số lượng cụ thể</strong>: Dùng <code>Count()</code></li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Section 9: Custom LINQ Operators */}
        <section id="section9" className="guide-section">
          <h2 onClick={() => toggleSection(9)} className="section-title">
            9. Implement Custom LINQ Operator
            <span className="toggle-icon">{activeSection === 9 ? '−' : '+'}</span>
          </h2>
          
          {(activeSection === 9 || activeSection === null) && (
            <div className="section-content">
              <div className="theory-box">
                <h3>Lý thuyết</h3>
                <p>Custom LINQ operators = <strong>Extension methods</strong> trên <code>IEnumerable&lt;T&gt;</code></p>
                <ul>
                  <li>Phải là static class và static method</li>
                  <li>Parameter đầu tiên có <code>this</code> keyword</li>
                  <li>Dùng <code>yield return</code> cho deferred execution</li>
                  <li>Always validate parameters (null checks)</li>
                  <li>Follow LINQ naming conventions</li>
                </ul>
              </div>

              <div className="code-example">
                <h4>1. WhereNot - Inverse of Where</h4>
                <pre><code>{`public static class CustomLinqExtensions
{
    public static IEnumerable<T> WhereNot<T>(
        this IEnumerable<T> source,
        Func<T, bool> predicate)
    {
        if (source == null) 
            throw new ArgumentNullException(nameof(source));
        if (predicate == null) 
            throw new ArgumentNullException(nameof(predicate));
        
        foreach (var item in source)
        {
            if (!predicate(item)) // Inverse logic
            {
                yield return item;
            }
        }
    }
}

// Usage
var numbers = new[] { 1, 2, 3, 4, 5 };
var result = numbers.WhereNot(n => n > 3);
// Result: [1, 2, 3]

// Instead of:
var result2 = numbers.Where(n => !(n > 3));`}</code></pre>
              </div>

              <div className="code-example">
                <h4>2. Batch - Chunk items into groups</h4>
                <pre><code>{`public static IEnumerable<IEnumerable<T>> Batch<T>(
    this IEnumerable<T> source,
    int batchSize)
{
    if (source == null) 
        throw new ArgumentNullException(nameof(source));
    if (batchSize <= 0) 
        throw new ArgumentException("Batch size must be positive");
    
    var batch = new List<T>(batchSize);
    
    foreach (var item in source)
    {
        batch.Add(item);
        
        if (batch.Count == batchSize)
        {
            yield return batch;
            batch = new List<T>(batchSize);
        }
    }
    
    // Return remaining items
    if (batch.Count > 0)
    {
        yield return batch;
    }
}

// Usage
var numbers = Enumerable.Range(1, 10);
var batches = numbers.Batch(3);
// Result: [[1,2,3], [4,5,6], [7,8,9], [10]]

foreach (var batch in batches)
{
    Console.WriteLine(string.Join(", ", batch));
}
// Output:
// 1, 2, 3
// 4, 5, 6
// 7, 8, 9
// 10`}</code></pre>
              </div>

              <div className="code-example">
                <h4>3. DistinctBy - Distinct by property (before .NET 6)</h4>
                <pre><code>{`public static IEnumerable<T> DistinctBy<T, TKey>(
    this IEnumerable<T> source,
    Func<T, TKey> keySelector)
{
    if (source == null) 
        throw new ArgumentNullException(nameof(source));
    if (keySelector == null) 
        throw new ArgumentNullException(nameof(keySelector));
    
    var seenKeys = new HashSet<TKey>();
    
    foreach (var item in source)
    {
        var key = keySelector(item);
        if (seenKeys.Add(key)) // Add returns false if exists
        {
            yield return item;
        }
    }
}

// Usage
var users = new[]
{
    new User { Id = 1, Email = "john@mail.com" },
    new User { Id = 2, Email = "jane@mail.com" },
    new User { Id = 3, Email = "john@mail.com" } // Duplicate
};

var uniqueUsers = users.DistinctBy(u => u.Email);
// Returns first 2 users only

// .NET 6+ has built-in DistinctBy:
var result = users.DistinctBy(u => u.Email);`}</code></pre>
              </div>

              <div className="code-example">
                <h4>4. ForEach - Execute action on each item</h4>
                <pre><code>{`public static void ForEach<T>(
    this IEnumerable<T> source,
    Action<T> action)
{
    if (source == null) 
        throw new ArgumentNullException(nameof(source));
    if (action == null) 
        throw new ArgumentNullException(nameof(action));
    
    foreach (var item in source)
    {
        action(item);
    }
}

// Usage
var numbers = new[] { 1, 2, 3, 4, 5 };
numbers.ForEach(n => Console.WriteLine(n * 2));
// Output: 2, 4, 6, 8, 10

// Note: List<T> already has ForEach method
var list = new List<int> { 1, 2, 3 };
list.ForEach(n => Console.WriteLine(n)); // Built-in`}</code></pre>
              </div>

              <div className="code-example">
                <h4>5. MaxBy/MinBy (before .NET 6)</h4>
                <pre><code>{`public static T MaxBy<T, TKey>(
    this IEnumerable<T> source,
    Func<T, TKey> keySelector) 
    where TKey : IComparable<TKey>
{
    if (source == null) 
        throw new ArgumentNullException(nameof(source));
    if (keySelector == null) 
        throw new ArgumentNullException(nameof(keySelector));
    
    using var enumerator = source.GetEnumerator();
    
    if (!enumerator.MoveNext())
    {
        throw new InvalidOperationException("Sequence contains no elements");
    }
    
    var max = enumerator.Current;
    var maxKey = keySelector(max);
    
    while (enumerator.MoveNext())
    {
        var current = enumerator.Current;
        var currentKey = keySelector(current);
        
        if (currentKey.CompareTo(maxKey) > 0)
        {
            max = current;
            maxKey = currentKey;
        }
    }
    
    return max;
}

// Usage
var products = new[]
{
    new Product { Name = "Laptop", Price = 1000 },
    new Product { Name = "Mouse", Price = 50 },
    new Product { Name = "Monitor", Price = 500 }
};

var mostExpensive = products.MaxBy(p => p.Price);
// Returns Laptop

var cheapest = products.MinBy(p => p.Price);
// Returns Mouse`}</code></pre>
              </div>

              <div className="code-example">
                <h4>6. Pipe - Chainable side effects (for debugging)</h4>
                <pre><code>{`public static IEnumerable<T> Pipe<T>(
    this IEnumerable<T> source,
    Action<T> action)
{
    if (source == null) 
        throw new ArgumentNullException(nameof(source));
    if (action == null) 
        throw new ArgumentNullException(nameof(action));
    
    foreach (var item in source)
    {
        action(item);
        yield return item; // Continue the chain
    }
}

// Usage - Great for debugging LINQ chains
var result = Enumerable.Range(1, 5)
    .Where(n => n > 2)
    .Pipe(n => Console.WriteLine($"After Where: {n}"))
    .Select(n => n * 2)
    .Pipe(n => Console.WriteLine($"After Select: {n}"))
    .ToList();

// Output:
// After Where: 3
// After Select: 6
// After Where: 4
// After Select: 8
// After Where: 5
// After Select: 10`}</code></pre>
              </div>

              <div className="code-example">
                <h4>7. WithRetry - Retry logic for database queries</h4>
                <pre><code>{`public static IEnumerable<T> WithRetry<T>(
    this IEnumerable<T> source,
    int maxRetries = 3,
    TimeSpan delay = default)
{
    if (delay == default)
        delay = TimeSpan.FromSeconds(1);
    
    int retries = 0;
    
    while (retries <= maxRetries)
    {
        using var enumerator = source.GetEnumerator();
        
        try
        {
            while (enumerator.MoveNext())
            {
                yield return enumerator.Current;
            }
            
            yield break; // Success, exit
        }
        catch (Exception ex) when (retries < maxRetries)
        {
            retries++;
            Console.WriteLine($"Retry {retries}/{maxRetries}: {ex.Message}");
            System.Threading.Thread.Sleep(delay);
        }
    }
}

// Usage
var data = dbContext.Products
    .Where(p => p.IsActive)
    .WithRetry(maxRetries: 3, delay: TimeSpan.FromSeconds(2))
    .ToList();`}</code></pre>
              </div>

              <div className="best-practices">
                <h4>Key Points khi implement custom operators:</h4>
                <ul>
                  <li>✅ Use <code>yield return</code> for deferred execution</li>
                  <li>✅ Always validate parameters (null checks)</li>
                  <li>✅ Follow LINQ naming conventions (Where, Select, etc.)</li>
                  <li>✅ Return <code>IEnumerable&lt;T&gt;</code> for chaining</li>
                  <li>✅ Use generic types for flexibility</li>
                  <li>✅ Document with XML comments</li>
                  <li>❌ Don't modify source collection</li>
                  <li>❌ Don't materialize unless necessary (avoid .ToList() inside)</li>
                </ul>
              </div>

              <div className="theory-box">
                <h4>Complete Example - Production Ready</h4>
                <pre><code>{`/// <summary>
/// Returns distinct elements based on a key selector.
/// </summary>
/// <typeparam name="T">The type of elements</typeparam>
/// <typeparam name="TKey">The type of key</typeparam>
/// <param name="source">Source sequence</param>
/// <param name="keySelector">Key selector function</param>
/// <returns>Distinct elements by key</returns>
/// <exception cref="ArgumentNullException">
/// Thrown when source or keySelector is null
/// </exception>
public static IEnumerable<T> DistinctBy<T, TKey>(
    this IEnumerable<T> source,
    Func<T, TKey> keySelector)
{
    if (source == null)
        throw new ArgumentNullException(
            nameof(source), 
            "Source cannot be null");
    
    if (keySelector == null)
        throw new ArgumentNullException(
            nameof(keySelector), 
            "Key selector cannot be null");
    
    return DistinctByIterator(source, keySelector);
}

// Separate iterator for proper deferred execution
private static IEnumerable<T> DistinctByIterator<T, TKey>(
    IEnumerable<T> source,
    Func<T, TKey> keySelector)
{
    var seenKeys = new HashSet<TKey>();
    
    foreach (var item in source)
    {
        var key = keySelector(item);
        if (seenKeys.Add(key))
        {
            yield return item;
        }
    }
}`}</code></pre>
              </div>
            </div>
          )}
        </section>

      </main>

      <footer className="guide-footer">
        <p>💡 Chúc bạn phỏng vấn tốt! Nhớ hiểu rõ nguyên lý hơn là học thuộc.</p>
      </footer>
    </div>
  );
};

export default LinqInterviewGuide;