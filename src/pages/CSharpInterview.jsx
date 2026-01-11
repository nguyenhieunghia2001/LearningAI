import React from 'react';
import { Layout, Collapse } from 'antd';
import './CSharpFundamentals.css';
import CSharpAdditionalQuestions from './CSharpAdditionalQuestions';
import CSharpOOPSolid from './CSharpOOPSolid';
import CSharpCollections from './CSharpCollections';
import AsyncAwaitThreading from './asyncThread/AsyncAwaitThreading';

const { Panel } = Collapse;
const { Content, Footer } = Layout;

const CSharpFundamentals = ({ selected = 'fundamentals' }) => {
  return (
    <Layout className="csharp-container">
      <Content className="csharp-main">
        {selected === 'fundamentals' && (
          <Collapse accordion>
          <Panel header="1. Sự khác biệt giữa Class và Struct? Khi nào nên dùng?" key="1">
            <div className="question-content">
              <h3>Khác biệt chính:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Đặc điểm</th>
                    <th>Class</th>
                    <th>Struct</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loại</td>
                    <td>Reference Type</td>
                    <td>Value Type</td>
                  </tr>
                  <tr>
                    <td>Lưu trữ</td>
                    <td>Heap</td>
                    <td>Stack (thường)</td>
                  </tr>
                  <tr>
                    <td>Kế thừa</td>
                    <td>Có thể kế thừa class khác</td>
                    <td>Không kế thừa struct khác, chỉ implement interface</td>
                  </tr>
                  <tr>
                    <td>Null</td>
                    <td>Có thể null</td>
                    <td>Không thể null (trừ khi dùng Nullable&lt;T&gt;)</td>
                  </tr>
                  <tr>
                    <td>Constructor</td>
                    <td>Có constructor mặc định</td>
                    <td>Phải khởi tạo tất cả fields</td>
                  </tr>
                  <tr>
                    <td>Performance</td>
                    <td>Chậm hơn (allocation + GC)</td>
                    <td>Nhanh hơn với dữ liệu nhỏ</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Ví dụ:</h3>
              <pre><code>{`// Class - Reference Type
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// Struct - Value Type
public struct Point
{
    public int X { get; set; }
    public int Y { get; set; }
}

// Minh họa sự khác biệt
Person person1 = new Person { Name = "John", Age = 30 };
Person person2 = person1; // Tham chiếu đến cùng object
person2.Name = "Jane";
Console.WriteLine(person1.Name); // Output: "Jane" - bị thay đổi

Point point1 = new Point { X = 10, Y = 20 };
Point point2 = point1; // Copy giá trị
point2.X = 30;
Console.WriteLine(point1.X); // Output: 10 - không bị thay đổi`}</code></pre>
              
              <div className="success-box">
                <h4>✅ Khi nào dùng struct:</h4>
                <ul>
                  <li>Dữ liệu nhỏ (&lt; 16 bytes)</li>
                  <li>Immutable data</li>
                  <li>Ít được boxing/unboxing</li>
                  <li><strong>Ví dụ:</strong> Point, Color, DateTime, Decimal</li>
                </ul>
              </div>
              
              <div className="info-box">
                <h4>✅ Khi nào dùng class:</h4>
                <ul>
                  <li>Dữ liệu lớn</li>
                  <li>Cần kế thừa</li>
                  <li>Cần polymorphism</li>
                  <li><strong>Ví dụ:</strong> Customer, Order, Repository</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel header="2. Value Type và Reference Type, Boxing/Unboxing" key="2">
            <div className="question-content">
              <h3>Value Type:</h3>
              <ul>
                <li>Lưu trữ trực tiếp giá trị</li>
                <li>Stored trên stack (nếu là local variable)</li>
                <li>Primitive types: int, double, bool, char, struct, enum</li>
              </ul>
              
              <h3>Reference Type:</h3>
              <ul>
                <li>Lưu trữ tham chiếu đến object trên heap</li>
                <li>class, interface, delegate, string, array, object</li>
              </ul>
              
              <h3>Boxing và Unboxing:</h3>
              <pre><code>{`// Boxing - Chuyển Value Type thành Reference Type
int number = 123; // Value type trên stack
object obj = number; // Boxing: copy sang heap, wrap trong object

// Unboxing - Chuyển Reference Type về Value Type
object obj2 = 456;
int number2 = (int)obj2; // Unboxing: extract value từ object

// Tránh boxing với Generics
List<int> numbers = new List<int>(); // Không boxing
numbers.Add(10); // Trực tiếp thêm int

ArrayList oldList = new ArrayList(); // Boxing xảy ra
oldList.Add(10); // int được boxing thành object`}</code></pre>
              
              <div className="warning-box">
                <h4>⚠️ Performance Impact:</h4>
                <p>Boxing có thể chậm hơn ~100x so với operations bình thường. Luôn sử dụng generic collections (List&lt;T&gt;, Dictionary&lt;K,V&gt;) thay vì non-generic (ArrayList, Hashtable) để tránh boxing.</p>
              </div>
              
              <pre><code>{`// ❌ BAD - Boxing mỗi lần loop
for (int i = 0; i < 1000000; i++)
{
    object boxed = i; // Boxing
}

// ✅ GOOD - Không boxing
List<int> list = new List<int>();
for (int i = 0; i < 1000000; i++)
{
    list.Add(i); // Không boxing
}`}</code></pre>
            </div>
          </Panel>

          <Panel header="3. Abstract Class vs Interface? C# 8.0 có gì thay đổi?" key="3">
            <div className="question-content">
              <h3>Abstract Class:</h3>
              <ul>
                <li>Có thể có implementation</li>
                <li>Có thể có fields, constructors</li>
                <li>Chỉ được kế thừa 1 abstract class</li>
                <li>Có thể có access modifier cho members</li>
              </ul>
              
              <h3>Interface:</h3>
              <ul>
                <li>Contract - định nghĩa những gì class phải implement</li>
                <li>Không có fields (trước C# 8.0)</li>
                <li>Một class có thể implement nhiều interface</li>
                <li>Members mặc định là public</li>
              </ul>
              
              <h3>Ví dụ:</h3>
              <pre><code>{`// Abstract Class
public abstract class Animal
{
    private string _name; // Field được phép
    
    public Animal(string name) // Constructor được phép
    {
        _name = name;
    }
    
    public abstract void MakeSound(); // Abstract method
    
    public void Sleep() // Concrete method
    {
        Console.WriteLine($"{_name} is sleeping");
    }
}

// Interface trước C# 8.0
public interface IFlyable
{
    void Fly(); // Chỉ signature
}`}</code></pre>
              
              <div className="highlight">
                <h4>🆕 C# 8.0+: Default Interface Methods</h4>
                <pre><code>{`public interface ILogger
{
    void Log(string message); // Vẫn phải implement
    
    // Default implementation - không bắt buộc implement
    void LogError(string message)
    {
        Log($"ERROR: {message}");
    }
    
    // Static members
    static void LogInfo(string message)
    {
        Console.WriteLine($"INFO: {message}");
    }
}

// C# 8.0+: Interface có thể có constants
public interface IConfiguration
{
    const int MaxRetries = 3;
    static readonly TimeSpan Timeout = TimeSpan.FromSeconds(30);
}`}</code></pre>
              </div>
              
              <h3>Sử dụng:</h3>
              <pre><code>{`public class Bird : Animal, IFlyable
{
    public Bird(string name) : base(name) { }
    
    public override void MakeSound()
    {
        Console.WriteLine("Chirp!");
    }
    
    public void Fly()
    {
        Console.WriteLine("Flying...");
    }
}`}</code></pre>
              
              <div className="info-box">
                <h4>Khi nào dùng abstract class:</h4>
                <ul>
                  <li>Có shared code giữa các derived classes</li>
                  <li>Cần non-public members</li>
                  <li>Cần fields hoặc constructors</li>
                  <li>Quan hệ "is-a" chặt chẽ</li>
                </ul>
              </div>
              
              <div className="info-box">
                <h4>Khi nào dùng interface:</h4>
                <ul>
                  <li>Multiple inheritance behavior</li>
                  <li>Unrelated classes có cùng behavior</li>
                  <li>Quan hệ "can-do"</li>
                  <li>Plugin architecture</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel header="4. Các Access Modifier trong C#" key="4">
            <div className="question-content">
              <pre><code>{`public class AccessModifierDemo
{
    // public - Truy cập từ mọi nơi
    public int PublicField;
    
    // private - Chỉ trong cùng class
    private int PrivateField;
    
    // protected - Trong class và derived classes
    protected int ProtectedField;
    
    // internal - Trong cùng assembly
    internal int InternalField;
    
    // protected internal - protected OR internal
    protected internal int ProtectedInternalField;
    
    // private protected - protected AND internal (C# 7.2+)
    private protected int PrivateProtectedField;
}`}</code></pre>
              
              <h3>Giải thích chi tiết:</h3>
              
              <h4>protected internal:</h4>
              <p>Truy cập được nếu:</p>
              <ul>
                <li>Trong cùng assembly (bất kỳ class nào), <strong>HOẶC</strong></li>
                <li>Derived class ở assembly khác</li>
              </ul>
              
              <h4>private protected (C# 7.2+):</h4>
              <p>Chỉ truy cập được nếu:</p>
              <ul>
                <li>Trong cùng assembly, <strong>VÀ</strong></li>
                <li>Là derived class</li>
              </ul>
              
              <pre><code>{`// Assembly 1 (Same assembly)
public class SameAssemblyClass
{
    public void AccessFields()
    {
        var demo = new AccessModifierDemo();
        demo.PublicField = 1; // OK
        demo.InternalField = 2; // OK - cùng assembly
        demo.ProtectedInternalField = 3; // OK - cùng assembly
        // demo.ProtectedField = 4; // ERROR
        // demo.PrivateProtectedField = 5; // ERROR
    }
}

public class DerivedInSameAssembly : AccessModifierDemo
{
    public void AccessFields()
    {
        PublicField = 1; // OK
        ProtectedField = 2; // OK - derived class
        InternalField = 3; // OK - cùng assembly
        ProtectedInternalField = 4; // OK - cả hai điều kiện
        PrivateProtectedField = 5; // OK - derived + same assembly
        // PrivateField = 6; // ERROR - private
    }
}

// Assembly 2 (Different assembly)
public class DerivedInDifferentAssembly : AccessModifierDemo
{
    public void AccessFields()
    {
        PublicField = 1; // OK
        ProtectedField = 2; // OK - derived class
        ProtectedInternalField = 3; // OK - derived (protected part)
        // InternalField = 4; // ERROR - khác assembly
        // PrivateProtectedField = 5; // ERROR - khác assembly
    }
}`}</code></pre>
              
              <div className="highlight">
                <h4>📝 Tóm tắt:</h4>
                <ul>
                  <li><strong>protected internal</strong> = protected OR internal (rộng hơn)</li>
                  <li><strong>private protected</strong> = protected AND internal (hẹp hơn)</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel header="5. Sealed Keyword - Lợi ích?" key="5">
            <div className="question-content">
              <p><strong>Sealed class:</strong> Không thể kế thừa</p>
              <p><strong>Sealed method:</strong> Không thể override tiếp</p>
              
              <pre><code>{`// Sealed class
public sealed class FinalImplementation
{
    public void DoSomething() { }
}

// public class CannotDerive : FinalImplementation { } // ERROR

// Sealed method
public class BaseClass
{
    public virtual void Method() { }
}

public class MiddleClass : BaseClass
{
    public sealed override void Method() 
    { 
        // Override lần cuối
    }
}

public class DerivedClass : MiddleClass
{
    // public override void Method() { } // ERROR - sealed rồi
}`}</code></pre>
              
              <h3>Lợi ích:</h3>
              
              <h4>1. Performance:</h4>
              <p>CLR có thể optimize devirtualization</p>
              <pre><code>{`// Không sealed - virtual call
public class RegularClass
{
    public virtual int Calculate() => 42;
}

// Sealed - có thể inline
public sealed class SealedClass
{
    public int Calculate() => 42; // Có thể inline
}`}</code></pre>
              
              <h4>2. Security:</h4>
              <p>Ngăn chặn inheritance không mong muốn</p>
              <pre><code>{`public sealed class SecurityToken
{
    // Không ai có thể kế thừa và bypass security logic
    private readonly string _token;
    
    public bool Validate() 
    {
        // Critical security logic
        return !string.IsNullOrEmpty(_token);
    }
}`}</code></pre>
              
              <h4>3. Design Intent:</h4>
              <p>Rõ ràng class không được thiết kế để extend</p>
              <pre><code>{`public sealed class ConfigurationSettings
{
    // Singleton pattern - không nên kế thừa
    private static readonly ConfigurationSettings _instance = new();
    public static ConfigurationSettings Instance => _instance;
    private ConfigurationSettings() { }
}`}</code></pre>
            </div>
          </Panel>

          <Panel header="6. Delegates, Events, và Multicast Delegates" key="6">
            <div className="question-content">
              <h3>Delegate:</h3>
              <p>Type-safe function pointer</p>
              
              <pre><code>{`// Định nghĩa delegate
public delegate void LogHandler(string message);
public delegate int Calculate(int x, int y);

public class DelegateDemo
{
    public void UseDelegate()
    {
        // Gán method cho delegate
        LogHandler logger = ConsoleLog;
        logger("Hello"); // Gọi qua delegate
        
        // Lambda
        logger = (msg) => Console.WriteLine($"Lambda: {msg}");
        logger("World");
        
        // Method group
        Calculate calc = Add;
        int result = calc(5, 3); // 8
    }
    
    private void ConsoleLog(string message)
    {
        Console.WriteLine(message);
    }
    
    private int Add(int x, int y) => x + y;
}`}</code></pre>
              
              <h3>Multicast Delegate:</h3>
              <p>Delegate chứa nhiều methods</p>
              
              <pre><code>{`public class MulticastDemo
{
    public delegate void Notify(string message);
    
    public void Demo()
    {
        Notify notify = null;
        
        // Thêm methods
        notify += EmailNotify;
        notify += SmsNotify;
        notify += PushNotify;
        
        // Gọi tất cả cùng lúc
        notify("Order placed!"); // Gửi email, SMS, push
        
        // Xóa method
        notify -= SmsNotify;
        notify("Order shipped!"); // Chỉ email và push
    }
    
    private void EmailNotify(string msg) 
        => Console.WriteLine($"Email: {msg}");
    private void SmsNotify(string msg) 
        => Console.WriteLine($"SMS: {msg}");
    private void PushNotify(string msg) 
        => Console.WriteLine($"Push: {msg}");
}`}</code></pre>
              
              <h3>Event:</h3>
              <p>Encapsulated multicast delegate</p>
              
              <pre><code>{`public class Button
{
    // Event - chỉ class owner mới trigger được
    public event EventHandler Clicked;
    
    // EventHandler<T> cho custom args
    public event EventHandler<ButtonClickedEventArgs> ClickedWithData;
    
    public void Click()
    {
        // Trigger event - null-safe
        Clicked?.Invoke(this, EventArgs.Empty);
        ClickedWithData?.Invoke(this, new ButtonClickedEventArgs 
        { 
            ClickTime = DateTime.Now 
        });
    }
}

public class ButtonClickedEventArgs : EventArgs
{
    public DateTime ClickTime { get; set; }
}

// Sử dụng
public class Program
{
    public void Run()
    {
        var button = new Button();
        
        // Subscribe
        button.Clicked += OnButtonClicked;
        button.Clicked += (sender, e) => Console.WriteLine("Lambda handler");
        
        button.ClickedWithData += OnButtonClickedWithData;
        
        button.Click(); // Trigger
        
        // Unsubscribe
        button.Clicked -= OnButtonClicked;
    }
    
    private void OnButtonClicked(object sender, EventArgs e)
    {
        Console.WriteLine("Button was clicked!");
    }
    
    private void OnButtonClickedWithData(object sender, ButtonClickedEventArgs e)
    {
        Console.WriteLine($"Clicked at {e.ClickTime}");
    }
}`}</code></pre>
              
              <div className="info-box">
                <h4>Delegate vs Event:</h4>
                <ul>
                  <li><strong>Delegate:</strong> Có thể assign, invoke từ bên ngoài</li>
                  <li><strong>Event:</strong> Chỉ += -= từ bên ngoài, invoke từ bên trong</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel header="7. Func, Action, Predicate - Khác nhau như thế nào?" key="7">
            <div className="question-content">
              <h3>Built-in generic delegates:</h3>
              
              <pre><code>{`// Action - Không return, 0-16 parameters
Action action = () => Console.WriteLine("No params");
Action<string> greet = (name) => Console.WriteLine($"Hello {name}");
Action<int, int> log = (x, y) => Console.WriteLine($"{x}, {y}");

action();
greet("John");
log(1, 2);

// Func - Có return, 0-16 input params, 1 output
Func<int> getNumber = () => 42;
Func<int, int> square = (x) => x * x;
Func<int, int, int> add = (x, y) => x + y;
Func<string, int, string> format = (text, num) => $"{text}: {num}";

Console.WriteLine(getNumber()); // 42
Console.WriteLine(square(5)); // 25
Console.WriteLine(add(3, 4)); // 7
Console.WriteLine(format("Count", 10)); // "Count: 10"

// Predicate<T> - Return bool, 1 parameter
Predicate<int> isEven = (x) => x % 2 == 0;
Console.WriteLine(isEven(4)); // true

// Thay bằng Func<T, bool> - linh hoạt hơn
Func<int, bool> isPositive = (x) => x > 0;
Console.WriteLine(isPositive(5)); // true`}</code></pre>
              
              <h3>Ứng dụng thực tế:</h3>
              
              <pre><code>{`public class UserService
{
    private List<User> _users = new();
    
    // Action - callback không return
    public void ProcessUsers(Action<User> action)
    {
        foreach (var user in _users)
        {
            action(user);
        }
    }
    
    // Func - transform data
    public List<TResult> MapUsers<TResult>(Func<User, TResult> mapper)
    {
        return _users.Select(mapper).ToList();
    }
    
    // Predicate/Func - filter
    public List<User> FilterUsers(Func<User, bool> predicate)
    {
        return _users.Where(predicate).ToList();
    }
}

// Sử dụng
var service = new UserService();

// Action
service.ProcessUsers(u => Console.WriteLine(u.Name));

// Func
var names = service.MapUsers(u => u.Name);
var ages = service.MapUsers(u => u.Age);

// Predicate
var adults = service.FilterUsers(u => u.Age >= 18);
var activeUsers = service.FilterUsers(u => u.IsActive);`}</code></pre>
            </div>
          </Panel>
          <CSharpAdditionalQuestions />
          </Collapse>
        )}

        {selected === 'oop' && <CSharpOOPSolid />}

        {selected === 'collections' && <CSharpCollections />}

        {selected === 'async' && <AsyncAwaitThreading />}

        {selected !== 'fundamentals' && selected !== 'oop' && selected !== 'collections' && selected !== 'async' && <CSharpOOPSolid /> }
      </Content>
      
      <Footer className="csharp-footer">
        <p>© 2024 C# Fundamentals Guide - Interview Questions</p>
      </Footer>
    </Layout>
  );
};

export default CSharpFundamentals;

