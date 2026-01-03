import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const CSharpAdditionalQuestions = () => {
  return (
    <div className="csharp-container">
      <Collapse accordion defaultActiveKey={['1']}>
        
        <Panel header="8. Anonymous types và dynamic type khác nhau ra sao?" key="8">
          <div className="question-content">
            <h3>Anonymous Types:</h3>
            <ul>
              <li>Xác định kiểu lúc <strong>compile-time</strong></li>
              <li>Dùng với <code>var</code>, có IntelliSense</li>
              <li>Properties <strong>read-only</strong></li>
              <li>Type-safe, compiler bắt lỗi</li>
            </ul>
            
            <pre><code>{`var person = new { Name = "John", Age = 30 };
Console.WriteLine(person.Name); // Có IntelliSense
// person.Age = 31; // Lỗi: read-only`}</code></pre>
            
            <h3>Dynamic Type:</h3>
            <ul>
              <li>Xác định kiểu lúc <strong>runtime</strong></li>
              <li>Không có IntelliSense</li>
              <li>Properties <strong>có thể thay đổi</strong></li>
              <li>Lỗi chỉ phát hiện khi chạy</li>
            </ul>
            
            <pre><code>{`dynamic person = new ExpandoObject();
person.Name = "John";
person.Age = 30;
person.Age = 31; // OK - có thể thay đổi
person.Salary = 50000; // OK - thêm property mới`}</code></pre>
            
            <h3>So sánh trực tiếp:</h3>
            <pre><code>{`// Anonymous type
var anon = new { Name = "Alice", Age = 25 };
// anon.Age = 26; // LỖI compile-time
// anon.Salary = 60000; // LỖI compile-time

// Dynamic type
dynamic dyn = new ExpandoObject();
dyn.Name = "Alice";
dyn.Age = 25;
dyn.Age = 26; // OK
dyn.Salary = 60000; // OK - thêm mới
dyn.NonExistent(); // Lỗi runtime`}</code></pre>
            
            <div className="info-box">
              <h4>Khi nào dùng:</h4>
              <ul>
                <li><strong>Anonymous types:</strong> LINQ queries, temporary data projection</li>
                <li><strong>Dynamic type:</strong> COM objects, JSON deserialization, reflection</li>
              </ul>
            </div>
          </div>
        </Panel>

        <Panel header="9. Expression-bodied members là gì? Khi nào nên dùng?" key="9">
          <div className="question-content">
            <p>Cú pháp ngắn gọn dùng <code>=&gt;</code> thay cho block <code>{}</code></p>
            
            <h3>Các loại expression-bodied members:</h3>
            <pre><code>{`public class Person
{
    private string _name;
    private int _age;
    
    // Constructor (C# 7.0)
    public Person(string name, int age) => (_name, _age) = (name, age);
    
    // Property getter (C# 6.0)
    public string Name => _name;
    
    // Property với get/set (C# 7.0)
    public int Age
    {
        get => _age;
        set => _age = value < 0 ? 0 : value;
    }
    
    // Method (C# 6.0)
    public string GetInfo() => $"{_name} is {_age} years old";
    
    // Readonly property
    public bool IsAdult => _age >= 18;
    
    // Indexer (C# 7.0)
    public string this[int index] => index == 0 ? _name : _age.ToString();
}`}</code></pre>
            
            <h3>So sánh cú pháp:</h3>
            <pre><code>{`// Truyền thống
public string GetFullName()
{
    return $"{FirstName} {LastName}";
}

// Expression-bodied - ngắn gọn
public string GetFullName() => $"{FirstName} {LastName}";

// Property computed
public bool IsValid => Age > 0 && !string.IsNullOrEmpty(Name);`}</code></pre>
            
            <div className="success-box">
              <h4>✅ Nên dùng khi:</h4>
              <ul>
                <li>Logic đơn giản, 1 dòng</li>
                <li>Computed properties</li>
                <li>Simple transformations</li>
                <li>Code ngắn gọn (&lt; 80-100 ký tự)</li>
              </ul>
            </div>
            
            <div className="warning-box">
              <h4>❌ Không nên dùng khi:</h4>
              <ul>
                <li>Logic phức tạp, nhiều statements</li>
                <li>Cần debugging (khó đặt breakpoint)</li>
                <li>Có exception handling</li>
                <li>Code quá dài khó đọc</li>
              </ul>
            </div>
            
            <pre><code>{`// TỐT: Đơn giản, rõ ràng
public decimal TotalPrice => Price * Quantity;
public bool IsExpired => ExpiryDate < DateTime.Now;

// KHÔNG TỐT: Quá phức tạp, nên viết block
public bool IsValid => !string.IsNullOrEmpty(Name) 
    && Age > 0 && Age < 150 
    && Email.Contains("@") 
    && Phone.Length == 10;`}</code></pre>
          </div>
        </Panel>

        <Panel header="10. Pattern matching trong C# (từ C# 7.0 trở đi)" key="10">
          <div className="question-content">
            <p>Kiểm tra và trích xuất dữ liệu từ objects dựa trên cấu trúc, kiểu, hoặc giá trị</p>
            
            <h3>Type Pattern (C# 7.0):</h3>
            <pre><code>{`object obj = "Hello";

// Cách cũ
if (obj is string)
{
    string str = (string)obj;
    Console.WriteLine(str.Length);
}

// Pattern matching - gọn hơn
if (obj is string str)
{
    Console.WriteLine(str.Length); // str đã được cast
}`}</code></pre>
            
            <h3>Switch Expression (C# 8.0):</h3>
            <pre><code>{`// Switch truyền thống
string GetDescription(Shape shape)
{
    switch (shape)
    {
        case Circle c:
            return $"Circle radius {c.Radius}";
        case Rectangle r:
            return $"Rectangle {r.Width}x{r.Height}";
        default:
            return "Unknown";
    }
}

// Switch expression - ngắn gọn
string GetDescription(Shape shape) => shape switch
{
    Circle c => $"Circle radius {c.Radius}",
    Rectangle r => $"Rectangle {r.Width}x{r.Height}",
    _ => "Unknown"
};`}</code></pre>
            
            <h3>Property Pattern (C# 8.0):</h3>
            <pre><code>{`public record Person(string Name, int Age, string City);

string GetDiscount(Person person) => person switch
{
    { Age: < 18 } => "Child discount",
    { Age: >= 65 } => "Senior discount",
    { City: "Hanoi" } => "Local discount",
    _ => "Regular price"
};

// Kết hợp nhiều properties
decimal CalculateShipping(Order order) => order switch
{
    { Total: > 100, Location: "Domestic" } => 0,
    { Total: > 50, Location: "Domestic" } => 5,
    { Location: "International", Weight: < 1 } => 15,
    { Location: "International" } => 30,
    _ => 10
};`}</code></pre>
            
            <h3>Relational Pattern (C# 9.0):</h3>
            <pre><code>{`string GetTemp(int temp) => temp switch
{
    < 0 => "Freezing",
    >= 0 and < 10 => "Cold",
    >= 10 and < 20 => "Cool",
    >= 20 and < 30 => "Warm",
    >= 30 => "Hot"
};

// Logical patterns
bool IsValidAge(int age) => age is >= 18 and < 65;
bool IsWeekend(DayOfWeek day) => day is DayOfWeek.Saturday or DayOfWeek.Sunday;
bool IsNotNull(object obj) => obj is not null;`}</code></pre>
            
            <h3>List Pattern (C# 11.0):</h3>
            <pre><code>{`string CheckArray(int[] arr) => arr switch
{
    [] => "Empty",
    [var single] => $"Single: {single}",
    [var first, var second] => $"Two: {first}, {second}",
    [var first, .., var last] => $"First: {first}, Last: {last}",
    [1, 2, .. var rest] => $"Starts 1,2 + {rest.Length} more",
    _ => "Other"
};`}</code></pre>
            
            <h3>Ứng dụng thực tế:</h3>
            <pre><code>{`// Validation
public string ValidateUser(User user) => user switch
{
    null => "User is null",
    { Email: null or "" } => "Email required",
    { Email: var e } when !e.Contains("@") => "Invalid email",
    { Age: < 0 } => "Age cannot be negative",
    { Age: < 18, HasParentalConsent: false } => "Need consent",
    _ => "Valid"
};

// API responses
string HandleResponse(HttpResponseMessage response) => response switch
{
    { StatusCode: HttpStatusCode.OK, Content: not null } => "Success",
    { StatusCode: HttpStatusCode.NotFound } => "Not found",
    { StatusCode: HttpStatusCode.Unauthorized } => "Auth required",
    { StatusCode: >= HttpStatusCode.BadRequest 
        and < HttpStatusCode.InternalServerError } => "Client error",
    { StatusCode: >= HttpStatusCode.InternalServerError } => "Server error",
    _ => "Unknown"
};`}</code></pre>
            
            <div className="success-box">
              <h4>✅ Lợi ích:</h4>
              <ul>
                <li>Code ngắn gọn, dễ đọc</li>
                <li>Giảm boilerplate (casting, null checking)</li>
                <li>Type-safe, compiler kiểm tra</li>
                <li>Dễ maintain và mở rộng</li>
              </ul>
            </div>
          </div>
        </Panel>

      </Collapse>
    </div>
  );
};

export default CSharpAdditionalQuestions;