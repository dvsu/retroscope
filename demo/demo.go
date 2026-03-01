//go:build linux || (darwin && amd64) || !386
// +build linux darwin,amd64 !386

//go:generate go test -run=^TestFuzz$ -fuzz=Fuzz
//go:generate stringer -type=Color

/*
Go theme fixture: all language features from Go 1.23
Tests VSCode Go extension tokens: keyword, builtin, type, literal, etc.
*/

// Package declaration + imports (grouped std/3rd-party)
package theme

import (
	"bytes"
	"context"
	"embed"
	"errors"
	"flag"
	"fmt"
	"io"
	"math"
	"math/rand"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"text/template"
	"time"

	"golang.org/x/sync/errgroup" // 3rd-party style
)

// Constants: untyped/typed/bool/string/rune/byte/iota
const (
	Unspecified   = iota
	Enabled       = 1 << iota // Bit shift
	Disabled     float64 = 0
	PI                    = 3.14159
	MaxInt          int   = math.MaxInt
	Version         string = "1.23.0"
	EOF                     = '\r' // rune literal
	ByteLit           byte = 'a' // byte alias
	TrueBool            = true
)

// Variables: short/zero/blank (_)
var (
	globalVar string = "global"
	zeroInt   int
	zeroPtr   *int
	_         = zeroPtr // blank identifier
)

// Iota advanced patterns
const (
	_  = iota          // skip 0
	Sun  Color = iota   // 1
	Mon               // 2
	Tue               // 3
	Thu               // 5 (iota++)
	Fri = 1 << iota   // 8
	Sat               // 16
)

// Type aliases (1.9+)
type (
	StringSlice []string
	IntMap     map[string]int
)

// Basic types + arrays/slices/maps/channels/interfaces
type Config struct {
	Name        string
	Port        uint16
	Timeout     time.Duration
	Debug       bool
	Data        []byte
	Items       []string
	Nested      map[string]any
	Array       [3]int
	Slice       []int
	Chan        chan string
	ChanRW      chan<- string
	ChanRO      <-chan int
}

// Generics (1.18+): type constraints, functions, methods
type Comparable interface {
	~int | ~string | ~float64
}

type Ordered interface {
	comparable
	~int | ~uint | ~float64
}


func SumIntsOrFloats[K comparable, V ~int | ~float64](m map[K]V) V {
	var s V
	for _, v := range m {
		s += v
	}
	return s
}

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v, true
}

// Enums via iota + stringer
type Color int

const (
	Red Color = iota
	Green
	Blue
)

// Structs: tagged fields, embedded, anonymous
type Person struct {
	name    string
	age     int `json:"age" yaml:"age"`
	private string
}

type Employee struct {
	Person        // Embedded struct
	salary float64
	Role
}

type Role struct {
	title string
}

// Pointer receivers + methods
func (p *Person) Birthday() {
	p.age++
}

func (p Person) FullName() string { // Value receiver
	return p.name
}

// Interfaces: empty, multiple methods, embedded, union (1.18+)
type Writer interface {
	Write([]byte) (int, error)
}

type Closer interface {
	Close() error
}

type ReadWriter interface {
	Writer
	io.Reader
}

type Stringer interface {
	String() string
}

// Interface with generics
type Formatter[T any] interface {
	comparable
	Format() string
}

// Functions: multi-return, variadic, defer
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("divide by zero")
	}
	return a / b, nil
}

func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

// Error handling: errors.Is/As/Is (1.13+)
var ErrNotFound = errors.New("not found")

func (p *Person) Error() string {
	return fmt.Sprintf("person %s not found", p.name)
}

// Goroutines + channels + select
func worker(ctx context.Context, ch chan<- string) {
	defer func() {
		if r := recover(); r != nil {
			ch <- fmt.Sprintf("panic: %v", r)
		}
	}()

	select {
	case <-ctx.Done():
		ch <- "cancelled"
	case ch <- "done":
	default:
		ch <- "blocked"
	}
}

// Mutex + atomic
var counter int64

