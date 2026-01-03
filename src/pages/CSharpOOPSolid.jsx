import React, { useState } from 'react';
import './CSharpFundamentals.css';

const CSharpOOPSolid = () => {
  const [activeKey, setActiveKey] = useState(null);

  const togglePanel = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  return (
    <div className="csharp-container">
      <header className="csharp-header">
        <h1>🎯 C# OOP & SOLID Principles</h1>
        <p>Câu hỏi phỏng vấn về lập trình hướng đối tượng</p>
      </header>
      
      <main className="csharp-main">
        <div className="collapse-container">
          
          {/* Panel 1 */}
          <div className="panel">
            <div 
              className={`panel-header ${activeKey === '1' ? 'active' : ''}`}
              onClick={() => togglePanel('1')}
            >
              1. Giải thích 4 tính chất của OOP với ví dụ thực tế
              <span className="arrow">{activeKey === '1' ? '▼' : '▶'}</span>
            </div>
            {activeKey === '1' && (
              <div className="question-content">
                
                <h3>1. Encapsulation (Đóng gói):</h3>
                <p>Ẩn dữ liệu nội bộ, chỉ expose qua methods/properties</p>
                
                <pre><code>{`public class BankAccount
{
    private decimal _balance;
    private string _accountNumber;
    
    public BankAccount(string accountNumber)
    {
        _accountNumber = accountNumber;
        _balance = 0;
    }
    
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");
        _balance += amount;
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount <= 0 || amount > _balance)
            return false;
        _balance -= amount;
        return true;
    }
    
    public decimal Balance => _balance;
}`}</code></pre>
                
                <div className="success-box">
                  <h4>✅ Lợi ích:</h4>
                  <ul>
                    <li>Bảo vệ dữ liệu khỏi thay đổi không hợp lệ</li>
                    <li>Dễ maintain - thay đổi internal logic không ảnh hưởng bên ngoài</li>
                    <li>Validation tập trung</li>
                  </ul>
                </div>
                
                <h3>2. Inheritance (Kế thừa):</h3>
                <p>Class con kế thừa properties/methods từ class cha</p>
                
                <pre><code>{`public class Employee
{
    public string Name { get; set; }
    public decimal BaseSalary { get; set; }
    
    public virtual decimal CalculateSalary()
    {
        return BaseSalary;
    }
}

public class Manager : Employee
{
    public decimal Bonus { get; set; }
    
    public override decimal CalculateSalary()
    {
        return BaseSalary + Bonus;
    }
}`}</code></pre>
                
                <h3>3. Polymorphism (Đa hình):</h3>
                <p>Một interface, nhiều implementations</p>
                
                <pre><code>{`public abstract class Shape
{
    public abstract double CalculateArea();
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public override double CalculateArea()
    {
        return Width * Height;
    }
}`}</code></pre>
                
                <h3>4. Abstraction (Trừu tượng):</h3>
                <p>Ẩn chi tiết phức tạp, chỉ show những gì cần thiết</p>
                
                <pre><code>{`public interface IPaymentProcessor
{
    bool ProcessPayment(decimal amount);
    string GetTransactionId();
}

public class CreditCardProcessor : IPaymentProcessor
{
    private string _cardNumber;
    
    public bool ProcessPayment(decimal amount)
    {
        ValidateCard();
        ConnectToGateway();
        ChargeCard(amount);
        return true;
    }
    
    public string GetTransactionId()
    {
        return Guid.NewGuid().ToString();
    }
    
    private void ValidateCard() { }
    private void ConnectToGateway() { }
    private void ChargeCard(decimal amount) { }
}`}</code></pre>
              </div>
            )}
          </div>

          {/* Panel 2 */}
          <div className="panel">
            <div 
              className={`panel-header ${activeKey === '2' ? 'active' : ''}`}
              onClick={() => togglePanel('2')}
            >
              2. SOLID principles là gì? Cho ví dụ vi phạm và cách khắc phục
              <span className="arrow">{activeKey === '2' ? '▼' : '▶'}</span>
            </div>
            {activeKey === '2' && (
              <div className="question-content">
                
                <h3>S - Single Responsibility Principle</h3>
                <p>Một class chỉ nên có một lý do để thay đổi</p>
                
                <pre><code>{`// ❌ VI PHẠM
public class User
{
    public string Name { get; set; }
    public bool IsValid() { }
    public void Save() { }
    public void SendEmail() { }
}

// ✅ KHẮC PHỤC
public class User
{
    public string Name { get; set; }
}

public class UserValidator
{
    public bool Validate(User user) { }
}

public class UserRepository
{
    public void Save(User user) { }
}

public class EmailService
{
    public void SendEmail(User user) { }
}`}</code></pre>
                
                <h3>O - Open/Closed Principle</h3>
                <p>Open for extension, closed for modification</p>
                
                <pre><code>{`// ❌ VI PHẠM
public class PaymentProcessor
{
    public void Process(string type, decimal amount)
    {
        if (type == "creditcard") { }
        else if (type == "paypal") { }
    }
}

// ✅ KHẮC PHỤC
public interface IPaymentMethod
{
    void Process(decimal amount);
}

public class CreditCardPayment : IPaymentMethod
{
    public void Process(decimal amount) { }
}

public class PayPalPayment : IPaymentMethod
{
    public void Process(decimal amount) { }
}`}</code></pre>
                
                <h3>L - Liskov Substitution Principle</h3>
                <p>Derived class phải thay thế được base class</p>
                
                <pre><code>{`// ❌ VI PHẠM
public class Bird
{
    public virtual void Fly() { }
}

public class Penguin : Bird
{
    public override void Fly()
    {
        throw new NotSupportedException();
    }
}

// ✅ KHẮC PHỤC
public interface IFlyable
{
    void Fly();
}

public class Sparrow : IFlyable
{
    public void Fly() { }
}

public class Penguin
{
    public void Swim() { }
}`}</code></pre>
                
                <h3>I - Interface Segregation Principle</h3>
                <p>Không bắt class implement methods không cần</p>
                
                <pre><code>{`// ❌ VI PHẠM
public interface IWorker
{
    void Work();
    void Eat();
    void Sleep();
}

// ✅ KHẮC PHỤC
public interface IWorkable { void Work(); }
public interface IFeedable { void Eat(); }
public interface ISleepable { void Sleep(); }

public class Human : IWorkable, IFeedable, ISleepable { }
public class Robot : IWorkable { }`}</code></pre>
                
                <h3>D - Dependency Inversion Principle</h3>
                <p>Depend on abstractions, not concretions</p>
                
                <pre><code>{`// ❌ VI PHẠM
public class Notification
{
    private EmailService _service = new EmailService();
}

// ✅ KHẮC PHỤC
public interface IMessageService
{
    void Send(string message);
}

public class Notification
{
    private readonly IMessageService _service;
    
    public Notification(IMessageService service)
    {
        _service = service;
    }
}`}</code></pre>
              </div>
            )}
          </div>

          {/* Panel 3 */}
          <div className="panel">
            <div 
              className={`panel-header ${activeKey === '3' ? 'active' : ''}`}
              onClick={() => togglePanel('3')}
            >
              3. Dependency Injection là gì? Các loại DI
              <span className="arrow">{activeKey === '3' ? '▼' : '▶'}</span>
            </div>
            {activeKey === '3' && (
              <div className="question-content">
                <p>DI là design pattern để inject dependencies từ bên ngoài</p>
                
                <h3>1. Constructor Injection (Khuyên dùng)</h3>
                
                <pre><code>{`public class UserService
{
    private readonly ILogger _logger;
    private readonly IUserRepository _repository;
    
    public UserService(ILogger logger, IUserRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }
    
    public void CreateUser(string name)
    {
        _logger.Log("Creating user");
        _repository.Add(new User { Name = name });
    }
}`}</code></pre>
                
                <div className="success-box">
                  <h4>✅ Ưu điểm:</h4>
                  <ul>
                    <li>Dependencies bắt buộc - object luôn valid</li>
                    <li>Immutable - readonly fields</li>
                    <li>Dễ test - inject mock</li>
                  </ul>
                </div>
                
                <h3>2. Property Injection</h3>
                
                <pre><code>{`public class OrderService
{
    public INotificationService NotificationService { get; set; }
    
    private readonly IOrderRepository _repository;
    
    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }
    
    public void CreateOrder(Order order)
    {
        _repository.Add(order);
        NotificationService?.SendNotification("Order created");
    }
}`}</code></pre>
                
                <h3>3. Method Injection</h3>
                
                <pre><code>{`public class ReportGenerator
{
    public void GenerateReport(IDataSource dataSource, IFormatter formatter)
    {
        var data = dataSource.GetData();
        var formatted = formatter.Format(data);
        Console.WriteLine(formatted);
    }
}`}</code></pre>
                
                <div className="info-box">
                  <h4>Khi nào dùng:</h4>
                  <ul>
                    <li><strong>Constructor:</strong> Dependencies bắt buộc (90%)</li>
                    <li><strong>Property:</strong> Dependencies optional</li>
                    <li><strong>Method:</strong> Dependency chỉ cho method đó</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Panel 4 */}
          <div className="panel">
            <div 
              className={`panel-header ${activeKey === '4' ? 'active' : ''}`}
              onClick={() => togglePanel('4')}
            >
              4. IoC container hoạt động như thế nào?
              <span className="arrow">{activeKey === '4' ? '▼' : '▶'}</span>
            </div>
            {activeKey === '4' && (
              <div className="question-content">
                <p>IoC Container quản lý tạo và inject dependencies tự động</p>
                
                <h3>Registration & Resolution:</h3>
                
                <pre><code>{`// 1. REGISTRATION
public void ConfigureServices(IServiceCollection services)
{
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<ILogger, FileLogger>();
    services.AddScoped<UserService>();
}

// 2. RESOLUTION
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger _logger;
    
    public UserService(IUserRepository repository, ILogger logger)
    {
        _repository = repository;
        _logger = logger;
    }
}

// Container tự động:
// 1. Tìm constructor
// 2. Resolve dependencies
// 3. Tạo instances
// 4. Inject
var userService = serviceProvider.GetService<UserService>();`}</code></pre>
                
                <h3>Lifecycle Management:</h3>
                
                <pre><code>{`// Transient - tạo mới mỗi lần
services.AddTransient<IEmailService, EmailService>();

// Scoped - một instance per request
services.AddScoped<IOrderService, OrderService>();

// Singleton - một instance toàn app
services.AddSingleton<IConfiguration, AppConfiguration>();`}</code></pre>
                
                <div className="success-box">
                  <h4>✅ Lợi ích:</h4>
                  <ul>
                    <li>Tự động resolve dependencies phức tạp</li>
                    <li>Quản lý lifecycle</li>
                    <li>Giảm boilerplate code</li>
                    <li>Dễ swap implementations</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Panel 5 */}
          <div className="panel">
            <div 
              className={`panel-header ${activeKey === '5' ? 'active' : ''}`}
              onClick={() => togglePanel('5')}
            >
              5. Composition vs Inheritance? Khi nào ưu tiên composition?
              <span className="arrow">{activeKey === '5' ? '▼' : '▶'}</span>
            </div>
            {activeKey === '5' && (
              <div className="question-content">
                
                <h3>Inheritance - "IS-A":</h3>
                
                <pre><code>{`public class Vehicle
{
    public void Start() { }
}

public class Car : Vehicle
{
    public int Doors { get; set; }
}

// Car IS-A Vehicle`}</code></pre>
                
                <div className="warning-box">
                  <h4>❌ Vấn đề:</h4>
                  <ul>
                    <li>Tight coupling</li>
                    <li>Không linh hoạt</li>
                    <li>C# không hỗ trợ multiple inheritance</li>
                  </ul>
                </div>
                
                <h3>Composition - "HAS-A":</h3>
                
                <pre><code>{`public interface IEngine
{
    void Start();
    void Stop();
}

public class GasEngine : IEngine
{
    public void Start() { }
    public void Stop() { }
}

public class ElectricEngine : IEngine
{
    public void Start() { }
    public void Stop() { }
}

public class Car
{
    private readonly IEngine _engine;
    
    public Car(IEngine engine)
    {
        _engine = engine;
    }
    
    public void Drive()
    {
        _engine.Start();
    }
}

// Linh hoạt
var gasCar = new Car(new GasEngine());
var electricCar = new Car(new ElectricEngine());`}</code></pre>
                
                <div className="success-box">
                  <h4>✅ Ưu điểm Composition:</h4>
                  <ul>
                    <li>Linh hoạt - swap behaviors runtime</li>
                    <li>Tránh tight coupling</li>
                    <li>Không giới hạn single inheritance</li>
                    <li>Dễ test</li>
                  </ul>
                </div>
                
                <h3>Ví dụ: Logger System</h3>
                
                <pre><code>{`public interface ILogTarget
{
    void Write(string message);
}

public class FileLogTarget : ILogTarget
{
    public void Write(string message) { }
}

public class DatabaseLogTarget : ILogTarget
{
    public void Write(string message) { }
}

public class Logger
{
    private readonly List<ILogTarget> _targets;
    
    public Logger(params ILogTarget[] targets)
    {
        _targets = new List<ILogTarget>(targets);
    }
    
    public void Log(string message)
    {
        foreach (var target in _targets)
        {
            target.Write(message);
        }
    }
}

// Kết hợp nhiều targets
var logger = new Logger(
    new FileLogTarget(),
    new DatabaseLogTarget()
);`}</code></pre>
                
                <div className="highlight">
                  <h4>📝 Nguyên tắc:</h4>
                  <ul>
                    <li><strong>Inheritance:</strong> Quan hệ IS-A rõ ràng, stable</li>
                    <li><strong>Composition:</strong> Behaviors linh hoạt, runtime flexibility</li>
                    <li><strong>Favor Composition over Inheritance</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="csharp-footer">
        <p>© 2024 C# OOP & SOLID Guide</p>
      </footer>
    </div>
  );
};

export default CSharpOOPSolid;