import React, { useState } from "react";
import { Collapse, Typography, Tabs, Card, Tag, Space, Alert } from "antd";
import {
  CodeOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import './style.css';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const AsyncAwaitThreading = () => {
  const [activeKeys, setActiveKeys] = useState(["1"]);

  const CodeBlock = ({ code, warning, recommended }) => (
    <pre
      style={{
        background: warning ? "#fff2e8" : recommended ? "#f6ffed" : "#f5f5f5",
        padding: "12px",
        borderRadius: "4px",
        overflow: "auto",
        border: warning
          ? "1px solid #ffbb96"
          : recommended
          ? "1px solid #b7eb8f"
          : "1px solid #d9d9d9",
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      <code>{code}</code>
    </pre>
  );

  const questions = [
    {
      key: "1",
      question: "async/await hoạt động như thế nào? Cơ chế bên dưới",
      content: (
        <>
          <Alert
            message="Lý thuyết"
            description="async/await là cú pháp đường (syntactic sugar) giúp viết code bất đồng bộ dễ đọc như code đồng bộ. Khi compiler gặp async/await, nó sẽ chuyển đổi method thành một state machine."
            type="info"
            showIcon
            icon={<BulbOutlined />}
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Cơ chế hoạt động:</Title>
          <ul>
            <li>Khi gặp await, method tạm dừng và trả control về caller</li>
            <li>Thread được giải phóng để làm việc khác (không bị block)</li>
            <li>
              Khi task hoàn thành, continuation được schedule để chạy tiếp
            </li>
            <li>Compiler tạo state machine để lưu trạng thái</li>
          </ul>

          <Title level={5}>Code bạn viết:</Title>
          <CodeBlock
            code={`public async Task<string> GetDataAsync()
{
    Console.WriteLine("Bắt đầu");
    var result = await FetchFromDatabaseAsync();
    Console.WriteLine($"Kết quả: {result}");
    return result;
}`}
          />

          <Title level={5}>Compiler chuyển thành:</Title>
          <CodeBlock
            code={`public Task<string> GetDataAsync()
{
    var stateMachine = new StateMachine();
    stateMachine.state = 0;
    // State 0: trước await
    // State 1: sau await
    return stateMachine.ExecuteAsync();
}`}
          />

          <Title level={5}>Demo Thread ID:</Title>
          <CodeBlock
            code={`public async Task DemoAsync()
{
    Console.WriteLine($"Thread ID trước await: " +
        $"{Thread.CurrentThread.ManagedThreadId}");
    
    await Task.Delay(1000);
    
    Console.WriteLine($"Thread ID sau await: " +
        $"{Thread.CurrentThread.ManagedThreadId}");
    // Có thể khác thread ID ban đầu!
}`}
          />
        </>
      ),
    },
    {
      key: "2",
      question: "Task vs Thread? Khi nào nên dùng cái nào?",
      content: (
        <>
          <Alert
            message="So sánh"
            description="Thread: OS-level thread, tốn tài nguyên (1MB stack), tạo/destroy chậm. Task: Abstraction cao hơn, dùng ThreadPool, nhẹ hơn, hỗ trợ async/await."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Thread - Nặng và khó quản lý:</Title>
          <CodeBlock
            code={`public void UseThread()
{
    var thread = new Thread(() =>
    {
        Console.WriteLine("Chạy trên thread riêng");
        Thread.Sleep(1000);
    });
    
    thread.Start();
    thread.Join();
    // Không thể return giá trị dễ dàng
}`}
          />

          <Title level={5}>Task - Nhẹ và linh hoạt (Khuyến nghị):</Title>
          <CodeBlock
            recommended
            code={`public async Task UseTaskAsync()
{
    var task = Task.Run(() =>
    {
        Console.WriteLine("Chạy trên ThreadPool");
        Thread.Sleep(1000);
        return "Kết quả";
    });
    
    var result = await task;
    Console.WriteLine(result);
}`}
          />

          <Title level={5}>Khi nào dùng Thread:</Title>
          <CodeBlock
            code={`// Long-running với priority cao
var thread = new Thread(() =>
{
    while (true)
    {
        ProcessData();
        Thread.Sleep(100);
    }
})
{
    IsBackground = true,
    Priority = ThreadPriority.AboveNormal
};
thread.Start();`}
          />

          <Alert
            message="Quy tắc"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Dùng Thread: Long-running, cần control hoàn toàn</li>
                <li>Dùng Task: Hầu hết trường hợp khác, I/O operations</li>
              </ul>
            }
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
    },
    {
      key: "3",
      question: "Task.Run() vs Task.Factory.StartNew()",
      content: (
        <>
          <Alert
            message="Khác biệt"
            description="Task.Run() đơn giản, an toàn. Task.Factory.StartNew() có nhiều options, dễ dùng sai."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Task.Run - Đơn giản (Khuyến nghị):</Title>
          <CodeBlock
            recommended
            code={`public async Task UseTaskRun()
{
    var result = await Task.Run(() => DoWork());
    // Tự động unwrap async delegates
}`}
          />

          <Title level={5}>StartNew - Cẩn thận!</Title>
          <CodeBlock
            warning
            code={`var task = Task.Factory.StartNew(async () =>
{
    await Task.Delay(1000);
    return "Done";
});

// task là Task<Task<string>>, không phải Task<string>!
var result = await await task; // Cần await 2 lần!

// Hoặc dùng Unwrap()
var unwrapped = Task.Factory.StartNew(async () =>
{
    await Task.Delay(1000);
    return "Done";
}).Unwrap();`}
          />

          <Title level={5}>Khi nào dùng StartNew:</Title>
          <CodeBlock
            code={`// Khi cần options đặc biệt
Task.Factory.StartNew(
    () => LongRunningWork(),
    CancellationToken.None,
    TaskCreationOptions.LongRunning,
    TaskScheduler.Default
);`}
          />
        </>
      ),
    },
    {
      key: "4",
      question: "Deadlock trong async code và cách tránh",
      content: (
        <>
          <Alert
            message="Nguyên nhân Deadlock"
            description="(1) Code đồng bộ (.Wait(), .Result) đợi async task, (2) Async task cần quay về context ban đầu, (3) Context đang bị block => DEADLOCK!"
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>DEADLOCK - Không làm thế này!</Title>
          <CodeBlock
            warning
            code={`public string DeadlockExample()
{
    var result = GetDataAsync().Result; // BLOCK!
    return result;
}

public async Task<string> GetDataAsync()
{
    await Task.Delay(1000);
    // Cố quay về context
    // Nhưng context đang bị .Result block
    // => DEADLOCK!
    return "Data";
}`}
          />

          <Title level={5}>Giải pháp 1: ConfigureAwait(false)</Title>
          <CodeBlock
            code={`public async Task<string> GetDataAsync()
{
    await Task.Delay(1000).ConfigureAwait(false);
    // Không cần quay về context ban đầu
    return "Data";
}`}
          />

          <Title level={5}>Giải pháp 2: Async all the way (Tốt nhất)</Title>
          <CodeBlock
            recommended
            code={`public async Task<string> AsyncAllTheWay()
{
    var result = await GetDataAsync();
    return result;
}`}
          />

          <Alert
            message="Quy tắc ConfigureAwait"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Library code: luôn dùng .ConfigureAwait(false)</li>
                <li>Application code (UI, Controller): không cần</li>
                <li>
                  ASP.NET Core: ít deadlock hơn, không có SynchronizationContext
                </li>
              </ul>
            }
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
    },
    {
      key: "5",
      question: "Task.WhenAll() vs Task.WaitAll()",
      content: (
        <>
          <Alert
            message="So sánh"
            description="Task.WhenAll(): Async, không block thread. Task.WaitAll(): Sync, block thread."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>WhenAll - Khuyến nghị:</Title>
          <CodeBlock
            recommended
            code={`public async Task UseWhenAll()
{
    var task1 = GetData1Async();
    var task2 = GetData2Async();
    var task3 = GetData3Async();
    
    // Chạy song song, không block thread
    var results = await Task.WhenAll(task1, task2, task3);
    
    Console.WriteLine($"Kết quả: {results[0]}, {results[1]}, {results[2]}");
}`}
          />

          <Title level={5}>WaitAll - Tránh:</Title>
          <CodeBlock
            warning
            code={`public void UseWaitAll()
{
    var tasks = new[] { 
        GetData1Async(), 
        GetData2Async() 
    };
    
    Task.WaitAll(tasks); // BLOCK thread hiện tại
    
    var result1 = tasks[0].Result;
}`}
          />

          <Title level={5}>So sánh Performance:</Title>
          <CodeBlock
            code={`// Sequential - 3 giây
await Task.Delay(1000);
await Task.Delay(1000);
await Task.Delay(1000);

// Parallel với WhenAll - 1 giây
await Task.WhenAll(
    Task.Delay(1000),
    Task.Delay(1000),
    Task.Delay(1000)
);`}
          />

          <Title level={5}>Exception Handling:</Title>
          <CodeBlock
            code={`var tasks = new[]
{
    Task.Run(() => throw new Exception("Lỗi 1")),
    Task.Run(() => throw new Exception("Lỗi 2"))
};

try
{
    await Task.WhenAll(tasks);
}
catch
{
    foreach (var task in tasks)
    {
        if (task.IsFaulted)
        {
            Console.WriteLine(task.Exception.InnerException.Message);
        }
    }
}`}
          />
        </>
      ),
    },
    {
      key: "6",
      question: "Cancellation Token hoạt động ra sao?",
      content: (
        <>
          <Alert
            message="Cơ chế"
            description="CancellationToken là cooperative cancellation - method tự kiểm tra và quyết định khi nào dừng. Không force kill thread."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Cơ bản:</Title>
          <CodeBlock
            code={`var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(5));

try
{
    await DoWorkAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Đã bị hủy");
}

public async Task DoWorkAsync(CancellationToken ct)
{
    for (int i = 0; i < 100; i++)
    {
        ct.ThrowIfCancellationRequested();
        await Task.Delay(100, ct);
    }
}`}
          />

          <Title level={5}>Kiểm tra thủ công:</Title>
          <CodeBlock
            code={`foreach (var item in items)
{
    if (ct.IsCancellationRequested)
    {
        Console.WriteLine("Dừng sớm");
        return;
    }
    await ProcessAsync(item, ct);
}`}
          />

          <Title level={5}>Linking Tokens:</Title>
          <CodeBlock
            code={`var cts1 = new CancellationTokenSource();
var cts2 = new CancellationTokenSource();

var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(
    cts1.Token, cts2.Token
);

await DoWorkAsync(linkedCts.Token);`}
          />

          <Title level={5}>Web API:</Title>
          <CodeBlock
            code={`[HttpGet]
public async Task<ActionResult<List<User>>> GetUsers(
    CancellationToken cancellationToken)
{
    // ASP.NET tự động cancel khi client disconnect
    var users = await _db.GetUsersAsync(cancellationToken);
    return Ok(users);
}`}
          />
        </>
      ),
    },
    {
      key: "7",
      question: "ValueTask là gì? Khi nào dùng?",
      content: (
        <>
          <Alert
            message="Khác biệt"
            description="ValueTask<T> là struct, Task<T> là class. ValueTask tránh allocation khi kết quả đã có sẵn (cache hit)."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Task - luôn allocate:</Title>
          <CodeBlock
            code={`public async Task<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
    {
        return user; // Vẫn allocate Task object
    }
    
    user = await _db.GetUserAsync(id);
    _cache[id] = user;
    return user;
}`}
          />

          <Title level={5}>ValueTask - zero allocation khi cache hit:</Title>
          <CodeBlock
            recommended
            code={`public async ValueTask<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
    {
        return user; // Không allocation!
    }
    
    user = await _db.GetUserAsync(id);
    _cache[id] = user;
    return user;
}`}
          />

          <Title level={5}>CẢNH BÁO - Không await nhiều lần:</Title>
          <CodeBlock
            warning
            code={`var valueTask = GetValueTaskAsync();

var result1 = await valueTask; // OK
var result2 = await valueTask; // DANGER!

// Đúng cách:
var task = GetValueTaskAsync().AsTask();
var r1 = await task; // OK
var r2 = await task; // OK`}
          />

          <Alert
            message="Quy tắc sử dụng"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Dùng khi có % cao synchronous completion (cache)</li>
                <li>Chỉ await một lần duy nhất</li>
                <li>Không store trong field</li>
                <li>Không dùng với Task.WhenAll/WhenAny</li>
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
    },
    {
      key: "8",
      question: "Race condition và cách xử lý",
      content: (
        <>
          <Alert
            message="Định nghĩa"
            description="Race condition xảy ra khi nhiều threads truy cập shared data đồng thời và ít nhất một thread modify data."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>RACE CONDITION - Lỗi:</Title>
          <CodeBlock
            warning
            code={`public class Counter
{
    private int _count = 0;
    
    public void Increment()
    {
        _count++; // KHÔNG thread-safe!
    }
}

var counter = new Counter();
Parallel.For(0, 1000, i => counter.Increment());
Console.WriteLine(counter.GetCount()); // Không phải 1000!`}
          />

          <Title level={5}>Giải pháp 1: lock</Title>
          <CodeBlock
            code={`private readonly object _lock = new object();

public void Increment()
{
    lock (_lock)
    {
        _count++;
    }
}`}
          />

          <Title level={5}>Giải pháp 2: Interlocked</Title>
          <CodeBlock
            code={`public void Increment()
{
    Interlocked.Increment(ref _count);
}`}
          />

          <Title level={5}>Giải pháp 3: SemaphoreSlim (async-safe)</Title>
          <CodeBlock
            recommended
            code={`private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

public async Task<int> IncrementAsync()
{
    await _semaphore.WaitAsync();
    try
    {
        await Task.Delay(10);
        return ++_value;
    }
    finally
    {
        _semaphore.Release();
    }
}`}
          />

          <Title level={5}>Giải pháp 4: ReaderWriterLockSlim</Title>
          <CodeBlock
            code={`private ReaderWriterLockSlim _lock = new();

public TValue Get(TKey key)
{
    _lock.EnterReadLock(); // Nhiều threads đọc
    try { return _cache[key]; }
    finally { _lock.ExitReadLock(); }
}

public void Set(TKey key, TValue value)
{
    _lock.EnterWriteLock(); // Chỉ 1 thread ghi
    try { _cache[key] = value; }
    finally { _lock.ExitWriteLock(); }
}`}
          />

          <Alert
            message="So sánh"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>lock: Đơn giản, không async</li>
                <li>SemaphoreSlim: Hỗ trợ async, giới hạn concurrency</li>
                <li>Interlocked: Nhanh nhất, operations đơn giản</li>
                <li>ReaderWriterLockSlim: Tối ưu cho read-heavy</li>
              </ul>
            }
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
    },
    {
      key: "9",
      question: "ThreadLocal vs AsyncLocal",
      content: (
        <>
          <Alert
            message="Khác biệt"
            description="ThreadLocal: Mỗi thread có copy riêng, không flow. AsyncLocal: Flow theo execution context qua async/await."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>ThreadLocal - Không flow:</Title>
          <CodeBlock
            code={`private static ThreadLocal<int> _threadId = new();

public async Task Demo()
{
    _threadId.Value = 100;
    Console.WriteLine($"Before: {_threadId.Value}"); // 100
    
    await Task.Delay(100);
    
    Console.WriteLine($"After: {_threadId.Value}"); // Có thể khác 100!
    // Vì chạy trên thread khác
}`}
          />

          <Title level={5}>AsyncLocal - Flow theo context:</Title>
          <CodeBlock
            recommended
            code={`private static AsyncLocal<string> _userId = new();

public async Task Demo()
{
    _userId.Value = "User123";
    Console.WriteLine($"Before: {_userId.Value}"); // User123
    
    await Task.Delay(100);
    
    Console.WriteLine($"After: {_userId.Value}"); // Vẫn User123!
    // AsyncLocal flow theo execution context
}`}
          />

          <Title level={5}>Use case: Request Context</Title>
          <CodeBlock
            code={`public class RequestContext
{
    private static AsyncLocal<string> _requestId = new();
    
    public static string RequestId
    {
        get => _requestId.Value;
        set => _requestId.Value = value;
    }
    
    public async Task HandleRequest()
    {
        RequestContext.RequestId = Guid.NewGuid().ToString();
        
        await ProcessAsync(); // RequestId flows
        await LogAsync();     // RequestId vẫn còn
    }
}`}
          />
        </>
      ),
    },
    {
      key: "10",
      question: "Thread pool exhaustion và cách tránh",
      content: (
        <>
          <Alert
            message="Vấn đề"
            description="Thread pool exhaustion xảy ra khi tất cả threads bị block, không còn thread để xử lý work mới => deadlock hoặc performance sụt giảm nghiêm trọng."
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 16 }}
          />

          <Title level={5}>Nguyên nhân 1: Blocking async code</Title>
          <CodeBlock
            warning
            code={`// BAD
for (int i = 0; i < 1000; i++)
{
    Task.Run(() =>
    {
        var result = GetDataAsync().Result; // Block thread!
        ProcessData(result);
    });
}

// GOOD
for (int i = 0; i < 1000; i++)
{
    Task.Run(async () =>
    {
        var result = await GetDataAsync(); // Không block
        ProcessData(result);
    });
}`}
          />

          <Title level={5}>Nguyên nhân 2: Long-running tasks</Title>
          <CodeBlock
            warning
            code={`// BAD - chiếm thread pool
Task.Run(() =>
{
    while (true)
    {
        ProcessData();
        Thread.Sleep(10);
    }
});

// GOOD - dedicated thread
Task.Factory.StartNew(
    () => LongRunningWork(),
    TaskCreationOptions.LongRunning
);`}
          />

          <Title level={5}>Nguyên nhân 3: Synchronous I/O</Title>
          <CodeBlock
            warning
            code={`// BAD
Parallel.For(0, 1000, i =>
{
    var data = File.ReadAllText($"file{i}.txt"); // Block!
    Process(data);
});

// GOOD
var tasks = Enumerable.Range(0, 1000).Select(async i =>
{
    var data = await File.ReadAllTextAsync($"file{i}.txt");
    Process(data);
});
await Task.WhenAll(tasks);`}
          />

          <Title level={5}>Giới hạn Concurrency:</Title>
          <CodeBlock
            recommended
            code={`var semaphore = new SemaphoreSlim(10); // Max 10 concurrent

var tasks = items.Select(async item =>
{
    await semaphore.WaitAsync();
    try
    {
        await ProcessItemAsync(item);
    }
    finally
    {
        semaphore.Release();
    }
});

await Task.WhenAll(tasks);`}
          />

          <Title level={5}>Monitoring:</Title>
          <CodeBlock
            code={`ThreadPool.GetAvailableThreads(out int workerThreads, out int ioThreads);
ThreadPool.GetMaxThreads(out int maxWorkerThreads, out int maxIoThreads);

Console.WriteLine($"Available: {workerThreads}/{maxWorkerThreads}");

if (workerThreads < maxWorkerThreads * 0.1)
{
    Console.WriteLine("WARNING: Thread pool near exhaustion!");
}`}
          />

          <Alert
            message="Best Practices"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Async all the way - không .Result, .Wait()</li>
                <li>ConfigureAwait(false) trong library code</li>
                <li>Giới hạn parallelism với SemaphoreSlim</li>
                <li>Dùng LongRunning cho background work</li>
                <li>Async I/O thay vì blocking I/O</li>
              </ul>
            }
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginTop: 16 }}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
          <CodeOutlined /> Câu hỏi phỏng vấn C# về Async/Await
        </Title>
        <Paragraph
          style={{ textAlign: "center", color: "#666", marginBottom: 24 }}
        >
          10 câu hỏi quan trọng về async/await, multithreading và concurrency
          trong C#
        </Paragraph>

        <Collapse
          activeKey={activeKeys}
          onChange={setActiveKeys}
          accordion={false}
        >
          {questions.map((q) => (
            <Panel
              header={
                <Space>
                  <Tag color="blue">#{q.key}</Tag>
                  <Text strong>{q.question}</Text>
                </Space>
              }
              key={q.key}
            >
              {q.content}
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
};

export default AsyncAwaitThreading;
