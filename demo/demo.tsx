/// <reference types="react" />
/// <reference types="react-dom" />

import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useTransition,
  useDeferredValue,
  useId,
  useInsertionEffect,
  useSyncExternalStore,
  Suspense,
  lazy,
  memo,
  forwardRef,
  ReactNode,
  FC,
  ComponentProps,
  PropsWithChildren,
} from "react";
import { createRoot } from "react-dom/client";
import type { ComponentPropsWithRef } from "react";

// ==================== INTERFACES & TYPES ====================
interface User {
  id: number;
  name: string;
  email?: string;
  role: "admin" | "user" | "guest";
}

type Status = "loading" | "success" | "error";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
}

// Discriminated union
type Notification =
  | { type: "success"; message: string; duration: number }
  | { type: "error"; message: string; errorCode?: string }
  | { type: "info"; message: string };

// ==================== UTILITY COMPONENTS ====================
const LazyComponent = lazy(() => import("./LazyComponent")); // Dynamic import

// Generic component
function List<T>({
  items,
  renderItem,
  keyExtractor,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// ==================== HOOKS EXAMPLES ====================
function HooksDemo() {
  // useState variants
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  // useReducer
  const [state, dispatch] = useReducer(
    (state: { count: number }, action: { type: "increment" | "decrement" }) => {
      switch (action.type) {
        case "increment":
          return { count: state.count + 1 };
        case "decrement":
          return { count: state.count - 1 };
        default:
          return state;
      }
    },
    { count: 0 },
  );

  // useRef
  const inputRef = useRef<HTMLInputElement>(null);
  const prevCountRef = useRef(0);

  // useEffect
  useEffect(() => {
    prevCountRef.current = count;
    document.title = `Count: ${count}`;
  }, [count]);

  useInsertionEffect(() => {
    console.log("CSS insertion");
  });

  // useMemo & useCallback
  const expensiveValue = useMemo(() => {
    return count * 100;
  }, [count]);

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // useTransition & useDeferredValue (React 18)
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.includes(deferredQuery));
  }, [deferredUsers, deferredQuery]);

  // useId (accessibility)
  const id = useId();

  // useSyncExternalStore (advanced)
  const storeValue = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div>
      <h1>
        Count: {count} (was: {prevCountRef.current})
      </h1>
      <button onClick={handleClick}>Increment</button>
      <input ref={inputRef} id={id} />
      <label htmlFor={id}>Label</label>
      <TransitionDemo />
      <DeferredSearch query={query} setQuery={setQuery} />
    </div>
  );
}

// ==================== CONTEXT ====================
const ThemeContext = React.createContext<"light" | "dark">("light");

function ThemedButton({ children }: PropsWithChildren) {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>{children}</button>;
}

// ==================== FORWARDREF & COMPOUND COMPONENTS ====================
const CustomInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={`input ${className}`} {...props} />
  ),
);

CustomInput.displayName = "CustomInput";

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// ==================== MAIN COMPONENTS ====================
const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className || ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

// Notification component (discriminated union)
function Notification({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case "success":
      return <div className="alert-success">{notification.message}</div>;
    case "error":
      return (
        <div className="alert-error">
          {notification.message}
          {notification.errorCode && <code>{notification.errorCode}</code>}
        </div>
      );
    case "info":
      return <div className="alert-info">{notification.message}</div>;
  }
}

// ==================== FRAGMENTS & LISTS ====================
function UserList({ users }: { users: User[] }) {
  return (
    <>
      <h2>Users ({users.length})</h2>
      <List<User>
        items={users}
        keyExtractor={(user) => user.id}
        renderItem={(user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email || "No email"}</p>
            <span className={`role-${user.role}`}>{user.role}</span>
          </div>
        )}
      />
    </>
  );
}

// ==================== FORMS ====================
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        aria-required="true"
      />

      <label htmlFor="email">Email:</label>
      <CustomInput
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="user@example.com"
      />

      <label htmlFor="message">Message:</label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        aria-describedby="msg-help"
      />
      <small id="msg-help">Max 500 characters</small>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}

// ==================== SUSPENSE & LAZY ====================
function App() {
  return (
    <ErrorBoundary>
      <ThemeContext.Provider value="dark">
        <div className="app">
          <header>
            <h1>TSX Theme Fixture</h1>
            <nav aria-label="Main navigation">
              <a href="#hooks">Hooks</a>
              <a href="#forms">Forms</a>
              <a href="#list">Users</a>
            </nav>
          </header>

          <main>
            <HooksDemo />
            <ContactForm />

            <section id="list">
              <UserList users={users} />
            </section>

            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </Suspense>
          </main>

          <Notification notification={sampleNotification} />

          <footer role="contentinfo">
            <Button variant="secondary" onClick={() => console.log("clicked")}>
              Theme Test Complete
            </Button>
          </footer>
        </div>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}

// ==================== DATA ====================
const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Smith", role: "user" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "guest" },
];

const sampleNotification: Notification = {
  type: "success",
  message: "Theme fixture loaded successfully!",
  duration: 5000,
};

// ==================== TRANSITION & DEFERRED ====================
function TransitionDemo() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <button onClick={() => handleTabChange("home")}>
        {isPending ? "Loading..." : "Home"}
      </button>
      <p>Current tab: {tab}</p>
    </div>
  );
}

function DeferredSearch({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Deferred: "{deferredQuery}"</p>
    </div>
  );
}

// Mount
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