func increment() {
	atomic.AddInt64(&counter, 1)
}

type SafeCounter struct {
	mu    sync.Mutex
	count int64
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.count++
}

// Range: slice/map/string/channel
func rangeDemo() {
	numbers := []int{1, 2, 3}
	for i, v := range numbers {
		fmt.Printf("index %d: %d\n", i, v)
	}

	m := map[string]int{"a": 1, "b": 2}
	for k, v := range m {
		fmt.Printf("%s=%d\n", k, v)
	}

	for i, r := range "hello" { // rune
		fmt.Printf("%d: %c\n", i, r)
	}

	ch := make(chan int)
	go func() { ch <- 42; close(ch) }()
	for v := range ch {
		fmt.Println(v)
	}
}

// Switch: type switch + expression switch (1.18+)
func describe(i any) {
	switch v := i.(type) {
	case int:
		fmt.Println("int:", v)
	case string:
		fmt.Println("string:", v)
	case nil:
		fmt.Println("nil")
	default:
		fmt.Printf("unknown type %T\n", v)
	}
}

func status(code int) string {
	switch {
	case code >= 200 && code < 300:
		return "2xx"
	case code >= 400 && code < 500:
		return "4xx"
	default:
		return "other"
	}
}

// Go embed (1.16+)
var (
	//go:embed static/*
	Static embed.FS
	//go:embed templates/*.tmpl
	templates embed.FS
)

// Template
var tmpl = template.Must(template.New("test").Parse(`Hello {{.Name}}`))

// Regex
var emailRE = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

// Context + errgroup
func parallel(ctx context.Context) error {
	g, ctx := errgroup.WithContext(ctx)
	
	g.Go(func() error {
		return fmt.Errorf("worker 1 failed")
	})
	
	return g.Wait()
}

// Testing + fuzzing (1.18+)
func FuzzParseInt(f *testing.F) {
	f.Add("123")
	f.Add("abc")
	f.Fuzz(func(t *testing.T, s string) {
		n, err := strconv.Atoi(s)
		if err != nil && s != "" {
			t.Skip()
		}
		_ = n
	})
}

func TestSum(t *testing.T) {
	if got, want := sum(1, 2, 3), 6; got != want {
		t.Errorf("sum() = %d, want %d", got, want)
	}
}

// Benchmark
func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		sum(1, 2, 3)
	}
}

// Build constraints
//go:build !js || wasm

// Init function (runs before main)
func init() {
	rand.Seed(time.Now().UnixNano())
	fmt.Println("init called")
}

// Main + command-line flags
func main() {
	var (
		_    = flag.Int("port", 8080, "port to listen")
		_    = flag.Bool("v", false, "verbose mode")
	)
	flag.Parse()

	p := Person{name: "Alice", age: 30}
	p.Birthday()
	fmt.Println(p.FullName(), p.age)

	// Goroutines
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	ch := make(chan string)
	go worker(ctx, ch)
	
	select {
	case msg := <-ch:
		fmt.Println(msg)
	case <-ctx.Done():
		fmt.Println("timeout")
	}
	
	// Generics
	m := map[string]int{"a": 1, "b": 2}
	fmt.Println(SumIntsOrFloats(m))
	
	stack := Stack[int]{}
	stack.Push(1)
	stack.Push(2)
	
	if v, ok := stack.Pop(); ok {
		fmt.Println(v)
	}
	
	// Methods
	emp := Employee{Person: Person{name: "Bob"}, salary: 50000}
	fmt.Println(emp.FullName(), emp.salary)
	
	// Interfaces
	var w io.Writer = bytes.Buffer{}
	fmt.Fprint(w, "interface")
	
	describe(42)
	describe("hello")
	
	// Defer + panic/recover
	defer fmt.Println("deferred")
	panic("test panic") // caught by worker
}

// Fuzz target
func FuzzHTTPHeaders(f *testing.F) {
	f.Fuzz(func(t *testing.T, headers string) {
		req, _ := http.NewRequest("GET", "/", strings.NewReader(headers))
		_ = req.Header
	})
}
